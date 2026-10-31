import React, { useEffect, useState, useRef } from 'react';
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

  const [activeSection, setActiveSection] = useState<'overview' | 'over-time' | 'cleos-read'>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          setErrorMsg('Report not found or not owned by your account.');
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
      <div className="w-full py-12 flex flex-col gap-6">
        <div className="h-10 bg-[#F6F6F4] rounded w-1/2"></div>
        <div className="h-6 bg-[#F6F6F4] rounded w-1/4"></div>
        <div className="h-64 bg-[#F6F6F4] rounded mt-4"></div>
      </div>
    );
  }

  if (errorMsg || !report) {
    return (
      <div className="w-full max-w-[500px] mx-auto py-20 text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Unable to load report</h1>
        <p className="text-base text-[#5F5F5A]">{errorMsg}</p>
        <Link
          to="/dashboard"
          className="min-h-[44px] px-5 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg inline-flex items-center"
        >
          Return to reports
        </Link>
      </div>
    );
  }

  const participantsText =
    report.participants?.map((p) => p.name).join(' and ') || 'Aarav and Meera';

  const dateRangeText = report.dateRange
    ? `${report.dateRange.start} to ${report.dateRange.end}`
    : '13 Jul 2024 to 25 Dec 2024';

  return (
    <div className="w-full py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5E5E1]">
        <div>
          <h1 className="text-[30px] md:text-[36px] font-bold text-[#1A1A1A]">
            {report.title || participantsText}
          </h1>
          <p className="text-base text-[#5F5F5A] mt-1">
            {participantsText} · {dateRangeText}
          </p>
        </div>

        {/* Actions: Print and ... menu */}
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4] transition-colors"
          >
            Print
          </button>

          {/* ... menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="More options"
              className="min-h-[44px] min-w-[44px] px-3 py-2 border border-[#E5E5E1] rounded-lg text-base font-bold text-[#1A1A1A] hover:bg-[#F6F6F4] transition-colors flex items-center justify-center"
            >
              ···
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E5E1] rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDeleteModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#B42318] hover:bg-[#F6F6F4]"
                >
                  Delete report
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Simple Sticky In-Page Nav */}
      <nav className="sticky top-16 bg-white z-30 py-3 border-b border-[#E5E5E1] flex items-center gap-6 text-base font-medium no-print">
        <a
          href="#overview"
          onClick={() => setActiveSection('overview')}
          className={`pb-1 transition-colors ${
            activeSection === 'overview'
              ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
              : 'text-[#5F5F5A] hover:text-[#1A1A1A]'
          }`}
        >
          Overview
        </a>
        <a
          href="#over-time"
          onClick={() => setActiveSection('over-time')}
          className={`pb-1 transition-colors ${
            activeSection === 'over-time'
              ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
              : 'text-[#5F5F5A] hover:text-[#1A1A1A]'
          }`}
        >
          Over time
        </a>
        <a
          href="#cleos-read"
          onClick={() => setActiveSection('cleos-read')}
          className={`pb-1 transition-colors ${
            activeSection === 'cleos-read'
              ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
              : 'text-[#5F5F5A] hover:text-[#1A1A1A]'
          }`}
        >
          Cleo's read
        </a>
      </nav>

      {/* 1. Overview */}
      {report.stats && (
        <StatsDashboard
          stats={report.stats}
          participants={report.participants || []}
          dateRange={report.dateRange}
        />
      )}

      {/* 2. Over Time */}
      {report.monthly && report.monthly.length > 0 && (
        <MonthlyEvolution
          monthly={report.monthly}
          turningPoints={report.narrative?.turningPoints || []}
        />
      )}

      {/* 3. Cleo's Read */}
      {report.narrative && (
        <NarrativeView
          narrative={report.narrative}
          participants={report.participants || []}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[440px] w-full p-6 rounded-xl border border-[#E5E5E1] shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Delete this report?</h2>
            <p className="text-sm text-[#5F5F5A]">
              This report will be permanently removed from your account. Your original chat file was already deleted after the report was created.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="min-h-[44px] px-4 py-2 bg-[#B42318] text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                {isDeleting ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
