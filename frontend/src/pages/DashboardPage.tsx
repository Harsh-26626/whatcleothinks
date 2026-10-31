import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReportSummary, ChatType } from '../types';
import { api } from '../lib/api';
import { CleoAvatar } from '../components/CleoAvatar';

export const DashboardPage: React.FC = () => {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const loadReports = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not load your reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteReport(deletingId);
      setReports((prev) => prev.filter((r) => r.id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  const getChatTypeChip = (type?: ChatType) => {
    switch (type) {
      case 'romance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FFE0E8] text-[#1C1A33] shrink-0">
            Romance
          </span>
        );
      case 'group':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FFF3C9] text-[#1C1A33] shrink-0">
            Student group
          </span>
        );
      case 'friends':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#DCEBFF] text-[#1C1A33] shrink-0">
            Friends
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-[#E7E5F0]">
        <div>
          <h1 className="font-heading font-bold text-[28px] xs:text-[34px] sm:text-[44px] text-[#1C1A33] tracking-tight leading-tight">
            Your reports
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mt-1">
            Revisit your conversations and see what changed over time.
          </p>
        </div>
        <Link
          to="/new"
          className="w-full sm:w-auto min-h-[48px] px-7 py-2.5 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 inline-flex items-center justify-center shrink-0 shadow-sm"
        >
          New report
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-[#FFE0E8] border border-[#CF3A26]/30 text-[#CF3A26] text-sm rounded-[16px] flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={loadReports} className="underline font-semibold ml-4">
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-4 sm:p-5 bg-white border border-[#E7E5F0] rounded-[20px] flex items-center justify-between gap-4 animate-pulse"
            >
              <div className="flex flex-col gap-2 w-2/3">
                <div className="w-40 sm:w-48 h-5 sm:h-6 bg-[#E9E3FF]/50 rounded-lg"></div>
                <div className="w-56 sm:w-64 h-3.5 sm:h-4 bg-[#F1EDFF] rounded-lg"></div>
              </div>
              <div className="w-16 sm:w-20 h-9 sm:h-10 bg-[#E7E5F0] rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        /* Empty State on Lilac Panel (28px radius on desktop, 22px on mobile) */
        <div className="bg-[#E9E3FF] rounded-[22px] sm:rounded-[28px] p-6 sm:p-14 text-center flex flex-col items-center justify-center max-w-[680px] mx-auto my-4 sm:my-6">
          <div className="scale-90 sm:scale-100">
            <CleoAvatar size={80} />
          </div>
          <h2 className="font-heading font-bold text-[22px] sm:text-[30px] text-[#1C1A33] mt-5 mb-2">
            No reports yet.
          </h2>
          <p className="text-sm sm:text-base text-[#5A5873] max-w-[420px] mb-6 sm:mb-8 leading-relaxed">
            Upload a chat export to see your conversation patterns, turning points, and honest observations.
          </p>
          <Link
            to="/new"
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 inline-flex items-center justify-center shadow-sm"
          >
            Create your first report
          </Link>
        </div>
      ) : (
        /* List of Report Cards */
        <div className="flex flex-col gap-3 sm:gap-4">
          {reports.map((report) => {
            const isProcessing = report.status === 'queued' || report.status === 'processing';
            const participantsText =
              report.participants?.map((p) => p.name).join(' and ') || 'Aarav and Meera';

            return (
              <div
                key={report.id}
                className="bg-white border border-[#E7E5F0] rounded-[20px] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1C1A33]/20 transition-colors duration-150"
              >
                {/* Left: Title, Chip, Participants, Dates */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33] truncate">
                      {report.title || participantsText}
                    </h3>
                    {getChatTypeChip(report.chatType)}
                  </div>
                  <div className="text-xs sm:text-sm text-[#5A5873] flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-[#1C1A33]">{participantsText}</span>
                    {report.dateRange && (
                      <>
                        <span>·</span>
                        <span>
                          {report.dateRange.start} to {report.dateRange.end}
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span>
                      Created{' '}
                      {new Date(report.createdAt).toLocaleDateString([], {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Right: Status & Actions (Mobile responsive bottom row) */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E7E5F0]">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                    {report.status === 'done' ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1F7A4D]"></span>
                        <span className="text-[#1C1A33]">Ready</span>
                      </>
                    ) : isProcessing ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#CF3A26]"></span>
                        <span className="text-[#CF3A26]">Processing</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]"></span>
                        <span className="text-[#B42318]">Failed</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        navigate(isProcessing ? `/processing/${report.id}` : `/reports/${report.id}`)
                      }
                      className="min-h-[42px] px-4 sm:px-5 py-1.5 bg-white border-[1.5px] border-[#1C1A33] text-[#1C1A33] font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#F1EDFF] transition-colors duration-150 inline-flex items-center"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(report.id);
                        setShowDeleteModal(true);
                      }}
                      className="min-h-[42px] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#B42318] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (Mobile-safe padding & max-h) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#1C1A33]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[480px] w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] border border-[#E7E5F0] shadow-2xl flex flex-col gap-4">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Delete this report?</h2>
            <p className="text-sm sm:text-base text-[#5A5873] leading-normal">
              This report will be permanently removed from your account. Your original chat file was already deleted right after the report was created.
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 border-[1.5px] border-[#1C1A33] rounded-full sm:rounded-xl text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors duration-150 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 bg-[#B42318] text-white rounded-full sm:rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity duration-150 flex items-center justify-center"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};