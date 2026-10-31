import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { ChatType, UploadPreview } from '../types';

export const NewReportPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [chatType, setChatType] = useState<ChatType>('romance');
  const [guidePlatform, setGuidePlatform] = useState<'android' | 'iphone'>('android');

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<UploadPreview | null>(null);
  const [myName, setMyName] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);

  // Persona state
  const [selectedPersona, setSelectedPersona] = useState<string>('cleo');

  // Submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
          setErrorMsg('Unsupported file format. Please upload a .txt or .zip file exported from WhatsApp.');
        } else if (err.code === 'file_too_large') {
          setErrorMsg('This file is too large. Please make sure to export without media.');
        } else {
          setErrorMsg(err.message || 'Could not read the chat export.');
        }
      } else {
        setErrorMsg('Network error while inspecting file. Please try again.');
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
    if (!file || !myName || !consent) return;

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
    <div className="w-full max-w-[680px] mx-auto py-12 md:py-16">
      {/* Thin Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-[#5F5F5A] mb-2 font-medium">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-[#E5E5E1] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#1A1A1A] h-full transition-all duration-150"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 border border-[#B42318] text-[#B42318] text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: What kind of chat is it? */}
      {currentStep === 1 && (
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-2">
            What kind of chat is it?
          </h1>
          <p className="text-base text-[#5F5F5A] mb-8">
            This guides the context and tone of the report.
          </p>

          <div className="flex flex-col gap-3">
            {[
              {
                type: 'romance' as ChatType,
                title: 'Romance',
                desc: 'Messages between partners, dating, or a relationship.',
              },
              {
                type: 'friends' as ChatType,
                title: 'Friends',
                desc: 'Conversations with a close friend or long-time pal.',
              },
              {
                type: 'group' as ChatType,
                title: 'Student group',
                desc: 'Study groups, college projects, and team threads.',
              },
            ].map((option) => {
              const isSelected = chatType === option.type;
              return (
                <div
                  key={option.type}
                  onClick={() => setChatType(option.type)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors duration-150 flex items-start justify-between border ${
                    isSelected
                      ? 'border-2 border-[#1A1A1A] bg-[#F6F6F4]'
                      : 'border-[#E5E5E1] bg-white hover:bg-[#F6F6F4]'
                  }`}
                >
                  <div>
                    <div className="text-base font-semibold text-[#1A1A1A]">{option.title}</div>
                    <div className="text-sm text-[#5F5F5A] mt-0.5">{option.desc}</div>
                  </div>
                  {isSelected && (
                    <span className="text-[#1F7A4D] font-bold text-lg leading-none ml-4">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-10">
            <button
              onClick={() => setCurrentStep(2)}
              className="min-h-[44px] px-6 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Export your chat */}
      {currentStep === 2 && (
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-2">
            Export your chat
          </h1>
          <p className="text-base text-[#5F5F5A] mb-6">
            Follow these steps inside WhatsApp. It takes about ten seconds.
          </p>

          {/* Android / iPhone Tabs */}
          <div className="flex gap-2 border-b border-[#E5E5E1] mb-6">
            <button
              onClick={() => setGuidePlatform('android')}
              className={`pb-2.5 px-3 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-[1px] ${
                guidePlatform === 'android'
                  ? 'border-[#1A1A1A] text-[#1A1A1A]'
                  : 'border-transparent text-[#5F5F5A] hover:text-[#1A1A1A]'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setGuidePlatform('iphone')}
              className={`pb-2.5 px-3 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-[1px] ${
                guidePlatform === 'iphone'
                  ? 'border-[#1A1A1A] text-[#1A1A1A]'
                  : 'border-transparent text-[#5F5F5A] hover:text-[#1A1A1A]'
              }`}
            >
              iPhone
            </button>
          </div>

          {guidePlatform === 'android' ? (
            <ol className="list-decimal pl-5 space-y-3 text-base text-[#1A1A1A]">
              <li>Open the chat in WhatsApp.</li>
              <li>Tap the three dots (⋮) in the top-right corner.</li>
              <li>Select <strong>More</strong>, then tap <strong>Export chat</strong>.</li>
              <li>
                <strong className="bg-[#F2B01E]/30 px-1.5 py-0.5 rounded">
                  Choose Without Media
                </strong>.
              </li>
              <li>Save or share the exported <code>.txt</code> or <code>.zip</code> file to your computer or phone.</li>
            </ol>
          ) : (
            <ol className="list-decimal pl-5 space-y-3 text-base text-[#1A1A1A]">
              <li>Open the chat in WhatsApp.</li>
              <li>Tap the contact or group name at the top.</li>
              <li>Scroll down and tap <strong>Export Chat</strong>.</li>
              <li>
                <strong className="bg-[#F2B01E]/30 px-1.5 py-0.5 rounded">
                  Choose Without Media
                </strong>.
              </li>
              <li>Save to Files or share the file to your device.</li>
            </ol>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E5E5E1]">
            <button
              onClick={() => setCurrentStep(1)}
              className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="min-h-[44px] px-6 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Upload */}
      {currentStep === 3 && (
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-2">
            Upload your chat
          </h1>
          <p className="text-base text-[#5F5F5A] mb-6">
            We read the file to create your report, then delete it.
          </p>

          {/* Dashed Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-150 ${
              file
                ? 'border-[#1A1A1A] bg-[#F6F6F4]'
                : 'border-[#E5E5E1] hover:border-[#1A1A1A] bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.zip"
              className="hidden"
              onChange={(e) =>
                e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])
              }
            />

            {isPreviewing ? (
              <p className="text-base text-[#1A1A1A] font-medium">Checking file…</p>
            ) : file ? (
              <div>
                <p className="text-base font-semibold text-[#1A1A1A]">{file.name}</p>
                <p className="text-xs text-[#5F5F5A] mt-1">
                  {(file.size / 1024).toFixed(1)} KB · Click to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-[#1A1A1A]">
                  Choose a .txt or .zip file
                </p>
                <p className="text-sm text-[#5F5F5A] mt-1">
                  Drag and drop here, or click to browse
                </p>
              </div>
            )}
          </div>

          {/* After Upload: Which one is you? and Consent */}
          {previewData && (
            <div className="mt-8 pt-6 border-t border-[#E5E5E1] flex flex-col gap-6">
              <div>
                <label className="block text-base font-semibold text-[#1A1A1A] mb-3">
                  Which one is you?
                </label>
                <div className="flex flex-col gap-2">
                  {previewData.participants.map((name) => (
                    <label
                      key={name}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                        myName === name
                          ? 'border-[#1A1A1A] bg-[#F6F6F4]'
                          : 'border-[#E5E5E1] bg-white hover:bg-[#F6F6F4]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="myName"
                          checked={myName === name}
                          onChange={() => setMyName(name)}
                          className="w-4 h-4 text-[#1A1A1A] accent-[#1A1A1A]"
                        />
                        <span className="text-base text-[#1A1A1A]">{name}</span>
                      </div>
                      {myName === name && <span className="text-[#1F7A4D] font-bold">✓</span>}
                    </label>
                  ))}
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#1A1A1A] accent-[#1A1A1A]"
                  />
                  <span className="text-sm text-[#1A1A1A] leading-normal">
                    I'm okay with this chat being analysed to create my report.
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E5E5E1]">
            <button
              onClick={() => setCurrentStep(2)}
              className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
            >
              Back
            </button>
            <button
              disabled={!file || !previewData || !myName || !consent}
              onClick={() => setCurrentStep(4)}
              className="min-h-[44px] px-6 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Choose who reads it */}
      {currentStep === 4 && (
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-2">
            Choose who reads it
          </h1>
          <p className="text-base text-[#5F5F5A] mb-8">
            Pick an AI reader for your report.
          </p>

          <div className="flex flex-col gap-3">
            {/* Cleo (selected) */}
            <div
              onClick={() => setSelectedPersona('cleo')}
              className="p-4 rounded-xl border-2 border-[#1A1A1A] bg-[#F6F6F4] flex items-start justify-between cursor-pointer"
            >
              <div>
                <div className="text-base font-semibold text-[#1A1A1A]">Cleo</div>
                <div className="text-sm text-[#5F5F5A] mt-0.5">
                  Honest, friendly, and kind. Looks at communication patterns and turning points.
                </div>
              </div>
              <span className="text-[#1F7A4D] font-bold text-lg leading-none ml-4">✓</span>
            </div>

            {/* Coming soon 1 */}
            <div className="p-4 rounded-xl border border-[#E5E5E1] bg-white opacity-50 flex items-start justify-between cursor-not-allowed">
              <div>
                <div className="text-base font-semibold text-[#1A1A1A]">Dev</div>
                <div className="text-sm text-[#5F5F5A] mt-0.5">
                  Analytical reader focused on response statistics.
                </div>
              </div>
              <span className="text-xs text-[#5F5F5A] border border-[#E5E5E1] px-2 py-0.5 rounded">
                Coming soon
              </span>
            </div>

            {/* Coming soon 2 */}
            <div className="p-4 rounded-xl border border-[#E5E5E1] bg-white opacity-50 flex items-start justify-between cursor-not-allowed">
              <div>
                <div className="text-base font-semibold text-[#1A1A1A]">Tara</div>
                <div className="text-sm text-[#5F5F5A] mt-0.5">
                  Playful read focused on humor and inside jokes.
                </div>
              </div>
              <span className="text-xs text-[#5F5F5A] border border-[#E5E5E1] px-2 py-0.5 rounded">
                Coming soon
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E5E5E1]">
            <button
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
              className="min-h-[44px] px-4 py-2 border border-[#E5E5E1] rounded-lg text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6F6F4]"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-h-[44px] px-6 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
            >
              {isSubmitting ? 'Starting…' : 'Create report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
