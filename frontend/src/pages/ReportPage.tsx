import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { Report, ChatType } from '../types';
import { StatsDashboard } from '../components/report/StatsDashboard';
import { MonthlyEvolution } from '../components/report/MonthlyEvolution';
import { NarrativeView } from '../components/report/NarrativeView';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'stats' | 'monthly' | 'narrative'>('stats');
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

  const getChatTypeChip = (type?: ChatType) => {
    switch (type) {
      case 'romance':
        return (
          <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FFE0E8] text-[#1C1A33] shrink-0">
            Romance
          </span>
        );
      case 'group':
        return (
          <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FFF3C9] text-[#1C1A33] shrink-0">
            Student group
          </span>
        );
      case 'friends':
      default:
        return (
          <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#DCEBFF] text-[#1C1A33] shrink-0">
            Friends
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-5 sm:gap-6 animate-pulse">
        <div className="h-10 sm:h-12 bg-[#E9E3FF] rounded-[18px] sm:rounded-[20px] w-3/4 sm:w-2/3"></div>
        <div className="h-5 sm:h-6 bg-[#F1EDFF] rounded-lg w-1/2 sm:w-1/3"></div>
        <div className="h-56 sm:h-64 bg-[#F6F6F4] rounded-[22px] sm:rounded-[28px] mt-4"></div>
      </div>
    );
  }

  if (errorMsg || !report) {
    return (
      <div className="w-full max-w-[500px] mx-auto py-16 sm:py-20 px-4 text-center flex flex-col items-center gap-4">
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Unable to load report</h1>
        <p className="text-sm sm:text-base text-[#5A5873]">{errorMsg}</p>
        <Link
          to="/dashboard"
          className="w-full sm:w-auto min-h-[48px] px-7 py-3 bg-[#CF3A26] text-white font-semibold text-base rounded-full inline-flex items-center justify-center hover:bg-[#B32F1D] transition-colors"
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
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* Header: Sits on a soft lilac band (#E9E3FF, full width) */}
      <header className="w-full bg-[#E9E3FF] border-b border-[#E7E5F0] py-6 sm:py-10 md:py-12">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <h1 className="font-heading font-bold text-[24px] xs:text-[28px] sm:text-[36px] md:text-[42px] text-[#1C1A33] tracking-tight leading-tight">
                {report.title || participantsText}
              </h1>
              {getChatTypeChip(report.chatType)}
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[#5A5873] font-medium">
              {participantsText} · {dateRangeText}
            </p>
          </div>

          {/* Actions: Print and ... menu */}
          <div className="flex items-center gap-2 sm:gap-3 no-print shrink-0 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="min-h-[40px] sm:min-h-[44px] px-4 sm:px-5 py-1.5 bg-white border-[1.5px] border-[#1C1A33] rounded-full text-xs sm:text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors"
            >
              Print
            </button>

            {/* ... menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="More options"
                className="min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] px-2.5 sm:px-3 py-1.5 bg-white border-[1.5px] border-[#1C1A33] rounded-full text-sm sm:text-base font-bold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors flex items-center justify-center"
              >
                ···
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E7E5F0] rounded-xl shadow-[0_8px_24px_rgba(28,26,51,0.08)] py-1.5 z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDeleteModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#B42318] hover:bg-[#FFE0E8] transition-colors"
                  >
                    Delete report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Tab Nav: Full width & touch friendly on mobile */}
      <nav className="sticky top-[72px] bg-white z-30 border-b border-[#E7E5F0] no-print">
        <div className="max-w-[1100px] mx-auto px-2 sm:px-6 flex items-center justify-between sm:justify-start sm:gap-8">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 sm:flex-none text-center py-3 sm:py-3.5 px-2 text-xs xs:text-sm sm:text-base font-semibold transition-all relative ${
              activeTab === 'stats'
                ? 'text-[#1C1A33] border-b-[3px] border-[#CF3A26]'
                : 'text-[#5A5873] hover:text-[#1C1A33] border-b-[3px] border-transparent'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 sm:flex-none text-center py-3 sm:py-3.5 px-2 text-xs xs:text-sm sm:text-base font-semibold transition-all relative ${
              activeTab === 'monthly'
                ? 'text-[#1C1A33] border-b-[3px] border-[#CF3A26]'
                : 'text-[#5A5873] hover:text-[#1C1A33] border-b-[3px] border-transparent'
            }`}
          >
            Month by month
          </button>
          <button
            onClick={() => setActiveTab('narrative')}
            className={`flex-1 sm:flex-none text-center py-3 sm:py-3.5 px-2 text-xs xs:text-sm sm:text-base font-semibold transition-all relative ${
              activeTab === 'narrative'
                ? 'text-[#1C1A33] border-b-[3px] border-[#CF3A26]'
                : 'text-[#5A5873] hover:text-[#1C1A33] border-b-[3px] border-transparent'
            }`}
          >
            Cleo's read
          </button>
        </div>
      </nav>

      {/* Main Content Sections: In screen mode, show active tab. In print mode, show all 3. */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-14 w-full flex flex-col gap-8 sm:gap-12">
        {/* Tab 1: Stats */}
        {report.stats && (
          <div className={activeTab === 'stats' ? 'block' : 'hidden print:block'}>
            <StatsDashboard
              stats={report.stats}
              participants={report.participants || []}
              dateRange={report.dateRange}
            />
          </div>
        )}

        {/* Tab 2: Month by month */}
        {report.monthly && report.monthly.length > 0 && (
          <div className={activeTab === 'monthly' ? 'block' : 'hidden print:block'}>
            <MonthlyEvolution
              monthly={report.monthly}
              turningPoints={report.narrative?.turningPoints || []}
            />
          </div>
        )}

        {/* Tab 3: Cleo's read */}
        {report.narrative && (
          <div className={activeTab === 'narrative' ? 'block' : 'hidden print:block'}>
            <NarrativeView
              narrative={report.narrative}
              participants={report.participants || []}
            />
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal (Mobile-safe layout) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#1C1A33]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-[480px] w-full p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] border border-[#E7E5F0] shadow-2xl flex flex-col gap-4">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">Delete this report?</h2>
            <p className="text-sm sm:text-base text-[#5A5873] leading-normal">
              This report will be permanently removed from your account. Your original chat file was already deleted right after the report was created.
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 border-[1.5px] border-[#1C1A33] rounded-full sm:rounded-xl text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-[#B42318] text-white rounded-full sm:rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
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