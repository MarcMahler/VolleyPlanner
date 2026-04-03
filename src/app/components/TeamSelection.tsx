import { Team } from '../App';

interface TeamSelectionProps {
  onSelectTeam: (team: Team) => void;
}

const teams: Team[] = ['H1', 'H2', 'D1', 'D2', 'D3', 'D4', 'D5'];

export function TeamSelection({ onSelectTeam }: TeamSelectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="mb-6 text-center text-gray-900">Wählen Sie Ihr Team</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => onSelectTeam(team)}
            className="bg-orange-500 text-white py-6 px-4 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md"
          >
            <span className="font-bold text-2xl">{team}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
