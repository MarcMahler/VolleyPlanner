import { Appointment, Team } from '../App';

interface AppointmentListProps {
  team: Team;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export function AppointmentList({ team, appointments, onSelectAppointment }: AppointmentListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Keine Termine für Team {team} verfügbar.</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => onSelectAppointment(appointment)}
              className={`p-6 rounded-lg border-2 transition-all ${
                appointment.reserved
                  ? 'bg-gray-100 border-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-white border-orange-300 hover:border-orange-500 hover:shadow-md cursor-pointer'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-lg font-semibold text-gray-800">
                      {formatDate(appointment.date)}
                    </span>
                    <div className="flex items-center gap-1 text-orange-600 font-bold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                      </svg>
                      <span>{appointment.time.substring(0, 5)} Uhr</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{appointment.location}</span>
                  </div>
                </div>
                <div>
                  {appointment.reserved ? (
                    <span className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium">
                      Reserviert
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium">
                      Verfügbar
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
