import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ReportSummary } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [reportToDelete, setReportToDelete] = useState<ReportSummary | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        const list = await api.getReports();
        setReports(list);
      } catch (e) {
        console.warn('Failed to load reports', e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleDeleteSingle = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteReport(reportToDelete.id);
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      setReportToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Could not delete report.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      for (const r of reports) {
        await api.deleteReport(r.id);
      }
      setReports([]);
      setShowDeleteAllModal(false);
    } catch (err: any) {
      alert(err.message || 'Could not delete all reports.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.deleteAccount();
      logout();
      navigate('/', { replace: true });
    } catch (err: any) {
      alert(err.message || 'Could not delete account.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-gutter py-space-xl flex flex-col gap-space-xl w-full">
      {/* Title */}
      <div>
        <span className="text-label-sm font-medium text-primary uppercase tracking-wider">Account Control</span>
        <h1 className="font-headline-xl text-on-surface mt-1">Settings & Data Control</h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Complete transparency over your stored credentials, generated reports, and permanent deletion controls.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
        <h2 className="font-headline-md text-on-surface">Your Account</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-label-md font-semibold text-on-surface">{user?.email}</div>
              <div className="text-body-sm text-on-surface-variant">Authenticated via secure JWT bearer session</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-body-sm font-medium text-primary hover:underline self-start sm:self-auto"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Manage Reports List & Deletion */}
      <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline-md text-on-surface">Your Stored Reports ({reports.length})</h2>
            <p className="text-body-sm text-on-surface-variant">
              Reports are saved only to your account until you delete them.
            </p>
          </div>

          {reports.length > 0 && (
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="text-label-sm text-error hover:bg-error-container/30 px-3 py-1.5 rounded-lg transition-colors border border-error/30 self-start sm:self-auto"
            >
              Delete All Reports
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-body-sm text-on-surface-variant animate-pulse">
            Loading your reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-surface-container-low p-space-lg rounded-xl text-center text-body-sm text-on-surface-variant">
            You currently have no saved reports.{' '}
            <Link to="/new" className="text-primary font-medium hover:underline">
              Create a new report
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-surface-container-high border border-surface-container-high rounded-xl overflow-hidden">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
              >
                <div>
                  <h4 className="font-headline-sm text-on-surface">
                    {report.title || report.participants?.map((p) => p.name).join(' & ') || 'Report'}
                  </h4>
                  <div className="text-body-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                    <span className="capitalize">{report.chatType}</span>
                    <span>•</span>
                    <span>Created {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/reports/${report.id}`}
                    className="text-label-sm font-medium text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => setReportToDelete(report)}
                    className="text-label-sm font-medium text-error hover:bg-error-container/40 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Permanent Account Deletion */}
      <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-error/20 flex flex-col gap-space-md">
        <div>
          <h2 className="font-headline-md text-error flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">warning</span>
            <span>Permanent Account Deletion</span>
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Permanently remove your account credentials, email, and all associated reports from the database.
          </p>
        </div>

        <div className="bg-error-container/30 p-space-md rounded-xl border border-error/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <p className="text-body-sm text-on-error-container max-w-lg">
            This action cannot be undone. All your reports will be hard-deleted immediately.
          </p>
          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="bg-error hover:opacity-90 text-on-error font-label-md px-space-md py-2.5 rounded-xl transition-all shadow-sm shrink-0"
          >
            Delete Account Permanently
          </button>
        </div>
      </div>

      {/* Modal 1: Delete Single Report */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest max-w-md w-full p-space-xl rounded-2xl shadow-xl flex flex-col gap-space-md border border-outline-variant/20 animate-fadeIn">
            <div className="flex items-center gap-space-xs text-error font-medium text-label-sm">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Delete Report</span>
            </div>
            <h3 className="font-headline-lg text-on-surface">Delete this report?</h3>
            <p className="text-body-md text-on-surface-variant">
              Are you sure you want to permanently delete{' '}
              <strong>"{reportToDelete.title || 'this report'}"</strong>? It cannot be recovered once removed.
            </p>
            <div className="flex gap-space-sm mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setReportToDelete(null)}
                className="flex-1 bg-surface-container-high hover:bg-surface-container text-on-surface py-3 rounded-xl font-medium text-label-md transition-colors"
              >
                Keep Report
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteSingle}
                className="flex-1 bg-error hover:opacity-90 text-on-error py-3 rounded-xl font-medium text-label-md transition-colors flex items-center justify-center"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Delete All Reports */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest max-w-md w-full p-space-xl rounded-2xl shadow-xl flex flex-col gap-space-md border border-outline-variant/20 animate-fadeIn">
            <div className="flex items-center gap-space-xs text-error font-medium text-label-sm">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Delete All Reports</span>
            </div>
            <h3 className="font-headline-lg text-on-surface">Delete all reports?</h3>
            <p className="text-body-md text-on-surface-variant">
              This will permanently erase all {reports.length} reports in your account. Your account itself will remain active.
            </p>
            <div className="flex gap-space-sm mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAllModal(false)}
                className="flex-1 bg-surface-container-high hover:bg-surface-container text-on-surface py-3 rounded-xl font-medium text-label-md transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAll}
                className="flex-1 bg-error hover:opacity-90 text-on-error py-3 rounded-xl font-medium text-label-md transition-colors flex items-center justify-center"
              >
                {isDeleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Whole Account */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest max-w-md w-full p-space-xl rounded-2xl shadow-xl flex flex-col gap-space-md border border-error/30 animate-fadeIn">
            <div className="flex items-center gap-space-xs text-error font-medium text-label-sm">
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              <span>Delete Account & Everything</span>
            </div>
            <h3 className="font-headline-lg text-on-surface">Delete your account permanently?</h3>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              This will immediately and permanently delete your user record, your email address, password hash, and all {reports.length} reports. There is no backup or recovery possible.
            </p>
            <div className="flex gap-space-sm mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAccountModal(false)}
                className="flex-1 bg-surface-container-high hover:bg-surface-container text-on-surface py-3 rounded-xl font-medium text-label-md transition-colors"
              >
                Keep Account
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 bg-error hover:opacity-90 text-on-error py-3 rounded-xl font-medium text-label-md transition-colors flex items-center justify-center"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

