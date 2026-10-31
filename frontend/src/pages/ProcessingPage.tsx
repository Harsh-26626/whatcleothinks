import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { Report } from '../types';

export const ProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    let timer: any;

    const checkStatus = async () => {
      try {
        const data = await api.getReport(id);
        if (!isMounted) return;

        setReport(data);

        if (data.status === 'done') {
          // Finished!
          navigate(`/reports/${id}`, { replace: true });
          return;
        }

        if (data.status === 'failed') {
          setErrorMsg(data.errorCode || 'Report generation could not be completed.');
          return;
        }

        // Poll again in 3 seconds
        timer = setTimeout(() => {
          setPollCount((prev) => prev + 1);
        }, 3000);
      } catch (err: any) {
        if (!isMounted) return;
        if (err instanceof ApiRequestError && err.status === 404) {
          setErrorMsg('Report not found or not owned by your account.');
        } else {
          // Retry on transient poll error
          timer = setTimeout(() => {
            setPollCount((prev) => prev + 1);
          }, 3000);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [id, pollCount, navigate]);

  const getStageMessage = (stage: string = '') => {
    switch (stage) {
      case 'queued':
        return {
          title: 'Opening the reading room...',
          desc: 'Queuing your chat lines for Cleo.',
          step: 1,
        };
      case 'parsing':
        return {
          title: 'Reading your chat...',
          desc: 'Cleaning up timestamps, Hinglish expressions, and organizing lines.',
          step: 2,
        };
      case 'computing_stats':
        return {
          title: 'Calculating rhythms and silences...',
          desc: 'Measuring share of voice, late night activity, response times, and streaks.',
          step: 3,
        };
      case 'reading_months':
        return {
          title: 'Looking at how it changed month to month...',
          desc: 'Tracing shifts in closeness, energy peaks, and milestones.',
          step: 4,
        };
      case 'writing_report':
        return {
          title: 'Cleo is writing your report...',
          desc: 'Drafting your personalized narrative with authentic chat quotes.',
          step: 5,
        };
      case 'done':
        return {
          title: 'Report complete!',
          desc: 'Redirecting to your sanctuary...',
          step: 6,
        };
      default:
        return {
          title: 'Reflecting on your conversation...',
          desc: 'Analyzing message patterns and warmth.',
          step: 3,
        };
    }
  };

  const currentStageInfo = getStageMessage(report?.stage);

  return (
    <div className="flex-1 flex items-center justify-center px-gutter py-space-xl">
      <div className="w-full max-w-xl bg-surface-container-lowest p-space-xl rounded-2xl shadow-xl border border-outline-variant/20 flex flex-col items-center text-center gap-space-lg">
        {errorMsg ? (
          <div className="flex flex-col items-center gap-space-md py-4">
            <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>

            <div>
              <h2 className="font-headline-lg text-on-surface">Something interrupted the analysis</h2>
              <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
                We encountered an issue while processing your report ({errorMsg}).
              </p>
            </div>

            {/* Privacy Reassurance even on failure */}
            <div className="bg-surface-container-low p-space-md rounded-xl text-body-sm text-on-surface-variant flex items-start gap-2 text-left border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock</span>
              <span>
                <strong>Your privacy remains protected:</strong> your chat file has been purged from memory and is not stored on our servers.
              </span>
            </div>

            <div className="flex gap-space-sm mt-2">
              <Link
                to="/new"
                className="bg-primary hover:bg-primary-container text-on-primary px-space-lg py-3 rounded-xl font-label-md transition-colors"
              >
                Try Another Export
              </Link>
              <Link
                to="/dashboard"
                className="bg-surface-container-high hover:bg-surface-container text-on-surface px-space-lg py-3 rounded-xl font-label-md transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cleo Avatar Breathing Animation */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-serif text-3xl font-bold shadow-md">
                    C
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
              </div>
            </div>

            <div>
              <span className="text-label-sm font-medium text-primary uppercase tracking-wider">
                Step {currentStageInfo.step} of 5
              </span>
              <h2 className="font-headline-lg text-on-surface mt-1">
                {currentStageInfo.title}
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
                {currentStageInfo.desc}
              </p>
            </div>

            {/* Stage Progress Bar */}
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-700 rounded-full"
                style={{ width: `${Math.min(100, Math.max(15, currentStageInfo.step * 20))}%` }}
              ></div>
            </div>

            {/* Reassurance Banner */}
            <div className="bg-surface-container-low p-space-md rounded-xl text-body-sm text-on-surface-variant flex items-start gap-space-xs text-left border border-outline-variant/15 w-full">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock</span>
              <p>
                <strong>You can safely close this tab.</strong> Your chat file is deleted immediately when this finishes, and your report will be waiting in your dashboard.
              </p>
            </div>

            <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant">
              <Link to="/dashboard" className="hover:text-primary transition-colors underline">
                Go to Dashboard now
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
