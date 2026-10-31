import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../lib/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err instanceof ApiRequestError) {
        if (err.code === 'invalid_credentials') {
          setErrorMsg('Invalid email or password.');
        } else {
          setErrorMsg(err.message || 'Could not log in. Please check your credentials.');
        }
      } else {
        setErrorMsg('Network or server error. Please try again in a moment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-gutter py-space-xl">
      <div className="w-full max-w-md bg-surface-container-lowest p-space-xl rounded-2xl shadow-xl border border-outline-variant/20 flex flex-col gap-space-md">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-xl mx-auto mb-3">
            C
          </div>
          <h1 className="font-headline-lg text-on-surface">Welcome back</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Sign in so only you can see your reports.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-error-container/60 border border-error/30 text-on-error-container p-3 rounded-lg text-body-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md mt-2">
          <div>
            <label className="block text-label-md text-on-surface mb-1">Email address</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-space-md py-3 rounded-xl border border-outline-variant/40 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-body-md text-on-surface transition-all"
            />
          </div>

          <div>
            <label className="block text-label-md text-on-surface mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-space-md py-3 rounded-xl border border-outline-variant/40 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-body-md text-on-surface transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md py-3.5 rounded-xl shadow-md transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-surface-container-high text-body-sm text-on-surface-variant">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-label-sm text-on-surface-variant/80">
          <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
          <span>We store only your email and hashed password</span>
        </div>
      </div>
    </div>
  );
};
