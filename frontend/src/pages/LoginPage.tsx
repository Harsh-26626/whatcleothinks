import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../lib/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          setErrorMsg(err.message || 'Could not log in.');
        }
      } else {
        setErrorMsg('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto py-16 md:py-24">
      <h1 className="text-[30px] font-bold text-[#1A1A1A]">Log in</h1>
      <p className="text-base text-[#5F5F5A] mt-2">
        An account keeps your reports visible only to you.
      </p>

      {errorMsg && (
        <div className="mt-4 p-3 bg-white border border-[#B42318] text-[#B42318] text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-base text-[#1A1A1A] border border-[#E5E5E1] rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-[#1A1A1A]" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs text-[#5F5F5A] hover:text-[#1A1A1A]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-base text-[#1A1A1A] border border-[#E5E5E1] rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          />
          <p className="text-xs text-[#5F5F5A] mt-1.5">
            Your password is stored hashed, never as plain text.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[44px] bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 flex items-center justify-center mt-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 text-sm text-[#5F5F5A]">
        Need an account?{' '}
        <Link to="/signup" className="text-[#1A1A1A] underline underline-offset-4 font-medium">
          Create one
        </Link>
      </div>
    </div>
  );
};
