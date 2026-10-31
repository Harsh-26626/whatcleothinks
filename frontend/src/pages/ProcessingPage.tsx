import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { Report } from '../types';
import { CleoAvatar } from '../components/CleoAvatar';

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

  // Derive checklist stage states
  // Stages: 'queued' -> 'parsing' -> 'computing_stats' -> 'reading_months' -> 'writing_report' -> 'done'
  const stage = report?.stage || 'queued';

  const step1State: 'done' | 'current' | 'waiting' =
    stage === 'reading_months' || stage === 'writing_report' || stage === 'done'
      ? 'done'
      : stage === 'parsing' || stage === 'computing_stats' || stage === 'queued'
      ? 'current'
      : 'waiting';

  const step2State: 'done' | 'current' | 'waiting' =
    stage === 'writing_report' || stage === 'done'
      ? 'done'
      : stage === 'reading_months'
      ? 'current'
      : 'waiting';

  const step3State: 'done' | 'current' | 'waiting' =
    stage === 'done' ? 'done' : stage === 'writing_report' ? 'current' : 'waiting';

  const renderStatusIcon = (status: 'done' | 'current' | 'waiting') => {
    if (status === 'done') {
      return (
        <div className="w-6 h-6 rounded-full bg-[#1F7A4D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
          ✓
        </div>
      );
    }
    if (status === 'current') {
      return (
        <div className="w-6 h-6 rounded-full bg-[#FFE0E8] flex items-center justify-center shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CF3A26] animate-pulse"></span>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-[#E7E5F0] flex items-center justify-center shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#8A889D]"></span>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 py-12 md:py-20">
      {errorMsg ? (
        /* Failure State: Peach Callout (#FFE5D6) with Cleo Avatar (32) */
        <div className="bg-[#FFE5D6] max-w-[560px] w-full p-8 sm:p-10 rounded-[28px] border border-[#CF3A26]/20 flex flex-col items-start gap-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CleoAvatar size={32} />
            <h2 className="font-heading font-bold text-2xl text-[#1C1A33]">
              Something went wrong
            </h2>
          </div>
          <p className="text-base text-[#1C1A33] leading-normal font-medium">
            Something went wrong while reading this chat. Your chat file was still deleted.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              to="/new"
              className="min-h-[48px] px-7 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 inline-flex items-center shadow-sm"
            >
              Try another chat
            </Link>
            <Link
              to="/dashboard"
              className="min-h-[48px] px-6 py-2.5 bg-white border-[1.5px] border-[#1C1A33] text-[#1C1A33] font-semibold text-base rounded-full hover:bg-[#F1EDFF] transition-colors duration-150 inline-flex items-center"
            >
              Go to reports
            </Link>
          </div>
        </div>
      ) : (
        /* Processing Center on Lilac Panel (28px radius, max-width 560px) */
        <div className="bg-[#E9E3FF] max-w-[560px] w-full p-8 sm:p-12 rounded-[28px] flex flex-col items-center text-center shadow-sm">
          {/* Cleo Avatar 96 with 3 typing dots underneath */}
          <div className="flex flex-col items-center">
            <CleoAvatar size={96} />
            <div className="flex items-center gap-2 mt-4" aria-label="Processing animation">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1C1A33] typing-dot"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1C1A33] typing-dot"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1C1A33] typing-dot"></span>
            </div>
          </div>

          <h1 className="font-heading font-bold text-[28px] sm:text-[34px] text-[#1C1A33] tracking-tight mt-6 mb-2">
            Cleo is reading your chat
          </h1>
          <p className="text-base text-[#5A5873] max-w-[400px] mb-8">
            This usually takes 20 to 40 seconds.
          </p>

          {/* Plain Checklist on White Panel */}
          <div className="w-full bg-white rounded-[20px] p-5 sm:p-6 border border-[#E7E5F0] flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3.5">
              {renderStatusIcon(step1State)}
              <span className={`text-base font-semibold ${step1State === 'waiting' ? 'text-[#5A5873]' : 'text-[#1C1A33]'}`}>
                Reading your chat
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              {renderStatusIcon(step2State)}
              <span className={`text-base font-semibold ${step2State === 'waiting' ? 'text-[#5A5873]' : 'text-[#1C1A33]'}`}>
                Working out the month-by-month changes
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              {renderStatusIcon(step3State)}
              <span className={`text-base font-semibold ${step3State === 'waiting' ? 'text-[#5A5873]' : 'text-[#1C1A33]'}`}>
                Writing your report
              </span>
            </div>
          </div>

          {/* Reassurance text */}
          <div className="mt-8 text-sm text-[#5A5873] leading-normal max-w-[440px]">
            Your chat file is deleted when this finishes. You can close this tab; the report will be in your reports list.
          </div>
        </div>
      )}
    </div>
  );
};