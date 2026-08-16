import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';

export function AdminLoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else if (mode === 'signup') {
      // After signup, Supabase auto-signs in (email confirmation off)
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-ink">
              {mode === 'login' ? 'Espace administrateur' : 'Créer un compte admin'}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              {mode === 'login'
                ? 'Connectez-vous pour gérer votre tableau de bord'
                : 'Créez votre compte pour accéder à l\'administration'}
            </p>
          </div>

          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@mikeservice.ci"
                  />
                </div>
              </div>
              <div>
                <label className="label-field">Mot de passe</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full disabled:opacity-50"
              >
                {submitting ? (
                  'Chargement...'
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Créer le compte
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 border-t border-cream-dark pt-4 text-center">
              {mode === 'login' ? (
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-sm text-ink-soft hover:text-gold"
                >
                  Pas de compte ? Créer un compte admin
                </button>
              ) : (
                <button
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-sm text-ink-soft hover:text-gold"
                >
                  Déjà un compte ? Se connecter
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour au site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
      }
      
