import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Lock, ShieldCheck, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLoginProps {
  team: string | null;
  onLogin: () => void;
  onCancel: () => void;
}

export function AdminLogin({ team, onLogin, onCancel }: AdminLoginProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatischer Login-Versuch bei 4 Stellen
  useEffect(() => {
    if (code.length === 4) {
      handleLogin();
    }
  }, [code]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length < 4) return;

    setLoading(true);
    setError(null);

    // Verzögerung für besseres Feedback
    setTimeout(() => {
      if (code === '1234') {
        onLogin();
      } else {
        setError('Falscher Code. Bitte versuchen Sie es erneut.');
        setLoading(false);
        setCode(''); // Code bei Fehler zurücksetzen
      }
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2 border-orange-100 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
        <CardHeader className="space-y-1 pb-4">
          <div className="mx-auto bg-orange-100 p-3 rounded-full mb-2 w-fit">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            {team ? (
              <span className="flex items-center justify-center gap-1.5 text-orange-700 font-semibold bg-orange-50 py-1 px-3 rounded-full w-fit mx-auto">
                <ShieldCheck className="w-4 h-4" />
                Team {team}
              </span>
            ) : (
              <span className="text-gray-500 italic">Allgemeiner Systemzugriff</span>
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 pt-2">
            <div className="space-y-4">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700 block text-center">
                4-stelliger Sicherheitscode
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={4}
                  value={code}
                  onChange={(val) => setCode(val)}
                  disabled={loading}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2 border-orange-100 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-all shadow-sm" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2 border-orange-100 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-all shadow-sm" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2 border-orange-100 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-all shadow-sm" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2 border-orange-100 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-all shadow-sm" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">Demo: 1234</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 flex items-center gap-2 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 text-lg shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.98]"
              disabled={loading || code.length < 4}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifiziere...
                </span>
              ) : (
                'Zugriff gewähren'
              )}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={onCancel}
              className="w-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück zum Kalender
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
