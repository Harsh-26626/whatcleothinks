import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../lib/api';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(email, password);
      navigate('/new', { replace: true });
    } catch (err: any) {
      if (err instanceof ApiRequestError) {
        if (err.code === 'invalid_email') {
          setErrorMsg('Please enter a valid email address.');
        } else if (err.code === 'weak_password') {
          setErrorMsg('Password must be at least 8 characters.');
        } else if (err.code === 'email_taken') {
          setErrorMsg('An account with this email already exists. Try logging in instead.');
        } else {
          setErrorMsg(err.message || 'Could not create account. Please try again.');
        }
      } else {
        setErrorMsg('Network or connection issue. Please verify your backend server.');
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
          <h1 className="font-headline-lg text-on-surface">Create your sanctuary</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            An account is needed so only you can see your reports.
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
            <label className="block text-label-md text-on-surface mb-1">
              Password <span className="text-on-surface-variant font-normal text-xs">(minimum 8 characters)</span>
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-space-md py-3 rounded-xl border border-outline-variant/40 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-body-md text-on-surface transition-all"
            />
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl text-body-sm text-on-surface-variant flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">verified_user</span>
            <span>We never store plain passwords. Passwords are salted and hashed with bcrypt.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md py-3.5 rounded-xl shadow-md transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                Creating account...
              </span>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-surface-container-high text-body-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </div>

        <div className="text-center text-label-sm text-on-surface-variant">
          By signing up, you agree to our{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Plain-Words Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
