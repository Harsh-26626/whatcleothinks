import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../lib/api';
import { CleoAvatar } from '../components/CleoAvatar';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
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
          setErrorMsg('An account with this email already exists.');
        } else {
          setErrorMsg(err.message || 'Could not create account.');
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
      {/* Left Column: Lilac Panel with Cleo Avatar (96) and Speech Bubbles */}
      <div className="lg:col-span-5 bg-[#E9E3FF] p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center lg:text-left lg:items-start gap-6">
        <CleoAvatar size={96} />
        <div className="flex flex-col gap-3 max-w-[360px]">
          <div className="self-center lg:self-start bg-white border border-[#E7E5F0] bubble-in p-4 text-base font-semibold text-[#1C1A33] shadow-sm">
            Hi, I'm Cleo.
          </div>
          <div className="self-center lg:self-start bg-white border border-[#E7E5F0] bubble-in p-4 text-sm text-[#1C1A33] leading-relaxed shadow-sm">
            An account keeps your reports visible only to you.
          </div>
        </div>
      </div>

      {/* Right Column: Centered Form */}
      <div className="lg:col-span-7 bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-[400px]">
          <h1 className="text-[32px] md:text-[36px] font-heading font-bold text-[#1C1A33]">
            Create your account
          </h1>
          <p className="text-base text-[#5A5873] mt-2">
            An account keeps your reports visible only to you.
          </p>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-[#FFE5D6] border border-[#CF3A26] text-[#B42318] text-sm font-medium rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
            <div>
              <label className="block text-sm font-semibold text-[#1C1A33] mb-1.5" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
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
                <label className="block text-sm font-semibold text-[#1C1A33]" htmlFor="signup-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs text-[#5A5873] hover:text-[#1C1A33] font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full min-h-[48px] px-4 py-2.5 text-base text-[#1C1A33] border border-[#E7E5F0] rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-[#1C1A33]"
              />
              <p className="text-xs text-[#5A5873] mt-1.5">
                Your password is stored hashed, never as plain text.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 flex items-center justify-center mt-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-sm text-[#5A5873] text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1C1A33] underline underline-offset-4 hover:text-[#CF3A26] font-semibold">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
