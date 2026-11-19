'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { sendAstraMessage } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  Loader2,
  Stethoscope,
  Sparkles,
  HeartPulse
} from 'lucide-react';

interface AstraVoiceChatProps {
  currentAQI: number;
  city: string;
}

export const AstraVoiceChat: React.FC<AstraVoiceChatProps> = ({ currentAQI, city }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'astra',
      text: `Hello, I'm Astra, your respiratory health and clean-air advisor. Outdoor air in ${city} is currently at AQI ${currentAQI} with active thermal trapping. How is your family feeling today, or what can I help you adjust?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Child coughing in morning smog',
        'N95 mask fit check',
        'Can I open windows today?',
        'DIY Corsi-Rosenthal filter specs'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const reply = await sendAstraMessage(history, currentAQI, city);

      const astraMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'astra',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, astraMsg]);
      soundFX.playChime();
      speakText(reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0b1813] rounded-3xl p-5 sm:p-7 border border-white/10 flex flex-col h-[640px] shadow-xl">
      {/* Clinician Style Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#142e22] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Stethoscope className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Astra
              <span className="text-[10px] font-medium bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Respiratory Advisor
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Guidance for {city} (AQI {currentAQI}) • WHO & Pediatric Respiratory Framework
            </p>
          </div>
        </div>

        {/* Audio Output Button */}
        <button
          onClick={() => {
            if (ttsEnabled && typeof window !== 'undefined') window.speechSynthesis.cancel();
            setTtsEnabled(!ttsEnabled);
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            ttsEnabled
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-[#10221a] border-white/10 text-slate-400'
          }`}
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          <span>{ttsEnabled ? 'Voice ON' : 'Muted'}</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((m) => {
          const isAstra = m.sender === 'astra';

          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isAstra ? 'justify-start' : 'justify-end'}`}
            >
              {isAstra && (
                <div className="w-7 h-7 rounded-lg bg-[#142e22] border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                  isAstra
                    ? 'bg-[#10221a] border border-white/5 text-slate-200 shadow-sm'
                    : 'bg-emerald-700 text-white font-medium ml-auto shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Quick Suggestion Chips */}
                {m.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
                    {m.suggestedActions.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-[11px] bg-[#162e23] hover:bg-[#1e3d2f] border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-right opacity-60">
                  {m.timestamp}
                </div>
              </div>

              {!isAstra && (
                <div className="w-7 h-7 rounded-lg bg-[#10221a] border border-white/10 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-emerald-300 bg-[#10221a] p-3 rounded-2xl w-fit border border-emerald-500/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Consulting atmospheric respiratory guidelines...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-white/5 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening... Speak naturally..." : "Ask Astra about morning coughs, mask seals, or room filtration..."}
            className={`flex-1 bg-[#0a1712] border rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
              isListening ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10 focus:border-emerald-500'
            }`}
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-400'
                : 'bg-[#10221a] text-slate-300 border-white/10 hover:bg-[#162e23]'
            }`}
            title="Speech input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-40 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
