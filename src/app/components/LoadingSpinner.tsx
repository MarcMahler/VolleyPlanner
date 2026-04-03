import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
      <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
      <p className="text-gray-500 font-medium italic">Termine werden geladen...</p>
    </div>
  );
}
