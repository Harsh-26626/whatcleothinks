import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { Report } from '../types';
import { StatsDashboard } from '../components/report/StatsDashboard';
import { MonthlyEvolution } from '../components/report/MonthlyEvolution';
import { NarrativeView } from '../components/report/NarrativeView';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadReport() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await api.getReport(id!);
        if (data.status === 'processing' || data.status === 'queued') {
          navigate(`/processing/${id}`, { replace: true });
          return;
        }
        setReport(data);
      } catch (err: any) {
        if (err instanceof ApiRequestError && err.status === 404) {
          setErrorMsg('Report not found or you do not have permission to view it.');
        } else {
          setErrorMsg(err.message || 'Could not load report.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.deleteReport(id);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-gutter py-space-xl w-full flex flex-col gap-space-lg animate-pulse">
        <div className="h-32 bg-surface-container-lowest rounded-2xl shadow-sm"></div>
        <div className="h-64 bg-surface-container-lowest rounded-2xl shadow-sm"></div>
        <div className="h-96 bg-surface-container-lowest rounded-2xl shadow-sm"></div>
      </div>
    );
  }

  if (errorMsg || !report) {
    return (
      <div className="max-w-xl mx-auto px-gutter py-space-xl text-center flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">error_outline</span>
        </div>
        <h2 className="font-headline-lg text-on-surface">Unable to load report</h2>
        <p className="text-body-md text-on-surface-variant max-w-md">{errorMsg}</p>
        <Link
          to="/dashboard"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-6 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const participantsText =
    report.participants?.map((p) => p.name).join(' & ') || 'Participants';

  return (
    <div className="max-w-7xl mx-auto px-gutter py-space-xl flex flex-col gap-space-xl w-full">
      {/* Top Header Card */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-space-xs relative z-10">
          <div className="flex items-center gap-space-xs text-label-sm text-primary font-medium tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Curated Insight Report • Persona: Cleo</span>
          </div>

          <h1 className="font-headline-xl text-on-surface">
            {report.title || `Conversations with ${participantsText}`}
          </h1>

          <p className="font-body-md text-on-surface-variant max-w-2xl mt-1">
            A gentle reflection of your shared rhythms, conversational balance, and evolving connection.
          </p>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-space-sm relative z-10 no-print">
          <div className="flex items-center gap-space-xs bg-surface-container-low border border-outline-variant/30 px-space-md py-2 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">
              {report.chatType === 'romance' ? 'favorite' : report.chatType === 'friends' ? 'group' : 'groups'}
            </span>
            <span className="text-label-md text-on-surface font-medium capitalize">
              {report.chatType}
            </span>
          </div>

          {report.stats && (
            <div className="flex items-center gap-space-xs bg-surface-container-low border border-outline-variant/30 px-space-md py-2 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">forum</span>
              <span className="text-label-md text-on-surface font-medium">
                {report.stats.totalMessages.toLocaleString()} Messages
              </span>
            </div>
          )}

          {report.dateRange && (
            <div className="flex items-center gap-space-xs bg-surface-container-low border border-outline-variant/30 px-space-md py-2 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
              <span className="text-label-md text-on-surface font-medium">
                {report.dateRange.start} → {report.dateRange.end}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* 1. Stats Dashboard */}
      {report.stats && (
        <StatsDashboard
          stats={report.stats}
          participants={report.participants || []}
          dateRange={report.dateRange}
        />
      )}

      {/* 2. Monthly Evolution & Turning Points */}
      {report.monthly && report.monthly.length > 0 && (
        <MonthlyEvolution
          monthly={report.monthly}
          turningPoints={report.narrative?.turningPoints || []}
        />
      )}

      {/* 3. Cleo's Narrative Perspective & Chat Quotes */}
      {report.narrative && (
        <NarrativeView
          narrative={report.narrative}
          participants={report.participants || []}
          onTakeBreak={() => setShowBreakModal(true)}
        />
      )}

      {/* Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg border-t border-surface-container-high no-print">
        <div className="flex items-center gap-space-sm w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface px-space-lg py-3 rounded-xl text-label-md font-medium transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Download PDF / Print</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-body-sm text-error hover:underline flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-error-container/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Delete this report</span>
          </button>
        </div>
      </div>

      {/* Take a Breath Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest max-w-md w-full p-space-xl rounded-2xl shadow-xl flex flex-col items-center text-center gap-space-md relative border border-outline-variant/20 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl">
              <span className="material-symbols-outlined text-3xl">spa</span>
            </div>
            <h3 className="font-headline-lg text-on-surface">Pause & Breathe</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Take a slow, deep breath in... and let it out. Looking at past moments can stir up unexpected feelings. Take all the time you need.
            </p>
            <button
              onClick={() => setShowBreakModal(false)}
              className="w-full bg-primary hover:bg-primary-container text-on-primary py-3 rounded-xl font-medium text-label-md mt-2 shadow-sm transition-all"
            >
              Return to Report
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest max-w-md w-full p-space-xl rounded-2xl shadow-xl flex flex-col gap-space-md relative border border-outline-variant/20 animate-fadeIn">
            <div className="flex items-center gap-space-xs text-error font-medium text-label-sm">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Permanent Deletion</span>
            </div>
            <h3 className="font-headline-lg text-on-surface">Delete this report?</h3>
            <p className="font-body-md text-on-surface-variant">
              Once deleted, this report cannot be recovered. Your raw chat file was already deleted when the report finished, and this generated view will be permanently removed.
            </p>
            <div className="flex gap-space-sm mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-surface-container-high hover:bg-surface-container text-on-surface py-3 rounded-xl font-medium text-label-md transition-colors"
              >
                Keep Report
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 bg-error hover:opacity-90 text-on-error py-3 rounded-xl font-medium text-label-md transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

