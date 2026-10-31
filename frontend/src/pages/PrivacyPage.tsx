import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-gutter py-space-xl flex flex-col gap-space-xl">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-space-xs text-primary text-label-sm font-medium uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Sanctuary Commitment</span>
        </div>
        <h1 className="font-headline-xl text-on-surface">Your privacy, in plain words</h1>
        <p className="font-body-lg text-on-surface-variant mt-2 max-w-2xl">
          We believe in radical clarity. No 50-page legal maze, no marketing buzzwords. Here is exactly what happens with your data, why, and how you stay in complete control.
        </p>
      </div>

      {/* The 5 Core Truths */}
      <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md border border-outline-variant/20 flex flex-col gap-space-md">
        <h2 className="font-headline-lg text-on-surface">The Five Privacy Truths</h2>
        <p className="text-body-md text-on-surface-variant">
          These five statements are true by design and are the foundation of whatcleothinks:
        </p>

        <div className="flex flex-col gap-space-sm mt-2">
          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface">The chat file is deleted right after the report is created.</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                It lives in server memory only while being processed. It is never written to disk and never stored in the database.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface">The report is saved to your account until you delete it.</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Only you, logged into your authenticated account, can access or read your reports.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface">The report can include short quotes from the chat.</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                These short quotes (and names, and facts about events) are preserved inside your private report so you can remember memorable moments.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface">You can delete any report, or your whole account, at any time.</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Deletion is a hard delete (no soft-delete flag, no lingering archive rows). When you delete a report or your account, it is gone forever.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm shrink-0 mt-0.5">
              5
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface">Nothing is shared with the people in the chat and nothing is sold.</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                No notifications are ever sent to other chat participants. Your data is never sold, licensed, or monetized for advertising.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Transparent Extras */}
      <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md border border-outline-variant/20 flex flex-col gap-space-md">
        <h2 className="font-headline-lg text-on-surface">The Transparent Extras</h2>
        <p className="text-body-md text-on-surface-variant">
          We want you to know exactly how the technology operates behind the scenes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-medium text-label-md">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span>AI Provider Processing</span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              The chat text is sent to an AI provider (Anthropic Claude API) to write the report, under the provider's commercial API terms where inputs are not used to train models.
            </p>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-medium text-label-md">
              <span className="material-symbols-outlined text-[18px]">vpn_key</span>
              <span>Account Credentials Stored</span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              We store only your email address and a cryptographically salted bcrypt hash of your password. We never see, log, or know your plain password.
            </p>
          </div>
        </div>
      </div>

      {/* The Data Journey Visual */}
      <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-md border border-outline-variant/20 flex flex-col gap-space-md">
        <h2 className="font-headline-lg text-on-surface">The Data Journey</h2>
        <p className="text-body-md text-on-surface-variant">
          Follow your file from the moment you hit upload:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm mt-2 relative">
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</span>
            <div className="text-label-md font-medium text-on-surface">Upload</div>
            <p className="text-body-sm text-on-surface-variant">Transferred over encrypted HTTPS directly into server memory.</p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</span>
            <div className="text-label-md font-medium text-on-surface">Analysis</div>
            <p className="text-body-sm text-on-surface-variant">Stats & monthly trajectories are extracted in memory.</p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col items-center text-center gap-2 border-2 border-primary/40">
            <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">3</span>
            <div className="text-label-md font-medium text-primary">Chat Deleted</div>
            <p className="text-body-sm text-on-surface-variant">Raw chat text is dropped and garbage-collected immediately.</p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">4</span>
            <div className="text-label-md font-medium text-on-surface">Saved for You</div>
            <p className="text-body-sm text-on-surface-variant">Report stays in your account until you tap Delete.</p>
          </div>
        </div>

        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container-high mt-space-sm">
          <span className="text-body-sm text-on-surface-variant">
            Need to delete reports or purge your account?
          </span>
          <Link
            to="/settings"
            className="bg-surface-container-high hover:bg-surface-container text-on-surface px-space-md py-2 rounded-lg text-label-md font-medium transition-colors"
          >
            Go to Account & Deletion Settings
          </Link>
        </div>
      </div>
    </div>
  );
};
