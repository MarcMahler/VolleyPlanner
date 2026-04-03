import { Team } from '../App';
import { Mars, Venus, Users } from 'lucide-react';

interface TeamSelectionProps {
  onSelectTeam: (team: Team) => void;
}

const maleTeams: Team[] = ['H1', 'H2'];
const femaleTeams: Team[] = ['D1', 'D2', 'D3', 'D4', 'D5'];
const juniorTeams: Team[] = ['U16', 'U18', 'U20', 'U23'];

export function TeamSelection({ onSelectTeam }: TeamSelectionProps) {
  const renderTeamSection = (title: string, teams: Team[], icon: React.ReactNode, accentColor: string) => (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`p-2 rounded-full ${accentColor} bg-opacity-10`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => onSelectTeam(team)}
            className="relative bg-orange-500 text-white w-20 h-20 sm:w-24 sm:h-24 rounded-2xl hover:bg-orange-600 transition-all transform hover:scale-110 shadow-md hover:shadow-xl active:scale-95 flex flex-col items-center justify-center group overflow-hidden"
          >
            {/* Subtle gender accent background */}
            <div className={`absolute inset-0 ${accentColor.replace('text-', 'bg-')} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <span className="font-bold text-2xl group-hover:scale-110 transition-transform relative z-10">{team}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-14 border border-white/50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Team-Auswahl</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full shadow-sm"></div>
      </div>
      
      <div className="space-y-12">
        {renderTeamSection(
          "Herren", 
          maleTeams, 
          <Mars className="w-6 h-6" />, 
          "text-blue-500"
        )}
        
        {renderTeamSection(
          "Damen", 
          femaleTeams, 
          <Venus className="w-6 h-6" />, 
          "text-pink-500"
        )}
        
        {renderTeamSection(
          "Junioren", 
          juniorTeams, 
          <Users className="w-6 h-6" />, 
          "text-emerald-500"
        )}
      </div>
    </div>
  );
}
