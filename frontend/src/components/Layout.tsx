import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_NAME } from '../brand';

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
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans">
      {/* Navbar */}
      <header className="w-full bg-white border-b border-[#E5E5E1] sticky top-0 z-40">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Product Name */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-[#1A1A1A] hover:opacity-85 transition-opacity duration-150"
          >
            {BRAND_NAME}
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? 'font-semibold text-[#1A1A1A] underline underline-offset-4'
                      : 'text-[#5F5F5A] hover:text-[#1A1A1A] transition-colors duration-150'
                  }
                >
                  Reports
                </NavLink>
                <NavLink
                  to="/new"
                  className={({ isActive }) =>
                    isActive
                      ? 'font-semibold text-[#1A1A1A] underline underline-offset-4'
                      : 'text-[#5F5F5A] hover:text-[#1A1A1A] transition-colors duration-150'
                  }
                >
                  New report
                </NavLink>
                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    isActive
                      ? 'font-semibold text-[#1A1A1A] underline underline-offset-4'
                      : 'text-[#5F5F5A] hover:text-[#1A1A1A] transition-colors duration-150'
                  }
                >
                  Privacy
                </NavLink>

                {/* Account dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="min-h-[44px] px-3 py-2 text-sm text-[#1A1A1A] border border-[#E5E5E1] rounded-lg hover:bg-[#F6F6F4] transition-colors duration-150 flex items-center gap-1.5"
                    aria-expanded={accountMenuOpen}
                    aria-label="Account menu"
                  >
                    <span className="max-w-[140px] truncate">{user.email}</span>
                    <span className="text-xs text-[#5F5F5A]">▾</span>
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E5E5E1] rounded-lg shadow-lg py-1 z-50">
                      <div className="px-3 py-2 text-xs text-[#5F5F5A] border-b border-[#E5E5E1] truncate">
                        {user.email}
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F6F6F4] transition-colors duration-150"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F6F6F4] transition-colors duration-150"
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
                  className="text-[#5F5F5A] hover:text-[#1A1A1A] transition-colors duration-150"
                >
                  Privacy
                </Link>
                <Link
                  to="/login"
                  className="text-[#1A1A1A] hover:underline transition-colors duration-150 font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="min-h-[44px] px-4 py-2 bg-[#F2B01E] text-[#1A1A1A] font-semibold rounded-lg hover:opacity-90 transition-opacity duration-150 inline-flex items-center justify-center"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1040px] mx-auto px-4 sm:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#E5E5E1] py-8 mt-16 no-print">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#5F5F5A]">
          <span className="font-semibold text-[#1A1A1A]">{BRAND_NAME}</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#1A1A1A] transition-colors duration-150">
              Privacy
            </Link>
            {!user ? (
              <Link to="/login" className="hover:text-[#1A1A1A] transition-colors duration-150">
                Log in
              </Link>
            ) : (
              <Link to="/settings" className="hover:text-[#1A1A1A] transition-colors duration-150">
                Settings
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
