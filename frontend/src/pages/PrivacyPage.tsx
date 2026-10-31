import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full max-w-[680px] mx-auto py-12 md:py-16 flex flex-col gap-8 text-[#1A1A1A]">
      <h1 className="text-[30px] md:text-[40px] font-bold tracking-tight">
        Privacy, in plain words
      </h1>

      {/* The Five Statements */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[22px] font-bold">The five privacy rules</h2>
        <ol className="list-decimal pl-5 space-y-2 text-base leading-normal">
          <li>Your chat file is deleted right after your report is created.</li>
          <li>Your report is saved to your account until you delete it.</li>
          <li>Reports can include short quotes from your chat.</li>
          <li>You can delete any report, or your whole account, at any time.</li>
          <li>Nothing is shared with the people in the chat, and nothing is sold.</li>
        </ol>
      </section>

      {/* What we store */}
      <section className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-3">
        <h2 className="text-[22px] font-bold">What we store</h2>
        <ul className="list-disc pl-5 space-y-2 text-base leading-normal text-[#1A1A1A]">
          <li><strong>Your email:</strong> to identify your account and log you in.</li>
          <li><strong>A hashed password:</strong> stored using bcrypt, never in plain text.</li>
          <li><strong>Your reports:</strong> saved so you can read them whenever you log in. You can delete any report at any time.</li>
        </ul>
      </section>

      {/* What we send to an AI provider */}
      <section className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-3">
        <h2 className="text-[22px] font-bold">What we send to an AI provider</h2>
        <p className="text-base leading-normal text-[#1A1A1A]">
          To generate the written observations and identify turning points, the chat text is sent to an AI provider (Anthropic Claude API). This happens under commercial API terms where inputs are not used to train models.
        </p>
      </section>

      {/* Delete your data */}
      <section className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-3">
        <h2 className="text-[22px] font-bold">Delete your data</h2>
        <p className="text-base leading-normal text-[#1A1A1A]">
          You have full control over what is kept. You can delete individual reports, delete all reports at once, or permanently delete your entire account. Deletion is immediate and irreversible.
        </p>
        <div className="mt-2">
          <Link
            to="/settings"
            className="text-base text-[#1A1A1A] underline underline-offset-4 font-semibold hover:text-[#5F5F5A]"
          >
            Manage and delete data in Settings
          </Link>
        </div>
      </section>
    </div>
  );
};
