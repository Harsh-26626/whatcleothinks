import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReportSummary } from '../types';
import { api } from '../lib/api';

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

  return (
    <div className="w-full py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#E5E5E1]">
        <h1 className="text-[30px] md:text-[40px] font-bold text-[#1A1A1A]">Your reports</h1>
        <Link
          to="/new"
          className="min-h-[44px] px-5 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 inline-flex items-center justify-center self-start sm:self-auto"
        >
          New report
        </Link>
      </div>

      {errorMsg && (
        <div className="mt-6 p-4 border border-[#B42318] text-[#B42318] text-sm rounded-lg flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={loadReports} className="underline font-semibold ml-4">
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="mt-6 flex flex-col divide-y divide-[#E5E5E1]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="py-4 flex items-center justify-between gap-4">
              <div className="w-1/3 h-5 bg-[#F6F6F4] rounded"></div>
              <div className="w-1/4 h-5 bg-[#F6F6F4] rounded"></div>
              <div className="w-20 h-5 bg-[#F6F6F4] rounded"></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center flex flex-col items-center">
          <p className="text-base text-[#5F5F5A] mb-6">No reports yet.</p>
          <Link
            to="/new"
            className="min-h-[44px] px-6 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 inline-flex items-center justify-center"
          >
            New report
          </Link>
        </div>
      ) : (
        /* List of Rows */
        <div className="mt-4 flex flex-col divide-y divide-[#E5E5E1]">
          {reports.map((report) => {
            const isProcessing = report.status === 'queued' || report.status === 'processing';
            const participantsText =
              report.participants?.map((p) => p.name).join(' and ') || 'Participants';

            return (
              <div
                key={report.id}
                className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F6F6F4]/50 transition-colors duration-150 px-2 rounded-lg"
              >
                {/* Left: Title & Info */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-base font-semibold text-[#1A1A1A] truncate">
                    {report.title || participantsText}
                  </div>
                  <div className="text-sm text-[#5F5F5A] flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                    <span>{participantsText}</span>
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
                      Created {new Date(report.createdAt).toLocaleDateString([], {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 text-sm">
                    {report.status === 'done' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#1F7A4D]"></span>
                        <span className="text-[#1A1A1A]">Ready</span>
                      </>
                    ) : isProcessing ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#F2B01E]"></span>
                        <span className="text-[#1A1A1A]">Processing</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#B42318]"></span>
                        <span className="text-[#B42318]">Failed</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        navigate(isProcessing ? `/processing/${report.id}` : `/reports/${report.id}`)
                      }
                      className="min-h-[40px] px-3 py-1.5 text-sm font-semibold text-[#1A1A1A] hover:underline"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(report.id);
                        setShowDeleteModal(true);
                      }}
                      className="min-h-[40px] px-3 py-1.5 text-sm text-[#B42318] hover:underline"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[440px] w-full p-6 rounded-xl border border-[#E5E5E1] shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Delete this report?</h2>
            <p className="text-sm text-[#5F5F5A]">
              This report will be permanently deleted from your account. Your original chat file was already deleted after the report was created.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="min-h-[44px] px-4 py-2 bg-[#B42318] text-white rounded-lg text-sm font-semibold hover:opacity-90"
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
