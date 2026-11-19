'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { sendAstraMessage } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Loader2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AstraVoiceChatProps {
  currentAQI: number;
  city: string;
}

export const AstraVoiceChat: React.FC<AstraVoiceChatProps> = ({ currentAQI, city }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'astra',
      text: `Hello! I'm Astra, your AI atmospheric health companion. Outdoor air in ${city} is currently at AQI ${currentAQI}. How can I help protect your household or plan low-emission alternatives today?`,
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

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Recognition (Web Speech API)
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

  // Text to Speech
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    // Strip markdown symbols for speech synthesis
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
      // Map to Gemini history format
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
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 flex flex-col h-[650px] relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Astra Smog & Respiratory Advisor
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Voice AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">Contextualized for {city} • Air Quality Index: {currentAQI}</p>
          </div>
        </div>

        {/* Voice TTS Toggle */}
        <button
          onClick={() => {
            if (ttsEnabled && typeof window !== 'undefined') window.speechSynthesis.cancel();
            setTtsEnabled(!ttsEnabled);
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            ttsEnabled
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-800 border-white/10 text-slate-400'
          }`}
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          <span>{ttsEnabled ? 'Voice Output ON' : 'Muted'}</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((m) => {
          const isAstra = m.sender === 'astra';

          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isAstra ? 'justify-start' : 'justify-end'}`}
            >
              {isAstra && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isAstra
                    ? 'bg-slate-900/80 border border-emerald-500/20 text-slate-200'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium ml-auto'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Suggested Action Chips */}
                {m.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-2 border-t border-white/10">
                    {m.suggestedActions.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-[11px] bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
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
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-slate-900/50 p-3 rounded-2xl w-fit border border-emerald-500/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Astra is analyzing air composition & formulating advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Mic & Send */}
      <div className="pt-4 border-t border-white/10 space-y-2">
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
            placeholder={isListening ? "Listening... Speak clearly into your mic..." : "Ask Astra about masks, coughs, DIY purifiers, or commute windows..."}
            className={`flex-1 bg-slate-900 border rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all ${
              isListening ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10 focus:border-emerald-500'
            }`}
          />

          {/* Speech-to-Text Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
            title="Speak using microphone (Speech Recognition)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
