import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ReportSummary } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
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
    <div className="w-full max-w-[680px] mx-auto py-12 md:py-16 flex flex-col gap-8 text-[#1A1A1A]">
      <h1 className="text-[30px] md:text-[40px] font-bold tracking-tight">Settings</h1>

      {/* Account Section */}
      <section className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-2">
        <h2 className="text-xl font-bold">Account</h2>
        <div className="text-base text-[#5F5F5A]">
          Signed in as <strong className="text-[#1A1A1A]">{user?.email}</strong>
        </div>
      </section>

      {/* Reports Section */}
      <section className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-3">
        <h2 className="text-xl font-bold">Reports</h2>
        <p className="text-base text-[#5F5F5A]">
          You have {loading ? '…' : reports.length} saved report{reports.length === 1 ? '' : 's'}.
        </p>
        <div>
          <button
            disabled={reports.length === 0 || loading}
            onClick={() => setShowDeleteAllModal(true)}
            className="min-h-[44px] px-4 py-2 border border-[#B42318] text-[#B42318] text-sm font-semibold rounded-lg hover:bg-[#B42318]/5 transition-colors disabled:opacity-40"
          >
            Delete all reports
          </button>
        </div>
      </section>

      {/* Delete Account Section */}
      <section className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#B42318]">Delete account</h2>
        <p className="text-base text-[#5F5F5A]">
          Permanently delete your account, email address, password, and all associated reports.
        </p>
        <div>
          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="min-h-[44px] px-4 py-2 bg-[#B42318] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Delete account
          </button>
        </div>
      </section>

      {/* Modal: Delete All Reports */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[440px] w-full p-6 rounded-xl border border-[#E5E5E1] shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Delete all reports?</h2>
            <p className="text-sm text-[#5F5F5A]">
              This will permanently delete all {reports.length} report{reports.length === 1 ? '' : 's'} in your account. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAllModal(false)}
                className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAll}
                className="min-h-[44px] px-4 py-2 bg-[#B42318] text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                {isDeleting ? 'Deleting…' : 'Delete all reports'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Account */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[440px] w-full p-6 rounded-xl border border-[#E5E5E1] shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Delete your account?</h2>
            <p className="text-sm text-[#5F5F5A]">
              This will permanently delete your account, your email, and all {reports.length} reports. There is no backup and this cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAccountModal(false)}
                className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="min-h-[44px] px-4 py-2 bg-[#B42318] text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                {isDeleting ? 'Deleting…' : 'Delete account permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
