import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  const privacyRules = [
    'Your chat file is deleted right after your report is created.',
    'Your report is saved to your account until you delete it.',
    'Reports can include short quotes from your chat.',
    'You can delete any report, or your whole account, at any time.',
    'Nothing is shared with the people in the chat, and nothing is sold.',
  ];

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* Header Band: Sits on lilac header band (#E9E3FF, full width) */}
      <header className="w-full bg-[#E9E3FF] border-b border-[#E7E5F0] py-8 sm:py-14 md:py-16">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-bold text-[28px] xs:text-[34px] sm:text-[44px] text-[#1C1A33] tracking-tight leading-tight">
            Privacy, in plain words
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mt-2">
            No long legal text. Here is how your chats, data, and reports are handled.
          </p>
        </div>
      </header>

      {/* Main Content: Single 680px column, mobile-responsive reading type */}
      <main className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-16 flex flex-col gap-8 sm:gap-12 text-[#1C1A33]">
        {/* Section 1: The Five Rules (Prominent numbered list with large coral numbers) */}
        <section className="flex flex-col gap-4 sm:gap-6">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">
            The five privacy rules
          </h2>
          <div className="flex flex-col gap-3 sm:gap-5">
            {privacyRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 sm:gap-5 p-3.5 sm:p-5 bg-[#F1EDFF] rounded-[16px] sm:rounded-[20px]"
              >
                <span className="font-heading font-bold text-2xl sm:text-4xl text-[#CF3A26] leading-none shrink-0 w-6 sm:w-8">
                  {idx + 1}
                </span>
                <p className="text-[15px] sm:text-[18px] leading-[1.6] sm:leading-[1.7] text-[#1C1A33] font-medium pt-0.5">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: What we store */}
        <section className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-3 sm:gap-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">
            What we store
          </h2>
          <p className="text-[15px] sm:text-[18px] leading-[1.6] sm:leading-[1.7] text-[#1C1A33]">
            We keep only what is required to provide your account and reports:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-[15px] sm:text-[18px] leading-[1.6] sm:leading-[1.7] text-[#1C1A33]">
            <li>
              <strong>Your email:</strong> to identify your account and log you in.
            </li>
            <li>
              <strong>A hashed password:</strong> stored using standard password hashing, never in plain text.
            </li>
            <li>
              <strong>Your reports:</strong> saved so you can read them whenever you log in, until you choose to delete them.
            </li>
          </ul>
        </section>

        {/* Section 3: What we send to an AI provider */}
        <section className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-3 sm:gap-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">
            What we send to an AI provider
          </h2>
          <p className="text-[15px] sm:text-[18px] leading-[1.6] sm:leading-[1.7] text-[#1C1A33]">
            To generate the written observations and identify turning points, the chat text is sent to an AI provider. This happens under commercial API terms where data is processed to generate your report.
          </p>
        </section>

        {/* Section 4: Delete your data */}
        <section className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-3 sm:gap-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">
            Delete your data
          </h2>
          <p className="text-[15px] sm:text-[18px] leading-[1.6] sm:leading-[1.7] text-[#1C1A33]">
            You have full control over what is kept. You can delete individual reports from your dashboard, delete all reports at once in your account settings, or permanently delete your whole account.
          </p>
          <div className="mt-2">
            <Link
              to="/settings"
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-white border-[1.5px] border-[#1C1A33] rounded-full text-sm sm:text-base font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors inline-flex items-center justify-center"
            >
              Manage your data in Settings
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};