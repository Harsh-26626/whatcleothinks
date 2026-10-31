import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../lib/api';
import { CleoAvatar } from '../components/CleoAvatar';

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
    <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-72px)]">
      {/* Mobile-only compact banner (visible on screens < lg) */}
      <div className="lg:hidden bg-[#E9E3FF] p-5 sm:p-8 flex items-center gap-4 border-b border-[#E7E5F0]">
        <div className="shrink-0">
          <CleoAvatar size={48} />
        </div>
        <div className="bg-white border border-[#E7E5F0] bubble-in px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1C1A33] shadow-xs">
          Log in to read your chat reports.
        </div>
      </div>

      {/* Desktop Left Column: Lilac Panel with Cleo Avatar (96) and Speech Bubbles */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#E9E3FF] p-8 sm:p-12 lg:p-16 flex-col items-start justify-center gap-6">
        <CleoAvatar size={96} />
        <div className="flex flex-col gap-3 max-w-[360px]">
          <div className="bg-white border border-[#E7E5F0] bubble-in p-4 text-base font-semibold text-[#1C1A33] shadow-sm">
            Hi, I'm Cleo.
          </div>
          <div className="bg-white border border-[#E7E5F0] bubble-in p-4 text-sm text-[#1C1A33] leading-relaxed shadow-sm">
            An account keeps your reports visible only to you.
          </div>
        </div>
      </div>

      {/* Right Column: Centered Form (Mobile-first padding) */}
      <div className="lg:col-span-7 bg-white p-5 sm:p-10 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-[400px]">
          <h1 className="text-[28px] sm:text-[34px] md:text-[36px] font-heading font-bold text-[#1C1A33]">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mt-1.5 sm:mt-2">
            Log in to read your chat reports.
          </p>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-[#FFE5D6] border border-[#CF3A26]/30 text-[#B42318] text-sm font-medium rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 mt-6">
            <div>
              <label className="block text-sm font-semibold text-[#1C1A33] mb-1.5" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[48px] px-4 py-2.5 text-base text-[#1C1A33] border border-[#E7E5F0] rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-[#1C1A33]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#1C1A33]" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs text-[#5A5873] hover:text-[#1C1A33] font-medium p-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 text-base text-[#1C1A33] border border-[#E7E5F0] rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-[#1C1A33]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 min-h-[48px] w-full px-6 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 flex items-center justify-center disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-[#5A5873] mt-6 text-center">
            Do not have an account?{' '}
            <Link to="/signup" className="text-[#1C1A33] font-semibold underline underline-offset-4 hover:text-[#CF3A26]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};