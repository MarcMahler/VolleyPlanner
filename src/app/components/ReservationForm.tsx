import { useState } from 'react';
import { Appointment, Team } from '../App';

interface ReservationFormProps {
  appointment: Appointment;
  team: Team;
  onSubmit: (name: string, teamName: string, email: string) => void;
  onCancel: () => void;
}

export function ReservationForm({ appointment, team, onSubmit, onCancel }: ReservationFormProps) {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && teamName.trim() && email.trim()) {
      onSubmit(name, teamName, email);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="mb-6 text-gray-900">Reservierung abschließen</h2>

      <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Gewählter Termin:</h3>
        <div className="space-y-1 text-gray-700">
          <p><span className="font-medium">Team:</span> {team}</p>
          <p><span className="font-medium">Datum:</span> {formatDate(appointment.date)}</p>
          <p><span className="font-medium">Uhrzeit:</span> {appointment.time.substring(0, 5)} Uhr</p>
          <p><span className="font-medium">Standort:</span> {appointment.location}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 mb-2">
            Ihr Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Max Mustermann"
          />
        </div>

        <div>
          <label htmlFor="teamName" className="block font-medium text-gray-700 mb-2">
            Mannschaftsname *
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="VBC Beispiel"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 mb-2">
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="beispiel@email.de"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-md font-medium"
          >
            Reservierung abschließen
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
