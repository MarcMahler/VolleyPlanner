import { useState, useEffect } from 'react';
import { TeamSelection } from './components/TeamSelection';
import { AppointmentList } from './components/AppointmentList';
import { AppointmentCalendar } from './components/AppointmentCalendar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ReservationForm } from './components/ReservationForm';
import { AdminLogin } from './components/AdminLogin';
import { AddAppointmentForm } from './components/AddAppointmentForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { supabase } from '../lib/supabase';
import { Button } from './components/ui/button';
import { LayoutGrid, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';

export type Team = 'H1' | 'H2' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'U16' | 'U18' | 'U20' | 'U23';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  team: string;
  reserved: boolean;
  reservedby?: {
    name: string;
    teamName: string;
    email: string;
  };
}

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [session, setSession] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAdminAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedTeam]);

  useEffect(() => {
    // Auth-Status von Supabase prüfen (optional, falls noch genutzt)
    try {
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
        }
      }).catch((err: any) => console.error("Session error:", err));

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setSession(session);
        if (session) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      });

      return () => subscription.unsubscribe();
    } catch (err) {
      console.error("Auth initialization error:", err);
    }
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (selectedTeam) {
        query = query.eq('team', selectedTeam);
      }

      const response = await query;

      if (response.error) throw response.error;
      if (response.data) {
        const sortedData = [...response.data].sort((a, b) => {
          // Zuerst nach reserviert-Status: nicht reserviert (false) kommt vor reserviert (true)
          if (a.reserved !== b.reserved) {
            return a.reserved ? 1 : -1;
          }
          // Innerhalb des Status nach Datum sortieren
          if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
          }
          // Innerhalb des Datums nach Zeit sortieren
          return a.time.localeCompare(b.time);
        });
        setAppointments(sortedData);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Termine:', err);
      // Fallback zu leeren Terminen bei Fehler
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setSelectedAppointment(null);
  };

  const handleAppointmentSelect = (appointment: Appointment) => {
    if (!appointment.reserved) {
      setSelectedAppointment(appointment);
    }
  };

  const handleReservation = async (name: string, teamName: string, email: string) => {
    if (selectedAppointment) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({
            reserved: true,
            reservedby: { name, teamName, email }
          })
          .eq('id', selectedAppointment.id);

        if (error) throw error;

        // Neu laden von Supabase statt nur lokalem State Update
        await fetchAppointments();
        setSelectedAppointment(null);
      } catch (err) {
        console.error('Fehler bei der Reservierung:', err);
        alert('Reservierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    }
  };

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
    setIsAdminMode(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase logout error:", err);
    }
    setIsAuthenticated(false);
    setIsAdminMode(false);
    // Wir bleiben beim aktuell ausgewählten Team, damit der User nicht
    // verwirrt ist, wo er gerade war.
  };

  const handleBack = () => {
    if (selectedAppointment) {
      setSelectedAppointment(null);
    } else if (selectedTeam) {
      setSelectedTeam(null);
    } else if (isAdminMode) {
      setIsAdminMode(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-16 relative pt-4 md:pt-8">
          <div className="absolute top-0 right-0 p-2 sm:p-0 flex items-center gap-3 z-20">
            {selectedTeam && (
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-full px-3 py-1.5 shadow-sm">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 mr-1 sm:mr-2">
                      <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]`}></div>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-900">Admin</span>
                    </div>
                    <div className="h-4 w-[1px] bg-orange-100 mx-0.5 sm:mx-1"></div>
                    <div className="flex items-center gap-2 scale-75 sm:scale-90">
                      <Switch 
                        id="header-admin-toggle" 
                        checked={isAdminMode} 
                        onCheckedChange={(checked) => setIsAdminMode(checked)}
                      />
                    </div>
                    <div className="h-4 w-[1px] bg-orange-100 mx-0.5 sm:mx-1"></div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout} 
                      className="h-6 sm:h-7 px-1.5 sm:px-2 text-[9px] sm:text-[10px] uppercase font-bold text-gray-800 hover:text-red-500 hover:bg-transparent transition-colors"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsAdminMode(true)} 
                    className="h-6 sm:h-7 px-1.5 sm:px-2 text-[9px] sm:text-[10px] uppercase font-bold text-gray-800 hover:text-orange-600 hover:bg-transparent transition-colors"
                  >
                    Login
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="inline-block mb-6 relative mt-12 sm:mt-0">
            <div className="absolute -inset-4 bg-orange-500/10 blur-3xl rounded-full -z-10"></div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">
              Gameday <span className="text-orange-500">Planner</span>
            </h1>
          </div>
          
          {!selectedTeam && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
                Für welches Team von Wädivolley möchtest du einen Spiel-Termin vereinbaren?
              </h2>
              <p className="text-gray-500 text-lg">
                Wählen Sie Ihr Team unten aus, um verfügbare Spieltage zu sehen und zu reservieren.
              </p>
            </div>
          )}
        </header>

        {isAdminMode && !isAuthenticated && (
          <AdminLogin 
            team={selectedTeam} 
            onLogin={handleAdminLogin} 
            onCancel={() => setIsAdminMode(false)} 
          />
        )}

        {isAdminMode && isAuthenticated && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <span className="block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">Team {selectedTeam}</h3>
                  <p className="text-sm text-gray-600">Admin-Verwaltung aktiv</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-orange-500 hover:bg-orange-600 h-9 text-sm"
                >
                  {showAddForm ? 'Verwaltung anzeigen' : 'Neuen Termin hinzufügen'}
                </Button>
              </div>
            </div>
            
            {showAddForm ? (
              <AddAppointmentForm 
                team={selectedTeam}
                onSuccess={() => { fetchAppointments(); }} 
                onCancel={() => setShowAddForm(false)}
                keepOpen={true}
              />
            ) : (
              <AdminDashboard 
                appointments={appointments} 
                onRefresh={fetchAppointments} 
              />
            )}
          </div>
        )}

        {!isAdminMode && !selectedTeam && (
          <TeamSelection onSelectTeam={handleTeamSelect} />
        )}

        {!isAdminMode && selectedTeam && !selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-gray-900 text-xl">Team {selectedTeam}</h3>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${
                        viewMode === 'list'
                          ? 'bg-white shadow-sm text-orange-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Listenansicht"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span className="hidden sm:inline">Liste</span>
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${
                        viewMode === 'calendar'
                          ? 'bg-white shadow-sm text-orange-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Kalenderansicht"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Kalender</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {viewMode === 'list' ? 'Alle verfügbaren Termine in der Übersicht' : 'Wählen Sie einen Tag im Kalender'}
                </p>
              </div>
              {!isAdminMode && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-orange-500 hover:bg-orange-50 font-medium flex items-center gap-2 ml-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Team wechseln</span>
                </Button>
              )}
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : viewMode === 'list' ? (
              <AppointmentList
                team={selectedTeam}
                appointments={appointments}
                onSelectAppointment={handleAppointmentSelect}
              />
            ) : (
              <AppointmentCalendar
                appointments={appointments}
                onSelectAppointment={handleAppointmentSelect}
              />
            )}
          </div>
        )}

        {selectedAppointment && (
          <div>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6 text-orange-500 hover:text-orange-400 flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Terminübersicht
            </Button>
            <ReservationForm
              appointment={selectedAppointment}
              team={selectedTeam!}
              onSubmit={handleReservation}
              onCancel={() => setSelectedAppointment(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
