import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { ChatType, Persona, UploadPreview } from '../types';

export const NewReportPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [chatType, setChatType] = useState<ChatType>('romance');
  const [guidePlatform, setGuidePlatform] = useState<'android' | 'iphone'>('android');
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<UploadPreview | null>(null);
  const [myName, setMyName] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  
  // Persona state
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('cleo');
  
  // Submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPersonas() {
      try {
        const list = await api.getPersonas();
        setPersonas(list);
      } catch (e) {
        console.warn('Failed to fetch personas', e);
      }
    }
    fetchPersonas();
  }, []);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setErrorMsg(null);
    setFile(selectedFile);
    setIsPreviewing(true);
    setPreviewData(null);
    setMyName('');

    try {
      const preview = await api.previewUpload(selectedFile);
      setPreviewData(preview);
      if (preview.participants.length > 0) {
        setMyName(preview.participants[0]);
      }
    } catch (err: any) {
      if (err instanceof ApiRequestError) {
        if (err.code === 'too_short') {
          setErrorMsg('This chat has fewer than 50 messages. Please upload a longer chat export.');
        } else if (err.code === 'unsupported_file') {
          setErrorMsg('Unsupported file type. Please upload a .txt or .zip WhatsApp export.');
        } else if (err.code === 'file_too_large') {
          setErrorMsg('The file exceeds the size limit. Please ensure you exported without media.');
        } else {
          setErrorMsg(err.message || 'Could not parse the chat export.');
        }
      } else {
        setErrorMsg('Error processing file. Please check your network or try another file.');
      }
      setFile(null);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setErrorMsg('Please select a WhatsApp export file.');
      return;
    }
    if (!myName) {
      setErrorMsg('Please select which participant you are.');
      return;
    }
    if (!consent) {
      setErrorMsg('You must confirm consent to generate this report.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.createReport({
        file,
        chatType,
        persona: selectedPersona,
        myName,
        consent: 'true',
      });
      navigate(`/processing/${res.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not start report creation.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-gutter py-space-xl">
      {/* Top Stepper Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
        <div>
          <span className="text-label-sm uppercase tracking-widest text-primary font-bold">
            Step {currentStep} of 4
          </span>
          <h1 className="font-headline-xl text-on-surface mt-1">Create New Cleo Report</h1>
        </div>

        {/* Stepper Pills */}
        <div className="flex flex-wrap items-center gap-space-xs bg-surface-container-lowest p-1.5 rounded-full border border-outline-variant/30">
          {[
            { step: 1, label: 'Chat Type' },
            { step: 2, label: 'Export Guide' },
            { step: 3, label: 'Upload' },
            { step: 4, label: 'Persona' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                if (item.step < currentStep || (item.step === 3 && file) || (item.step === 4 && file && previewData && myName && consent)) {
                  setCurrentStep(item.step);
                }
              }}
              className={`flex items-center gap-space-xs px-space-sm py-1 rounded-full text-label-sm transition-colors ${
                currentStep === item.step
                  ? 'bg-primary text-on-primary font-medium shadow-sm'
                  : currentStep > item.step
                  ? 'text-primary font-medium hover:bg-surface-container'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === item.step
                  ? 'bg-surface-container-lowest text-primary'
                  : 'bg-surface-container text-on-surface'
              }`}>
                {item.step}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-error-container/60 border border-error/30 text-on-error-container p-4 rounded-xl flex items-start gap-2 mb-space-md">
          <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Stepper Card */}
      <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-md border border-outline-variant/20 flex flex-col gap-space-lg">
        {/* STEP 1: Chat Type */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-space-md">
            <div>
              <h2 className="font-headline-lg text-on-surface">Choose what kind of chat this is</h2>
              <p className="text-body-md text-on-surface-variant mt-1">
                Cleo adapts her emotional focus and perspective to match the nature of your connection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-2">
              <div
                onClick={() => setChatType('romance')}
                className={`p-space-lg rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
                  chatType === 'romance'
                    ? 'ring-2 ring-primary border-primary/40 bg-surface-container-low shadow-sm'
                    : 'border-outline-variant/30 hover:bg-surface-container/40'
                }`}
              >
                <div className="flex items-center justify-between text-primary">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                  {chatType === 'romance' && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                </div>
                <div className="mt-4">
                  <h3 className="font-headline-md text-on-surface">Romance</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Effort balance, late-night rhythms, warmth, and unsaid emotional subtext.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setChatType('friends')}
                className={`p-space-lg rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
                  chatType === 'friends'
                    ? 'ring-2 ring-primary border-primary/40 bg-surface-container-low shadow-sm'
                    : 'border-outline-variant/30 hover:bg-surface-container/40'
                }`}
              >
                <div className="flex items-center justify-between text-secondary">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                  {chatType === 'friends' && <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>}
                </div>
                <div className="mt-4">
                  <h3 className="font-headline-md text-on-surface">Close Friends</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Inside jokes, banter dynamics, who reaches out, and what keeps the friendship alive.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setChatType('group')}
                className={`p-space-lg rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
                  chatType === 'group'
                    ? 'ring-2 ring-primary border-primary/40 bg-surface-container-low shadow-sm'
                    : 'border-outline-variant/30 hover:bg-surface-container/40'
                }`}
              >
                <div className="flex items-center justify-between text-tertiary">
                  <span className="material-symbols-outlined text-[24px]">groups</span>
                  {chatType === 'group' && <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>}
                </div>
                <div className="mt-4">
                  <h3 className="font-headline-md text-on-surface">Group Chat</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Group roles, energy spikes, who sparks discussions, and quiet phases.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-space-md">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-space-lg py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to export guide</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Export Guide */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-space-md">
            <div>
              <h2 className="font-headline-lg text-on-surface">How to export your chat without media</h2>
              <p className="text-body-md text-on-surface-variant mt-1">
                WhatsApp exports take less than 10 seconds. Be sure to tap <strong className="text-on-surface">"Without Media"</strong> so your photos stay on your phone.
              </p>
            </div>

            {/* Platform Tabs */}
            <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit">
              <button
                onClick={() => setGuidePlatform('android')}
                className={`px-4 py-2 rounded-lg text-label-md font-medium transition-all ${
                  guidePlatform === 'android'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setGuidePlatform('iphone')}
                className={`px-4 py-2 rounded-lg text-label-md font-medium transition-all ${
                  guidePlatform === 'iphone'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                iPhone
              </button>
            </div>

            {/* Steps list */}
            {guidePlatform === 'android' ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm mt-2">
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">1</span>
                  <div className="font-headline-sm text-on-surface">Open Chat</div>
                  <p className="text-body-sm text-on-surface-variant">Open the WhatsApp conversation you wish to analyze.</p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">2</span>
                  <div className="font-headline-sm text-on-surface">Tap More</div>
                  <p className="text-body-sm text-on-surface-variant">Tap the three dots (⋮) in the top right corner & select <strong>More</strong>.</p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">3</span>
                  <div className="font-headline-sm text-on-surface">Export Chat</div>
                  <p className="text-body-sm text-on-surface-variant">Choose <strong>Export chat</strong> from the menu.</p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2 border-2 border-primary/40">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm">4</span>
                  <div className="font-headline-sm text-primary">Without Media</div>
                  <p className="text-body-sm text-on-surface-variant">Select <strong>Without Media</strong> and save the text file.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm mt-2">
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">1</span>
                  <div className="font-headline-sm text-on-surface">Open Chat</div>
                  <p className="text-body-sm text-on-surface-variant">Open the conversation in WhatsApp on your iPhone.</p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">2</span>
                  <div className="font-headline-sm text-on-surface">Contact Info</div>
                  <p className="text-body-sm text-on-surface-variant">Tap the contact or group name at the top of the screen.</p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">3</span>
                  <div className="font-headline-sm text-on-surface">Export Chat</div>
                  <p className="text-body-sm text-on-surface-variant">Scroll down to the bottom and tap <strong>Export Chat</strong>.</p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2 border-2 border-primary/40">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm">4</span>
                  <div className="font-headline-sm text-primary">Without Media</div>
                  <p className="text-body-sm text-on-surface-variant">Choose <strong>Attach Without Media</strong> and save to Files or share.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-space-md pt-space-sm border-t border-surface-container-high">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-body-sm text-on-surface-variant hover:text-on-surface font-medium"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-space-lg py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>I have my export file</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Upload Zone, Preview & Who Are You */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-space-md">
            <div>
              <h2 className="font-headline-lg text-on-surface">Upload your WhatsApp export</h2>
              <p className="text-body-md text-on-surface-variant mt-1">
                Upload your `.txt` or `.zip` export file. Cleo reads it in server memory to identify participants.
              </p>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-space-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                file
                  ? 'border-primary/60 bg-surface-container-low'
                  : 'border-outline-variant/40 hover:border-primary/40 bg-surface hover:bg-surface-container-low/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.zip"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
              />

              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
              </div>

              {isPreviewing ? (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>Inspecting chat export in memory...</span>
                </div>
              ) : file ? (
                <div>
                  <p className="font-headline-sm text-on-surface">{file.name}</p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-headline-sm text-on-surface">Drop your WhatsApp export here</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Accepts <strong>.txt</strong> or <strong>.zip</strong> exported "Without Media"
                  </p>
                  <span className="inline-block mt-3 bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg text-label-sm font-medium shadow-sm">
                    Browse files
                  </span>
                </div>
              )}
            </div>

            {/* Participants & Which One Is You */}
            {previewData && (
              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-md animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-high pb-space-sm">
                  <div className="flex items-center gap-2 text-label-md text-on-surface font-medium">
                    <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                    <span>Found {previewData.messageCount} messages across {previewData.participants.length} participants</span>
                  </div>
                  <div className="text-label-sm text-on-surface-variant">
                    {previewData.dateRange.start} → {previewData.dateRange.end}
                  </div>
                </div>

                <div>
                  <label className="block font-headline-sm text-on-surface mb-2">
                    Which participant is you?
                  </label>
                  <p className="text-body-sm text-on-surface-variant mb-3">
                    Cleo will speak directly to you as "you" and refer to others by name.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {previewData.participants.map((name) => (
                      <div
                        key={name}
                        onClick={() => setMyName(name)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          myName === name
                            ? 'bg-surface-container-lowest border-primary ring-2 ring-primary text-primary font-medium shadow-sm'
                            : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className="truncate">{name}</span>
                        {myName === name && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="mt-2 pt-space-sm border-t border-surface-container-high">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-outline accent-primary cursor-pointer"
                    />
                    <span className="text-body-sm text-on-surface leading-relaxed">
                      I confirm that I have permission from the participants to analyze this chat. I understand that the raw chat file is processed in memory and permanently deleted immediately after the report is created.
                    </span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-space-md pt-space-sm border-t border-surface-container-high">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-body-sm text-on-surface-variant hover:text-on-surface font-medium"
              >
                ← Back
              </button>
              <button
                disabled={!file || !previewData || !myName || !consent}
                onClick={() => setCurrentStep(4)}
                className="bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-label-md px-space-lg py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to persona</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Choose Persona */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-space-md">
            <div>
              <h2 className="font-headline-lg text-on-surface">Choose your AI guide</h2>
              <p className="text-body-md text-on-surface-variant mt-1">
                Cleo is our signature guide—honest, friendly, perceptive, and kind. More specialized personas are in development.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-2">
              {(personas.length > 0
                ? personas
                : [
                    { id: 'cleo', name: 'Cleo', tagline: 'Warm, direct, perceptive, and deeply fair.', available: true },
                    { id: 'dev', name: 'Dev', tagline: 'Deeply analytical data breakdown.', available: false },
                    { id: 'tara', name: 'Tara', tagline: 'Playful, meme-fluent perspective.', available: false },
                  ]
              ).map((p) => {
                const isSelected = selectedPersona === p.id;
                const isAvailable = p.available;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (isAvailable) setSelectedPersona(p.id);
                    }}
                    className={`p-space-lg rounded-2xl flex flex-col justify-between transition-all ${
                      isAvailable
                        ? isSelected
                          ? 'ring-2 ring-primary border border-primary/40 bg-surface-container-low shadow-sm cursor-pointer'
                          : 'border border-outline-variant/30 hover:bg-surface-container cursor-pointer'
                        : 'border border-outline-variant/30 bg-surface opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-serif text-xl font-bold">
                        {p.name.charAt(0)}
                      </div>
                      {isAvailable ? (
                        <span className="px-2 py-0.5 rounded-full text-label-sm bg-primary text-on-primary font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          Soon
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="font-headline-md text-on-surface">{p.name}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                        {p.tagline || (isAvailable ? 'Warm, direct, and kind.' : 'In active development.')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Confirmation Card */}
            <div className="bg-surface-container-low p-space-md rounded-2xl mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-label-md font-medium text-on-surface">
                  Ready to generate report for {myName}
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Chat Type: {chatType.toUpperCase()} • Persona: Cleo • File: {file?.name}
                </div>
              </div>

              <div className="flex items-center gap-2 text-label-sm text-primary font-medium">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Chat deleted right after creation</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-space-md pt-space-sm border-t border-surface-container-high">
              <button
                onClick={() => setCurrentStep(3)}
                disabled={isSubmitting}
                className="text-body-sm text-on-surface-variant hover:text-on-surface font-medium"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-label-md px-space-xl py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    <span>Starting Cleo's analysis...</span>
                  </>
                ) : (
                  <>
                    <span>Generate My Report</span>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
