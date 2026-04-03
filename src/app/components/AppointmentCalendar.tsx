import { Calendar } from './ui/calendar';
import { Appointment } from '../App';
import { useState, useMemo } from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from './ui/utils';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export function AppointmentCalendar({ appointments, onSelectAppointment }: AppointmentCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  // Termine nach Datum gruppieren für schnellen Zugriff
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach(app => {
      if (!map[app.date]) {
        map[app.date] = [];
      }
      map[app.date].push(app);
    });
    return map;
  }, [appointments]);

  // Modifikatoren für den Kalender
  const modifiers = {
    hasAppointment: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return !!appointmentsByDate[dateStr];
    },
    allReserved: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayApps = appointmentsByDate[dateStr];
      return dayApps && dayApps.length > 0 && dayApps.every(app => app.reserved);
    },
    hasAvailable: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayApps = appointmentsByDate[dateStr];
      return dayApps && dayApps.some(app => !app.reserved);
    }
  };

  const modifiersStyles = {
    hasAppointment: { fontWeight: 'bold' as const },
    allReserved: { color: 'gray' },
    hasAvailable: { color: '#f97316' } // orange-500
  };

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDay) return [];
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return appointmentsByDate[dateStr] || [];
  }, [selectedDay, appointmentsByDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 border-gray-100">
        <Calendar
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          locale={de}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border-0"
        />
      </div>

      <div className="pt-6 md:pt-0">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">
          {selectedDay ? format(selectedDay, 'eeee, d. MMMM', { locale: de }) : 'Wählen Sie einen Tag'}
        </h4>

        <div className="space-y-3">
          {selectedDayAppointments.length === 0 ? (
            <p className="text-gray-500 italic">Keine Termine an diesem Tag.</p>
          ) : (
            selectedDayAppointments.map((app) => (
              <div
                key={app.id}
                onClick={() => !app.reserved && onSelectAppointment(app)}
                className={cn(
                  "p-4 rounded-lg border transition-all flex justify-between items-center",
                  app.reserved
                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                    : "bg-orange-50 border-orange-200 hover:border-orange-400 cursor-pointer shadow-sm hover:shadow-md"
                )}
              >
                <div>
                  <div className="font-bold text-gray-800">{app.time.substring(0, 5)} Uhr</div>
                  <div className="text-sm text-gray-600">{app.location}</div>
                </div>
                <div>
                  {app.reserved ? (
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">Reserviert</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-orange-500 text-white rounded">Buchen</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
