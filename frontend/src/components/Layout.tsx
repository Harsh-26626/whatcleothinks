import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(43,35,32,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-space-sm group">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-lg group-hover:bg-primary group-hover:text-on-primary transition-colors">
              C
            </div>
            <span className="font-headline-md text-on-surface tracking-tight">whatcleothinks</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-space-md">
            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-space-xs py-1 transition-colors text-body-sm rounded-lg ${
                      isActive
                        ? 'bg-primary text-on-primary font-medium'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/new"
                  className={({ isActive }) =>
                    `px-space-xs py-1 transition-colors text-body-sm rounded-lg ${
                      isActive
                        ? 'bg-primary text-on-primary font-medium'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`
                  }
                >
                  New Report
                </NavLink>
              </>
            )}
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `px-space-xs py-1 transition-colors text-body-sm rounded-lg ${
                  isActive
                    ? 'bg-primary text-on-primary font-medium'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
            >
              Privacy
            </NavLink>
            {user && (
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `px-space-xs py-1 transition-colors text-body-sm rounded-lg ${
                    isActive
                      ? 'bg-primary text-on-primary font-medium'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`
                }
              >
                Settings
              </NavLink>
            )}
          </nav>

          {/* Right Action / Status */}
          <div className="flex items-center gap-space-md">
            <div className="hidden lg:flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
              <span>Your chat file is deleted right after report creation</span>
            </div>

            {user ? (
              <div className="flex items-center gap-space-sm">
                <Link
                  to="/settings"
                  title={user.email}
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-label-md font-medium shadow-sm hover:opacity-90 transition-opacity"
                >
                  {user.email.charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hidden sm:inline"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-space-sm">
                <Link
                  to="/login"
                  className="text-body-sm font-medium text-on-surface hover:text-primary px-3 py-1.5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary-container text-on-primary text-label-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-outline-variant/20 bg-background/95 py-2 px-4 text-body-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-on-surface-variant hover:text-primary py-1">
                Dashboard
              </Link>
              <Link to="/new" className="text-on-surface-variant hover:text-primary py-1 font-medium text-primary">
                + New Report
              </Link>
              <Link to="/privacy" className="text-on-surface-variant hover:text-primary py-1">
                Privacy
              </Link>
              <Link to="/settings" className="text-on-surface-variant hover:text-primary py-1">
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-on-surface-variant hover:text-primary py-1">
                Home
              </Link>
              <Link to="/privacy" className="text-on-surface-variant hover:text-primary py-1">
                Privacy
              </Link>
              <Link to="/login" className="text-on-surface-variant hover:text-primary py-1">
                Log in
              </Link>
              <Link to="/signup" className="text-primary font-medium py-1">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-20 md:pt-20 flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-xl mt-auto border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col sm:flex-row items-center justify-between gap-space-md text-body-sm text-on-surface-variant">
          <div className="flex flex-col sm:flex-row items-center gap-space-sm text-center sm:text-left">
            <span className="font-serif font-medium text-on-surface">whatcleothinks</span>
            <span className="hidden sm:inline">•</span>
            <span>A quiet digital sanctuary for WhatsApp chats.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-md text-label-sm">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy & 5 Truths
            </Link>
            {user && (
              <Link to="/settings" className="hover:text-primary transition-colors">
                Account & Deletion
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
