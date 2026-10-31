import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../lib/api';
import { ChatType, UploadPreview } from '../types';
import { CleoAvatar } from '../components/CleoAvatar';

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
    <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-14">
      {/* Thin Progress Bar: Coral line on Lilac background */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#5A5873] mb-2">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-[#E9E3FF] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#CF3A26] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-[#FFE0E8] border border-[#CF3A26]/30 text-[#CF3A26] text-sm rounded-[16px] font-medium">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: What kind of chat is it? */}
      {currentStep === 1 && (
        <div>
          <h1 className="font-heading font-bold text-[26px] xs:text-[30px] sm:text-[40px] text-[#1C1A33] tracking-tight mb-2 leading-tight">
            What kind of chat is it?
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mb-6 sm:mb-8">
            This guides the context and tone of the report.
          </p>

          <div className="flex flex-col gap-3.5 sm:gap-4">
            {[
              {
                type: 'romance' as ChatType,
                title: 'Romance',
                desc: 'Messages between partners, dating, or a relationship.',
                bgClass: 'bg-[#FFE0E8]',
              },
              {
                type: 'friends' as ChatType,
                title: 'Friends',
                desc: 'Conversations with a close friend or long-time pal.',
                bgClass: 'bg-[#DCEBFF]',
              },
              {
                type: 'group' as ChatType,
                title: 'Student group',
                desc: 'Study groups, college projects, and team threads.',
                bgClass: 'bg-[#FFF3C9]',
              },
            ].map((option) => {
              const isSelected = chatType === option.type;
              return (
                <div
                  key={option.type}
                  onClick={() => setChatType(option.type)}
                  className={`p-4 sm:p-6 rounded-[18px] sm:rounded-[20px] cursor-pointer transition-all duration-150 flex items-center justify-between ${option.bgClass} ${
                    isSelected ? 'ring-3 ring-[#1C1A33] shadow-sm' : 'hover:opacity-95'
                  }`}
                >
                  <div className="pr-3">
                    <div className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">{option.title}</div>
                    <div className="text-xs sm:text-sm text-[#1C1A33]/80 mt-1 leading-normal">{option.desc}</div>
                  </div>
                  {isSelected && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#CF3A26] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-sm">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-end mt-8 sm:mt-10">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 shadow-sm flex items-center justify-center"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Export your chat */}
      {currentStep === 2 && (
        <div>
          <h1 className="font-heading font-bold text-[26px] xs:text-[30px] sm:text-[40px] text-[#1C1A33] tracking-tight mb-2 leading-tight">
            Export your chat
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mb-6">
            Follow these steps inside WhatsApp. It takes about ten seconds.
          </p>

          {/* Platform Selector: Equal-width tabs on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:gap-3 gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => setGuidePlatform('android')}
              className={`min-h-[44px] px-6 py-2 rounded-full text-sm font-semibold transition-all duration-150 text-center ${
                guidePlatform === 'android'
                  ? 'bg-[#1C1A33] text-white shadow-sm'
                  : 'bg-white border-[1.5px] border-[#E7E5F0] text-[#5A5873] hover:text-[#1C1A33]'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setGuidePlatform('iphone')}
              className={`min-h-[44px] px-6 py-2 rounded-full text-sm font-semibold transition-all duration-150 text-center ${
                guidePlatform === 'iphone'
                  ? 'bg-[#1C1A33] text-white shadow-sm'
                  : 'bg-white border-[1.5px] border-[#E7E5F0] text-[#5A5873] hover:text-[#1C1A33]'
              }`}
            >
              iPhone
            </button>
          </div>

          {guidePlatform === 'android' ? (
            <div className="bg-white border border-[#E7E5F0] rounded-[20px] sm:rounded-[24px] p-5 sm:p-8">
              <ol className="space-y-3.5 sm:space-y-4 text-sm sm:text-base text-[#1C1A33]">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">1.</span>
                  <span>Open the conversation in WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">2.</span>
                  <span>Tap the three dots (⋮) in the top-right corner.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">3.</span>
                  <span>Select <strong>More</strong>, then tap <strong>Export chat</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">4.</span>
                  <div>
                    Choose{' '}
                    <span className="inline-block bg-[#FFF3C9] text-[#1C1A33] px-2 sm:px-2.5 py-0.5 rounded-lg font-bold border border-[#F2B01E]/40">
                      Without Media
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">5.</span>
                  <span>Save or share the exported <code>.txt</code> or <code>.zip</code> file to your device.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="bg-white border border-[#E7E5F0] rounded-[20px] sm:rounded-[24px] p-5 sm:p-8">
              <ol className="space-y-3.5 sm:space-y-4 text-sm sm:text-base text-[#1C1A33]">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">1.</span>
                  <span>Open the conversation in WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">2.</span>
                  <span>Tap the contact or group name at the top.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">3.</span>
                  <span>Scroll down and tap <strong>Export Chat</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">4.</span>
                  <div>
                    Choose{' '}
                    <span className="inline-block bg-[#FFF3C9] text-[#1C1A33] px-2 sm:px-2.5 py-0.5 rounded-lg font-bold border border-[#F2B01E]/40">
                      Without Media
                    </span>
                    .
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="font-heading font-bold text-base sm:text-lg text-[#CF3A26]">5.</span>
                  <span>Save to Files or share the file to your device.</span>
                </li>
              </ol>
            </div>
          )}

          {/* Mobile responsive buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-8 sm:mt-10 pt-6 border-t border-[#E7E5F0]">
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-white border-[1.5px] border-[#1C1A33] rounded-full text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors duration-150 flex items-center justify-center"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 shadow-sm flex items-center justify-center"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Upload */}
      {currentStep === 3 && (
        <div>
          <h1 className="font-heading font-bold text-[26px] xs:text-[30px] sm:text-[40px] text-[#1C1A33] tracking-tight mb-2 leading-tight">
            Upload your chat
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mb-6">
            We read the file to create your report, then delete it.
          </p>

          {/* 2px Dashed Drop Zone on Lilac (#E9E3FF) */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[20px] p-6 sm:p-12 text-center cursor-pointer transition-all duration-150 ${
              file
                ? 'border-[#1C1A33] bg-[#E9E3FF]'
                : 'border-[#CF3A26]/50 bg-[#E9E3FF] hover:border-[#CF3A26]'
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
              <p className="text-base text-[#1C1A33] font-semibold animate-pulse">Checking file…</p>
            ) : file ? (
              <div>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33] break-all">{file.name}</p>
                <p className="text-xs text-[#5A5873] mt-1 font-medium">
                  {(file.size / 1024).toFixed(1)} KB · Tap to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">
                  Tap to choose a .txt or .zip file
                </p>
                <p className="text-xs sm:text-sm text-[#5A5873] mt-1 font-medium">
                  Tap here to browse your files, or drag and drop
                </p>
              </div>
            )}
          </div>

          {/* Short note on privacy below drop zone */}
          <div className="mt-4 p-3 bg-[#FFF3C9] rounded-[16px] text-xs sm:text-sm font-semibold text-[#1C1A33] flex items-center justify-center gap-2 text-center">
            <span>🔒</span>
            <span>Your file is deleted immediately after processing.</span>
          </div>

          {/* After Upload: Which one is you? and Consent */}
          {previewData && (
            <div className="mt-6 sm:mt-8 pt-6 border-t border-[#E7E5F0] flex flex-col gap-5 sm:gap-6">
              <div>
                <label className="block font-heading font-bold text-base sm:text-lg text-[#1C1A33] mb-3">
                  Which one is you?
                </label>
                <div className="flex flex-col gap-2.5">
                  {previewData.participants.map((name) => (
                    <label
                      key={name}
                      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl cursor-pointer transition-colors duration-150 ${
                        myName === name
                          ? 'border-[2px] border-[#1C1A33] bg-[#DCEBFF]'
                          : 'border border-[#E7E5F0] bg-white hover:bg-[#F1EDFF]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="myName"
                          checked={myName === name}
                          onChange={() => setMyName(name)}
                          className="w-4 h-4 text-[#1C1A33] accent-[#1C1A33]"
                        />
                        <span className="text-base font-semibold text-[#1C1A33]">{name}</span>
                      </div>
                      {myName === name && <span className="text-[#1F7A4D] font-bold text-base sm:text-lg">✓</span>}
                    </label>
                  ))}
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="p-4 bg-[#FFE5D6] rounded-[16px]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#1C1A33] accent-[#1C1A33] shrink-0"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#1C1A33] leading-normal">
                    I agree to have this chat analysed to create my report.
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-8 sm:mt-10 pt-6 border-t border-[#E7E5F0]">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-white border-[1.5px] border-[#1C1A33] rounded-full text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors duration-150 flex items-center justify-center"
            >
              Back
            </button>
            <button
              disabled={!file || !previewData || !myName || !consent}
              onClick={() => setCurrentStep(4)}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Choose who reads it */}
      {currentStep === 4 && (
        <div>
          <h1 className="font-heading font-bold text-[26px] xs:text-[30px] sm:text-[40px] text-[#1C1A33] tracking-tight mb-2 leading-tight">
            Who should read it?
          </h1>
          <p className="text-sm sm:text-base text-[#5A5873] mb-6 sm:mb-8">
            Pick an AI reader for your report.
          </p>

          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Cleo (selected, lilac background #E9E3FF) */}
            <div
              onClick={() => setSelectedPersona('cleo')}
              className="p-4 sm:p-6 rounded-[18px] sm:rounded-[20px] bg-[#E9E3FF] border-[3px] border-[#1C1A33] flex items-center justify-between cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="shrink-0">
                  <CleoAvatar size={44} />
                </div>
                <div>
                  <div className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">
                    Cleo <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-[#CF3A26] text-white rounded-full ml-1">recommended</span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#5A5873] mt-0.5 leading-snug">
                    Honest, friendly, and kind. Looks at communication patterns and turning points.
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#CF3A26] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ml-2">
                ✓
              </div>
            </div>

            {/* Coming soon 1: Dev */}
            <div className="p-4 sm:p-6 rounded-[18px] sm:rounded-[20px] bg-[#F6F6F4] border border-[#E7E5F0] opacity-60 flex items-center justify-between cursor-not-allowed">
              <div>
                <div className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">Dev</div>
                <div className="text-xs sm:text-sm text-[#5A5873] mt-0.5 leading-snug">
                  Analytical reader focused on response statistics.
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#5A5873] bg-[#E7E5F0] px-2.5 sm:px-3 py-1 rounded-full shrink-0 ml-2">
                Coming soon
              </span>
            </div>

            {/* Coming soon 2: Tara */}
            <div className="p-4 sm:p-6 rounded-[18px] sm:rounded-[20px] bg-[#F6F6F4] border border-[#E7E5F0] opacity-60 flex items-center justify-between cursor-not-allowed">
              <div>
                <div className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">Tara</div>
                <div className="text-xs sm:text-sm text-[#5A5873] mt-0.5 leading-snug">
                  Playful read focused on humor and inside jokes.
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#5A5873] bg-[#E7E5F0] px-2.5 sm:px-3 py-1 rounded-full shrink-0 ml-2">
                Coming soon
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-8 sm:mt-10 pt-6 border-t border-[#E7E5F0]">
            <button
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-white border-[1.5px] border-[#1C1A33] rounded-full text-sm font-semibold text-[#1C1A33] hover:bg-[#F1EDFF] transition-colors duration-150 flex items-center justify-center"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 shadow-sm disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? 'Starting…' : 'Create my report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};