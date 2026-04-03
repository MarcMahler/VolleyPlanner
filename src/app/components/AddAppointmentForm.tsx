import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

interface AddAppointmentFormProps {
  team: string | null;
  onSuccess: () => void;
  onCancel: () => void;
  keepOpen?: boolean;
}

export function AddAppointmentForm({ team, onSuccess, onCancel, keepOpen = false }: AddAppointmentFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:30');
  const [location, setLocation] = useState('');
  const [targetTeam, setTargetTeam] = useState(team || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Generate 15-minute intervals for time selection
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      timeOptions.push(`${h}:${m}`);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTeam) {
      setError('Bitte wählen Sie ein Team aus.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          { date, time, location, team: targetTeam, reserved: false }
        ]);

      if (error) throw error;
      
      setSuccess(true);
      onSuccess(); // Immer benachrichtigen, damit die Liste im Hintergrund aktualisiert wird
      
      if (keepOpen) {
        // Formular zurücksetzen für den nächsten Termin
        // Reset time to default 20:30 instead of empty
        setTime('20:30');
      }
    } catch (err: any) {
      setError(err.message || 'Termin konnte nicht gespeichert werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Neuen Termin hinzufügen</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Datum</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Uhrzeit (15min Intervalle)</Label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {timeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ort</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Sporthalle Nord"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <select
              id="team"
              value={targetTeam}
              onChange={(e) => setTargetTeam(e.target.value)}
              required
              disabled={!!team}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Team wählen...</option>
              <option value="H1">H1</option>
              <option value="H2">H2</option>
              <option value="D1">D1</option>
              <option value="D2">D2</option>
              <option value="D3">D3</option>
              <option value="D4">D4</option>
              <option value="D5">D5</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && keepOpen && <p className="text-sm text-green-500 font-medium">Termin wurde erfolgreich hinzugefügt!</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Schließen
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Speichern...' : 'Hinzufügen'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
