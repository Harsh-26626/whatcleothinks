import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_NAME } from '../brand';
import { CleoAvatar } from './CleoAvatar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  // Close menus when route changes
  useEffect(() => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener: only close when clicking outside both the trigger AND the drawer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      // Close desktop account menu if clicking outside
      if (menuRef.current && !menuRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }

      // Close mobile drawer if clicking outside BOTH the toggle button and the drawer itself
      if (
        mobileMenuOpen &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(target) &&
        mobileDrawerRef.current &&
        !mobileDrawerRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1C1A33] flex flex-col font-sans overflow-x-hidden">
      {/* 72px Navbar */}
      <header className="w-full bg-white border-b border-[#E7E5F0] sticky top-0 z-40 h-[72px] flex items-center">
        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Cleo avatar (32) + wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity duration-150 shrink-0"
          >
            <CleoAvatar size={32} />
            <span className="font-heading text-2xl text-[#1C1A33] tracking-tight font-bold">
              {BRAND_NAME}
            </span>
          </Link>

          {/* Desktop Navigation (md and up) */}
          <nav className="hidden md:flex items-center gap-6 text-base font-semibold">
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
                    type="button"
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
                        type="button"
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
                  className="min-h-[48px] px-6 py-2.5 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold rounded-full transition-colors duration-150 inline-flex items-center justify-center shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation Trigger Header */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                to="/new"
                className="min-h-[40px] px-3.5 py-1.5 bg-[#CF3A26] text-white text-xs font-semibold rounded-full inline-flex items-center justify-center shadow-xs"
              >
                + New
              </Link>
            ) : (
              <Link
                to="/signup"
                className="min-h-[40px] px-3.5 py-1.5 bg-[#CF3A26] text-white text-xs font-semibold rounded-full inline-flex items-center justify-center shadow-xs"
              >
                Sign up
              </Link>
            )}

            {/* Hamburger / Menu toggle button */}
            <button
              ref={mobileMenuBtnRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="min-h-[42px] min-w-[42px] p-2 rounded-xl border border-[#E7E5F0] bg-white hover:bg-[#F1EDFF] flex items-center justify-center text-[#1C1A33] transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileDrawerRef}
            className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-[#E7E5F0] shadow-2xl z-50 px-4 py-5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {user ? (
              <>
                <div className="p-3.5 bg-[#F1EDFF] rounded-[16px] mb-1">
                  <span className="block text-xs font-medium text-[#5A5873]">Signed in as</span>
                  <span className="block text-sm font-bold text-[#1C1A33] truncate mt-0.5">{user.email}</span>
                </div>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-semibold transition-colors ${
                      isActive ? 'bg-[#F1EDFF] text-[#1C1A33]' : 'text-[#1C1A33] hover:bg-[#F1EDFF]'
                    }`
                  }
                >
                  <span>Reports</span>
                  <span className="text-xs text-[#5A5873]">→</span>
                </NavLink>

                <NavLink
                  to="/new"
                  className={({ isActive }) =>
                    `min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-semibold transition-colors ${
                      isActive ? 'bg-[#F1EDFF] text-[#1C1A33]' : 'text-[#1C1A33] hover:bg-[#F1EDFF]'
                    }`
                  }
                >
                  <span>New report</span>
                  <span className="text-xs text-[#5A5873]">→</span>
                </NavLink>

                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    `min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-semibold transition-colors ${
                      isActive ? 'bg-[#F1EDFF] text-[#1C1A33]' : 'text-[#1C1A33] hover:bg-[#F1EDFF]'
                    }`
                  }
                >
                  <span>Privacy</span>
                  <span className="text-xs text-[#5A5873]">→</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-semibold transition-colors ${
                      isActive ? 'bg-[#F1EDFF] text-[#1C1A33]' : 'text-[#1C1A33] hover:bg-[#F1EDFF]'
                    }`
                  }
                >
                  <span>Settings</span>
                  <span className="text-xs text-[#5A5873]">→</span>
                </NavLink>

                <div className="pt-2 border-t border-[#E7E5F0]">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full min-h-[48px] px-4 rounded-xl flex items-center text-base font-semibold text-[#CF3A26] hover:bg-[#FFE0E8] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-semibold transition-colors ${
                      isActive ? 'bg-[#F1EDFF] text-[#1C1A33]' : 'text-[#1C1A33] hover:bg-[#F1EDFF]'
                    }`
                  }
                >
                  <span>Log in</span>
                  <span className="text-xs text-[#5A5873]">→</span>
                </NavLink>

                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    `min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-semibold transition-colors ${
                      isActive ? 'bg-[#F1EDFF] text-[#1C1A33]' : 'text-[#1C1A33] hover:bg-[#F1EDFF]'
                    }`
                  }
                >
                  <span>Privacy</span>
                  <span className="text-xs text-[#5A5873]">→</span>
                </NavLink>

                <div className="pt-2">
                  <Link
                    to="/signup"
                    className="w-full min-h-[48px] px-6 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full inline-flex items-center justify-center transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col overflow-x-hidden">
        {children}
      </main>

      {/* Footer on Ink #1C1A33 */}
      <footer className="w-full bg-[#1C1A33] text-white py-10 sm:py-12 mt-auto no-print">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <CleoAvatar size={32} />
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {BRAND_NAME}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm font-medium">
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

          <div className="text-xs text-white/50 text-center sm:text-right">
            A friendly reflection of your conversations.
          </div>
        </div>
      </footer>
    </div>
  );
};