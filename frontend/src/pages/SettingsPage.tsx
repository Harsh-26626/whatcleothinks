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
    <div className="w-full max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-16 flex flex-col gap-8 sm:gap-10 text-[#1C1A33] overflow-x-hidden">
      <div>
        <h1 className="font-heading font-bold text-[28px] xs:text-[34px] sm:text-[44px] text-[#1C1A33] tracking-tight leading-tight">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-[#5A5873] mt-1.5 sm:mt-2">
          Manage your account credentials, saved reports, and data.
        </p>
      </div>

      {/* Account Section */}
      <section className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-3">
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Account</h2>
        <div className="text-sm sm:text-base text-[#5A5873]">
          Signed in as <strong className="text-[#1C1A33] font-semibold break-all">{user?.email}</strong>
        </div>
        <div className="text-xs sm:text-sm text-[#5A5873] bg-[#F1EDFF] p-3.5 sm:p-4 rounded-xl mt-1">
          Password updates are currently handled via account support.
        </div>
      </section>

      {/* Reports Section */}
      <section className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-3 sm:gap-4">
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Reports</h2>
        <p className="text-sm sm:text-base text-[#5A5873]">
          You have {loading ? '…' : reports.length} saved report{reports.length === 1 ? '' : 's'}.
        </p>
        <div>
          <button
            disabled={reports.length === 0 || loading}
            onClick={() => setShowDeleteAllModal(true)}
            className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 border-[1.5px] border-[#B42318] text-[#B42318] text-sm font-semibold rounded-full hover:bg-[#FFE0E8] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Delete all reports
          </button>
        </div>
      </section>

      {/* Delete Account Section */}
      <section className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-3 sm:gap-4">
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#B42318]">Delete account</h2>
        <p className="text-sm sm:text-base text-[#5A5873] leading-relaxed">
          Permanently delete your account, email address, password, and all associated reports. This action is immediate and cannot be undone.
        </p>
        <div>
          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-[#B42318] hover:bg-[#901c13] text-white text-sm font-semibold rounded-full transition-colors duration-150 shadow-sm flex items-center justify-center"
          >
            Delete account
          </button>
        </div>
      </section>

      {/* Modal: Delete All Reports */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-[#1C1A33]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[480px] w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] border border-[#E7E5F0] shadow-2xl flex flex-col gap-4">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Delete all reports?</h2>
            <p className="text-sm sm:text-base text-[#5A5873] leading-normal">
              This will permanently delete all {reports.length} report{reports.length === 1 ? '' : 's'} in your account. Your original chat files were already deleted right after each report was created.
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAllModal(false)}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 border-[1.5px] border-[#1C1A33] rounded-full sm:rounded-xl text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAll}
                className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-[#B42318] text-white rounded-full sm:rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                {isDeleting ? 'Deleting…' : 'Delete all reports'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Account */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-[#1C1A33]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[480px] w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] border border-[#E7E5F0] shadow-2xl flex flex-col gap-4">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Delete your account?</h2>
            <p className="text-sm sm:text-base text-[#5A5873] leading-normal">
              This will permanently delete your account, your email, and all {reports.length} reports. There is no backup and this action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteAccountModal(false)}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 border-[1.5px] border-[#1C1A33] rounded-full sm:rounded-xl text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-[#B42318] text-white rounded-full sm:rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
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