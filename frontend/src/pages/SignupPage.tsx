import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError } from '../lib/api';

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
    <div className="w-full max-w-[400px] mx-auto py-16 md:py-24">
      <h1 className="text-[30px] font-bold text-[#1A1A1A]">Create your account</h1>
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
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5" htmlFor="signup-email">
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
            className="w-full min-h-[44px] px-3.5 py-2.5 text-base text-[#1A1A1A] border border-[#E5E5E1] rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-[#1A1A1A]" htmlFor="signup-password">
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
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-sm text-[#5F5F5A]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1A1A1A] underline underline-offset-4 font-medium">
          Log in
        </Link>
      </div>
    </div>
  );
};
