import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Appointment } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2, RotateCcw, Clock, CheckSquare, Square } from 'lucide-react';

interface AdminDashboardProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

export function AdminDashboard({ appointments, onRefresh }: AdminDashboardProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkTime, setBulkTime] = useState('20:30');
  const [showBulkTimeEdit, setShowBulkTimeEdit] = useState(false);

  // Generate 15-minute intervals for time selection
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      timeOptions.push(`${h}:${m}`);
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === appointments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(appointments.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`${selectedIds.length} Termine wirklich löschen?`)) return;

    setLoadingId('bulk');
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;
      setSelectedIds([]);
      onRefresh();
    } catch (err) {
      console.error('Fehler beim Massen-Löschen:', err);
      alert('Löschen fehlgeschlagen.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleBulkTimeUpdate = async () => {
    if (selectedIds.length === 0) return;
    
    setLoadingId('bulk');
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ time: bulkTime })
        .in('id', selectedIds);

      if (error) throw error;
      setSelectedIds([]);
      setShowBulkTimeEdit(false);
      onRefresh();
    } catch (err) {
      console.error('Fehler beim Massen-Update der Zeit:', err);
      alert('Update fehlgeschlagen.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Diesen Termin wirklich löschen?')) return;
    
    setLoadingId(id);
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      alert('Löschen fehlgeschlagen.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnreserve = async (id: string) => {
    if (!confirm('Reservierung für diesen Termin wirklich aufheben?')) return;

    setLoadingId(id);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          reserved: false,
          reservedby: null
        })
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (err) {
      console.error('Fehler beim Aufheben der Reservierung:', err);
      alert('Aktion fehlgeschlagen.');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Termin-Verwaltung</CardTitle>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium text-gray-600 mr-2">
              {selectedIds.length} ausgewählt
            </span>
            
            {showBulkTimeEdit ? (
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md border border-orange-200">
                <select
                  value={bulkTime}
                  onChange={(e) => setBulkTime(e.target.value)}
                  className="h-8 rounded border-gray-300 text-sm focus:ring-orange-500"
                >
                  {timeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <Button size="sm" className="h-8 bg-orange-500 hover:bg-orange-600" onClick={handleBulkTimeUpdate} disabled={loadingId === 'bulk'}>
                  Übernehmen
                </Button>
                <Button size="sm" variant="ghost" className="h-8" onClick={() => setShowBulkTimeEdit(false)}>
                  Abbrechen
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50"
                  onClick={() => setShowBulkTimeEdit(true)}
                >
                  <Clock className="h-4 w-4 mr-1" /> Zeit ändern
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleBulkDelete}
                  disabled={loadingId === 'bulk'}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Löschen
                </Button>
              </>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 px-4 w-10">
                  <button 
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {selectedIds.length === appointments.length && appointments.length > 0 ? (
                      <CheckSquare className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </th>
                <th className="py-2 px-4">Team</th>
                <th className="py-2 px-4">Datum</th>
                <th className="py-2 px-4">Zeit</th>
                <th className="py-2 px-4">Ort</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Reserviert von</th>
                <th className="py-2 px-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 italic">
                    Keine Termine vorhanden.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr 
                    key={apt.id} 
                    className={`border-b hover:bg-gray-50 transition-colors ${selectedIds.includes(apt.id) ? 'bg-orange-50/50' : ''}`}
                  >
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => toggleSelect(apt.id)}
                        className="transition-colors"
                      >
                        {selectedIds.includes(apt.id) ? (
                          <CheckSquare className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="py-2 px-4 font-bold text-orange-600">{apt.team}</td>
                    <td className="py-2 px-4">{formatDate(apt.date)}</td>
                    <td className="py-2 px-4">{apt.time.substring(0, 5)}</td>
                    <td className="py-2 px-4 font-medium">{apt.location}</td>
                    <td className="py-2 px-4">
                      {apt.reserved ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          Reserviert
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Frei
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-xs">
                      {apt.reservedby ? (
                        <div>
                          <p className="font-bold text-gray-900">{apt.reservedby.teamName}</p>
                          <p className="text-gray-600">{apt.reservedby.name} ({apt.reservedby.email})</p>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {apt.reserved && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                            title="Reservierung aufheben"
                            onClick={() => handleUnreserve(apt.id)}
                            disabled={loadingId === apt.id}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          title="Termin löschen"
                          onClick={() => handleDelete(apt.id)}
                          disabled={loadingId === apt.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
