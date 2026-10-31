import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_NAME } from '../brand';
import { CleoAvatar } from './CleoAvatar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1C1A33] flex flex-col font-sans">
      {/* 72px Navbar */}
      <header className="w-full bg-white border-b border-[#E7E5F0] sticky top-0 z-40 h-[72px] flex items-center">
        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Cleo avatar (32) + wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity duration-150"
          >
            <CleoAvatar size={32} />
            <span className="font-heading text-2xl text-[#1C1A33] tracking-tight font-bold">
              {BRAND_NAME}
            </span>
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6 text-base font-semibold">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-[#1C1A33] underline underline-offset-8 decoration-2 decoration-[#CF3A26]'
                      : 'text-[#5A5873] hover:text-[#1C1A33] transition-colors duration-150'
                  }
                >
                  Reports
                </NavLink>
                <NavLink
                  to="/new"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-[#1C1A33] underline underline-offset-8 decoration-2 decoration-[#CF3A26]'
                      : 'text-[#5A5873] hover:text-[#1C1A33] transition-colors duration-150'
                  }
                >
                  New report
                </NavLink>
                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-[#1C1A33] underline underline-offset-8 decoration-2 decoration-[#CF3A26]'
                      : 'text-[#5A5873] hover:text-[#1C1A33] transition-colors duration-150'
                  }
                >
                  Privacy
                </NavLink>

                {/* Account dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="min-h-[44px] px-3.5 py-1.5 text-sm text-[#1C1A33] border border-[#E7E5F0] rounded-xl hover:bg-[#F1EDFF] transition-colors duration-150 flex items-center gap-2 font-medium"
                    aria-expanded={accountMenuOpen}
                    aria-label="Account menu"
                  >
                    <span className="max-w-[140px] truncate">{user.email}</span>
                    <span className="text-xs text-[#5A5873]">▾</span>
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E7E5F0] rounded-[20px] shadow-xl py-2 z-50">
                      <div className="px-4 py-2 text-xs text-[#5A5873] border-b border-[#E7E5F0] truncate">
                        {user.email}
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors duration-150 font-medium"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#CF3A26] hover:bg-[#FFE0E8] transition-colors duration-150 font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/privacy"
                  className="text-[#5A5873] hover:text-[#1C1A33] transition-colors duration-150"
                >
                  Privacy
                </Link>
                <Link
                  to="/login"
                  className="text-[#1C1A33] hover:underline underline-offset-4 transition-colors duration-150"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="min-h-[48px] px-6 py-2.5 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold rounded-full transition-colors duration-150 inline-flex items-center justify-center"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {/* Footer on Ink #1C1A33 */}
      <footer className="w-full bg-[#1C1A33] text-white py-12 mt-auto no-print">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <CleoAvatar size={32} />
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {BRAND_NAME}
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium">
            <Link to="/privacy" className="text-white/80 hover:text-white transition-colors duration-150">
              Privacy
            </Link>
            {!user ? (
              <Link to="/login" className="text-white/80 hover:text-white transition-colors duration-150">
                Log in
              </Link>
            ) : (
              <Link to="/settings" className="text-white/80 hover:text-white transition-colors duration-150">
                Settings
              </Link>
            )}
          </div>

          <div className="text-xs text-white/50">
            A friendly reflection of your conversations.
          </div>
        </div>
      </footer>
    </div>
  );
};
