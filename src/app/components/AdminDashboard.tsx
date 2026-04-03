import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Appointment } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2, RotateCcw } from 'lucide-react';

interface AdminDashboardProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

export function AdminDashboard({ appointments, onRefresh }: AdminDashboardProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
      <CardHeader>
        <CardTitle>Termin-Verwaltung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
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
                  <td colSpan={7} className="py-8 text-center text-gray-500 italic">
                    Keine Termine vorhanden.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="border-b hover:bg-gray-50">
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
