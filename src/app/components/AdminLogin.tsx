import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

interface AdminLoginProps {
  team: string | null;
  onLogin: () => void;
  onCancel: () => void;
}

export function AdminLogin({ team, onLogin, onCancel }: AdminLoginProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Der gewünschte 4-stellige Code
    if (code === '1234') {
      // In einer echten App würde man hier eine Session setzen
      // Für diese Demo/Anforderung nutzen wir den Code direkt
      onLogin();
    } else {
      setError('Falscher Code. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Admin Login</CardTitle>
        {team ? (
          <p className="text-center text-orange-600 font-bold">für Team {team}</p>
        ) : (
          <p className="text-center text-gray-500 text-sm italic">Kein Team ausgewählt (Allgemeiner Zugriff)</p>
        )}
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="code" className="text-gray-600 font-medium">4-stelliger Admin-Code</Label>
            <div className="flex justify-center">
              <Input
                id="code"
                type="password"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="****"
                required
                autoFocus
                className="text-center text-3xl tracking-[1em] h-16 w-48 font-mono border-2 border-orange-200 focus:border-orange-500 transition-all shadow-inner"
              />
            </div>
            <p className="text-center text-xs text-gray-400">Standard-Code für Demo: 1234</p>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100 animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-lg shadow-md" disabled={loading}>
            {loading ? 'Anmelden...' : 'Anmelden'}
          </Button>
          <Button variant="ghost" type="button" onClick={onCancel} className="w-full text-gray-500">
            Abbrechen
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
