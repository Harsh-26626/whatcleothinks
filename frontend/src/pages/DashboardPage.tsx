import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReportSummary } from '../types';
import { api } from '../lib/api';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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
      setReports(reports.filter((r) => r.id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  const formatChatType = (type: string) => {
    if (type === 'romance') return 'Romance';
    if (type === 'friends') return 'Close Friends';
    if (type === 'group') return 'Group Chat';
    return type;
  };

  return (
    <div className="max-w-7xl mx-auto px-gutter py-space-xl flex flex-col gap-space-xl w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <span className="text-label-sm font-medium text-primary uppercase tracking-wider">Your Sanctuary</span>
          <h1 className="font-headline-xl text-on-surface mt-1">Your Conversation Reports</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {user ? `Signed in as ${user.email}` : 'Private reflections for your chats'}
          </p>
        </div>

        <Link
          to="/new"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-space-lg py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-space-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Start a new report</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-error-container/60 border border-error/30 text-on-error-container p-4 rounded-xl flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={loadReports} className="text-error font-medium underline text-body-sm">
            Retry
          </button>
        </div>
      )}

      {/* Reports List / Loading Skeleton / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 animate-pulse flex flex-col gap-3">
              <div className="h-6 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
              <div className="h-16 bg-surface-container-low rounded-xl mt-4"></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 text-center flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-serif mb-4">
            C
          </div>
          <h2 className="font-headline-lg text-on-surface">No reports yet</h2>
          <p className="text-body-md text-on-surface-variant max-w-md mt-2 mb-6">
            Upload an exported WhatsApp chat to discover how your conversation evolved, when it peaked, and what Cleo notices.
          </p>
          <Link
            to="/new"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-space-lg py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            <span>Create your first report</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {reports.map((report) => {
            const isProcessing = report.status === 'queued' || report.status === 'processing';
            const participantsText = report.participants?.map((p) => p.name).join(' & ') || 'Participants';

            return (
              <div
                key={report.id}
                className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border border-outline-variant/20 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-label-sm bg-surface-container-high text-on-surface-variant font-medium">
                      {formatChatType(report.chatType)}
                    </span>

                    {report.status === 'done' ? (
                      <span className="px-2.5 py-1 rounded-full text-label-sm bg-sage-100 text-sage-700 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
                        Ready
                      </span>
                    ) : isProcessing ? (
                      <span className="px-2.5 py-1 rounded-full text-label-sm bg-amber-100 text-amber-700 font-medium flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {report.stage ? report.stage.replace('_', ' ') : 'Processing'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-label-sm bg-error-container text-on-error-container font-medium">
                        Failed
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {report.title || participantsText}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                      {participantsText}
                    </p>
                  </div>

                  {report.dateRange && (
                    <div className="flex items-center gap-1 text-label-sm text-on-surface-variant mt-1">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>
                        {report.dateRange.start} → {report.dateRange.end}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-space-lg pt-space-md border-t border-surface-container-high flex items-center justify-between">
                  <span className="text-label-sm text-on-surface-variant">
                    {new Date(report.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(report.id);
                        setShowDeleteModal(true);
                      }}
                      title="Delete report"
                      className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>

                    <button
                      onClick={() => navigate(isProcessing ? `/processing/${report.id}` : `/reports/${report.id}`)}
                      className="bg-primary/10 hover:bg-primary text-primary hover:text-on-primary font-medium text-label-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>{isProcessing ? 'View Progress' : 'Read Report'}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest max-w-md w-full p-space-xl rounded-2xl shadow-xl flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center gap-space-xs text-error font-medium text-label-sm">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Permanent Deletion</span>
            </div>
            <h3 className="font-headline-lg text-on-surface">Delete this report?</h3>
            <p className="text-body-md text-on-surface-variant">
              Once deleted, this report cannot be recovered. Your raw chat file was already deleted when the report finished, and this generated view will be permanently erased.
            </p>
            <div className="flex gap-space-sm mt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="flex-1 bg-surface-container-high hover:bg-surface-container text-on-surface py-3 rounded-xl font-medium text-label-md transition-colors"
              >
                Keep Report
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-error hover:opacity-90 text-on-error py-3 rounded-xl font-medium text-label-md transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
