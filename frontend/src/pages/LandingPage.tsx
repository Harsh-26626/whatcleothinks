import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative px-gutter pt-space-xl pb-16 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-space-xl">
        <div className="flex flex-col items-start max-w-2xl flex-1 z-10">
          <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded-full text-label-sm text-on-surface-variant mb-space-md shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>Private & confidential WhatsApp chat analysis</span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-space-md tracking-tight">
            Upload a chat. Cleo tells you what's really going on.
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl leading-relaxed">
            Sometimes you're too close to see the full picture. Let Cleo read between the lines of your WhatsApp export with honest warmth, monthly evolution, and zero judgment.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full sm:w-auto">
            <Link
              to={user ? "/new" : "/signup"}
              className="bg-primary hover:bg-primary-container text-on-primary px-space-xl py-space-md rounded-lg font-label-md text-label-md text-center transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-space-sm"
            >
              <span>{user ? "Create a report" : "Start your report"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            <div className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-lowest shadow-sm text-body-sm text-on-surface-variant border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
              <span>Deleted right after analysis</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Interactive Card Preview */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/15 via-amber-500/10 to-transparent rounded-3xl blur-2xl -z-10"></div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xl flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <div className="w-3 h-3 rounded-full bg-rose-300"></div>
                <div className="w-3 h-3 rounded-full bg-amber-200"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <span className="text-label-sm text-on-surface-variant font-mono">WhatsApp Chat with Vanshika.txt</span>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-on-surface font-medium">8-month evolution analysis</span>
                <span className="text-label-sm text-primary font-medium">Done</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-full rounded-full"></div>
              </div>
            </div>

            <div className="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container-lowest shadow-sm border border-outline-variant/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-serif font-bold">
                C
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Cleo's Perspective</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  "Neither of you became the sole keeper of the conversation. You initiated 51% and Vanshika brought 56% of the messages—a rare, effortless balance."
                </p>
              </div>
            </div>

            {/* Simulated Quote Bubble */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-2">
              <div className="self-start bg-surface-container-lowest border border-outline-variant/20 p-2.5 rounded-xl rounded-tl-none max-w-[85%] text-body-sm text-on-surface">
                "Tu soyi nahi abhi tak? 2 baj rahe"
                <div className="text-[10px] text-on-surface-variant text-right mt-0.5">02:04 AM</div>
              </div>
              <div className="self-end bg-primary text-on-primary p-2.5 rounded-xl rounded-tr-none max-w-[85%] text-body-sm">
                "Nahi, bas reading kar rahi thi ✨"
                <div className="text-[10px] text-on-primary/80 text-right mt-0.5">02:05 AM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Privacy Section (Placed high on page) */}
      <section className="px-gutter py-space-lg max-w-7xl mx-auto w-full">
        <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md border border-outline-variant/20 flex flex-col lg:flex-row items-center justify-between gap-space-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col max-w-xl">
            <div className="inline-flex items-center gap-space-xs text-primary text-label-sm font-medium mb-space-xs">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Absolute Sanctuary</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm">
              Your words belong only to you.
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              We built whatcleothinks as a private room of your own. Here are the 5 core truths of how we protect your privacy:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-space-sm w-full lg:w-96">
            <div className="bg-surface-container-low p-space-sm rounded-lg text-body-sm text-on-surface flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">check_circle</span>
              <span>The chat file is deleted right after the report is created.</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg text-body-sm text-on-surface flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">check_circle</span>
              <span>The report is saved to your account until you delete it.</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg text-body-sm text-on-surface flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">check_circle</span>
              <span>The report can include short quotes from the chat.</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg text-body-sm text-on-surface flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">check_circle</span>
              <span>You can delete any report, or your whole account, at any time.</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg text-body-sm text-on-surface flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">check_circle</span>
              <span>Nothing is shared with the people in the chat and nothing is sold.</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works in 3 Simple Steps */}
      <section className="px-gutter py-space-xl max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-space-xl">
          <span className="text-label-sm font-medium text-primary uppercase tracking-wider">Simple Process</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs">How Cleo works for you</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Step 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-md border border-outline-variant/20 relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-space-lg right-space-lg font-headline-xl text-surface-dim font-bold select-none">01</div>
            <div className="flex flex-col gap-space-md z-10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">ios_share</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Export your WhatsApp chat</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Open any chat in WhatsApp, tap settings, choose "Export Chat", and select <span className="font-medium text-on-surface">"Without Media"</span>. Takes less than 10 seconds.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center gap-space-xs text-label-sm text-primary font-medium">
              <span>Quick & effortless</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-md border border-outline-variant/20 relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-space-lg right-space-lg font-headline-xl text-surface-dim font-bold select-none">02</div>
            <div className="flex flex-col gap-space-md z-10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Upload & choose who you are</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Drop your `.txt` or `.zip` export. Cleo previews the participants and asks <span className="font-medium text-on-surface">"Which one is you?"</span> so insights speak to you directly.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center gap-space-xs text-label-sm text-primary font-medium">
              <span>Memory-only processing</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-md border border-outline-variant/20 relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-space-lg right-space-lg font-headline-xl text-surface-dim font-bold select-none">03</div>
            <div className="flex flex-col gap-space-md z-10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">auto_stories</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Receive your monthly story</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Explore an interactive heatmap, month-by-month closeness trajectory, turning points, and real chat quotes wrapped in Cleo's thoughtful editorial voice.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center gap-space-xs text-label-sm text-primary font-medium">
              <span>Permanently deletable</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blurred Sample Report Preview */}
      <section className="px-gutter py-space-xl max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-space-lg">
          <span className="text-label-sm font-medium text-primary uppercase tracking-wider">Preview</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs">The kind of clarity you get</h2>
        </div>

        <div className="relative rounded-2xl overflow-hidden p-space-lg bg-surface-container-lowest border border-outline-variant/25 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md filter blur-[1px] opacity-75 pointer-events-none select-none">
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="text-label-sm text-primary font-medium">Activity Rhythm</div>
              <div className="h-24 bg-primary/10 rounded-lg mt-2"></div>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="text-label-sm text-primary font-medium">Monthly Closeness (May-Dec)</div>
              <div className="h-24 bg-secondary-container/40 rounded-lg mt-2"></div>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="text-label-sm text-primary font-medium">Initiation Balance</div>
              <div className="h-24 bg-tertiary-fixed/30 rounded-lg mt-2"></div>
            </div>
          </div>

          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="font-headline-md text-on-surface mb-2">Ready to discover your chat's story?</h3>
            <p className="text-body-md text-on-surface-variant max-w-md mb-6">
              Takes less than a minute. Your file is deleted right after the report is generated.
            </p>
            <Link
              to={user ? "/new" : "/signup"}
              className="bg-primary hover:bg-primary-container text-on-primary px-space-lg py-space-sm rounded-lg font-label-md shadow-md transition-all"
            >
              Start a new report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
