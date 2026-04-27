import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../lib/api';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location?.state?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-green/15 border border-primary-green/30 mx-auto flex items-center justify-center">
            <Lock size={18} className="text-primary-green" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-4">Welcome back</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to continue resolving city issues.</p>
        </div>

        <GlassCard elevated className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl"
                  placeholder="you@domain.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-green text-background font-semibold hover:bg-accent-lime transition-colors disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
              <ArrowRight size={16} />
            </button>

            <p className="text-sm text-text-muted text-center">
              New here?{' '}
              <Link className="text-primary-green hover:text-accent-lime font-semibold" to="/register">
                Create an account
              </Link>
            </p>
          </form>
        </GlassCard>

        <p className="text-xs text-text-muted text-center mt-4">
          Demo accounts: run server seed to create admin/citizen.
        </p>
      </div>
    </div>
  );
};
