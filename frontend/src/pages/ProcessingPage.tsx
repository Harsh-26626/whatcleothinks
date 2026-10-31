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

  return (
    <div className="w-full max-w-[540px] mx-auto py-16 md:py-24">
      {errorMsg ? (
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-[28px] font-bold text-[#1A1A1A]">Report could not be finished</h1>
          <p className="text-base text-[#5F5F5A]">
            {errorMsg}
          </p>
          <p className="text-sm text-[#1A1A1A] font-medium p-3 bg-[#F6F6F4] rounded-lg border border-[#E5E5E1] w-full">
            Your chat file was still deleted.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              to="/new"
              className="min-h-[44px] px-5 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 inline-flex items-center"
            >
              Try another chat
            </Link>
            <Link
              to="/dashboard"
              className="min-h-[44px] px-5 py-2.5 border border-[#E5E5E1] text-[#1A1A1A] font-semibold text-base rounded-lg hover:bg-[#F6F6F4] inline-flex items-center"
            >
              Reports list
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A]">Creating your report</h1>
            <p className="text-base text-[#5F5F5A] mt-2">
              This usually takes under a minute.
            </p>
          </div>

          {/* Plain Checklist */}
          <div className="flex flex-col gap-4 py-4 border-y border-[#E5E5E1]">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <span className="w-5 text-center text-sm font-bold">
                {step1State === 'done' ? (
                  <span className="text-[#1F7A4D]">✓</span>
                ) : step1State === 'current' ? (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                ) : (
                  <span className="inline-block w-2.5 h-2.5 rounded-full border border-[#E5E5E1]" />
                )}
              </span>
              <span
                className={`text-base ${
                  step1State === 'current'
                    ? 'font-semibold text-[#1A1A1A]'
                    : step1State === 'done'
                    ? 'text-[#5F5F5A]'
                    : 'text-[#8E8E87]'
                }`}
              >
                Reading your chat
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <span className="w-5 text-center text-sm font-bold">
                {step2State === 'done' ? (
                  <span className="text-[#1F7A4D]">✓</span>
                ) : step2State === 'current' ? (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                ) : (
                  <span className="inline-block w-2.5 h-2.5 rounded-full border border-[#E5E5E1]" />
                )}
              </span>
              <span
                className={`text-base ${
                  step2State === 'current'
                    ? 'font-semibold text-[#1A1A1A]'
                    : step2State === 'done'
                    ? 'text-[#5F5F5A]'
                    : 'text-[#8E8E87]'
                }`}
              >
                Working out the month-by-month changes
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <span className="w-5 text-center text-sm font-bold">
                {step3State === 'done' ? (
                  <span className="text-[#1F7A4D]">✓</span>
                ) : step3State === 'current' ? (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                ) : (
                  <span className="inline-block w-2.5 h-2.5 rounded-full border border-[#E5E5E1]" />
                )}
              </span>
              <span
                className={`text-base ${
                  step3State === 'current'
                    ? 'font-semibold text-[#1A1A1A]'
                    : step3State === 'done'
                    ? 'text-[#5F5F5A]'
                    : 'text-[#8E8E87]'
                }`}
              >
                Writing your report
              </span>
            </div>
          </div>

          {/* Reassurance text */}
          <p className="text-sm text-[#5F5F5A] leading-normal">
            Your chat file is deleted when this finishes. You can close this tab; the report will be in your reports list.
          </p>

          <div>
            <Link
              to="/dashboard"
              className="text-sm text-[#1A1A1A] underline underline-offset-4 hover:text-[#5F5F5A]"
            >
              Go to reports list
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
