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
    <div className="w-full max-w-[680px] mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-10 text-[#1C1A33]">
      <div>
        <h1 className="font-heading font-bold text-[34px] sm:text-[44px] text-[#1C1A33] tracking-tight leading-tight">
          Settings
        </h1>
        <p className="text-base text-[#5A5873] mt-2">
          Manage your account credentials, saved reports, and data.
        </p>
      </div>

      {/* Account Section */}
      <section className="pt-8 border-t border-[#E7E5F0] flex flex-col gap-3">
        <h2 className="font-heading font-bold text-2xl text-[#1C1A33]">Account</h2>
        <div className="text-base text-[#5A5873]">
          Signed in as <strong className="text-[#1C1A33] font-semibold">{user?.email}</strong>
        </div>
        <div className="text-sm text-[#5A5873] bg-[#F1EDFF] p-4 rounded-xl mt-1">
          Password updates are currently handled via account support.
        </div>
      </section>

      {/* Reports Section */}
      <section className="pt-8 border-t border-[#E7E5F0] flex flex-col gap-4">
        <h2 className="font-heading font-bold text-2xl text-[#1C1A33]">Reports</h2>
        <p className="text-base text-[#5A5873]">
          You have {loading ? '…' : reports.length} saved report{reports.length === 1 ? '' : 's'}.
        </p>
        <div>
          <button
            disabled={reports.length === 0 || loading}
            onClick={() => setShowDeleteAllModal(true)}
            className="min-h-[48px] px-6 py-2.5 border-[1.5px] border-[#B42318] text-[#B42318] text-sm font-semibold rounded-full hover:bg-[#FFE0E8] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete all reports
          </button>
        </div>
      </section>

      {/* Delete Account Section */}
      <section className="pt-8 border-t border-[#E7E5F0] flex flex-col gap-4">
        <h2 className="font-heading font-bold text-2xl text-[#B42318]">Delete account</h2>
        <p className="text-base text-[#5A5873] leading-normal">
          Permanently delete your account, email address, password, and all associated reports. This action is immediate and cannot be undone.
        </p>
        <div>
          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="min-h-[48px] px-6 py-2.5 bg-[#B42318] hover:bg-[#901c13] text-white text-sm font-semibold rounded-full transition-colors duration-150 shadow-sm"
          >
            Delete account
          </button>
        </div>
      </section>

      {/* Modal: Delete All Reports (28px radius, max-w 480px) */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-[#1C1A33]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[480px] w-full p-8 rounded-[28px] border border-[#E7E5F0] shadow-2xl flex flex-col gap-4">
            <h2 className="font-heading font-bold text-2xl text-[#1C1A33]">Delete all reports?</h2>
            <p className="text-base text-[#5A5873] leading-normal">
              This will permanently delete all {reports.length} report{reports.length === 1 ? '' : 's'} in your account. Your original chat files were already deleted right after each report was created.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAllModal(false)}
                className="min-h-[48px] px-5 py-2.5 border-[1.5px] border-[#1C1A33] rounded-xl text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAll}
                className="min-h-[48px] px-6 py-2.5 bg-[#B42318] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {isDeleting ? 'Deleting…' : 'Delete all reports'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Account (28px radius, max-w 480px) */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-[#1C1A33]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[480px] w-full p-8 rounded-[28px] border border-[#E7E5F0] shadow-2xl flex flex-col gap-4">
            <h2 className="font-heading font-bold text-2xl text-[#1C1A33]">Delete your account?</h2>
            <p className="text-base text-[#5A5873] leading-normal">
              This will permanently delete your account, your email, and all {reports.length} reports. There is no backup and this action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAccountModal(false)}
                className="min-h-[48px] px-5 py-2.5 border-[1.5px] border-[#1C1A33] rounded-xl text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="min-h-[48px] px-6 py-2.5 bg-[#B42318] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
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