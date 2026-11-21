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
  Stethoscope
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface AstraVoiceChatProps {
  currentAQI: number;
  city: string;
}

export function AstraVoiceChat({ currentAQI, city }: AstraVoiceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'astra',
      text: `Hello, I am Astra, your respiratory health and clean air advisor. Outdoor air in ${city} is currently at AQI ${currentAQI} with active thermal trapping. How is your family feeling today, or what can I help you adjust?`,
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

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

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
    <div className="card-chai p-6 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-neutral-100 dark:bg-black/30 text-brand shadow-xs">
            <Stethoscope className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Astra</h3>
              <Chip tone="default" className="text-xs sm:text-sm font-semibold">Respiratory advisor</Chip>
            </div>
            <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
              Personalized guidance for {city} (AQI {currentAQI}) based on <Highlight>pediatric respiratory safety</Highlight>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (ttsEnabled && typeof window !== 'undefined') window.speechSynthesis.cancel();
            setTtsEnabled(!ttsEnabled);
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-300 dark:border-border/60 bg-neutral-100 dark:bg-black/20 px-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-400 hover:text-foreground transition-colors shadow-xs"
        >
          {ttsEnabled ? <Volume2 className="size-3.5 text-brand" /> : <VolumeX className="size-3.5" />}
          <span>{ttsEnabled ? 'Voice on' : 'Muted'}</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 [scrollbar-width:none]">
        {messages.map((m) => {
          const isAstra = m.sender === 'astra';

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isAstra ? 'justify-start' : 'justify-end'}`}
            >
              {isAstra && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded border border-border bg-neutral-100 dark:bg-black/40 text-brand mt-1 shadow-xs">
                  <Stethoscope className="size-3" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-xl p-3.5 text-xs leading-relaxed space-y-2 border shadow-xs ${
                  isAstra
                    ? 'border-border/70 bg-neutral-100/90 dark:bg-black/30 text-neutral-800 dark:text-neutral-200 font-medium'
                    : 'border-neutral-800 bg-neutral-900 text-white font-semibold ml-auto'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-border/40">
                    {m.suggestedActions.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="rounded border border-neutral-300 dark:border-border/50 bg-white dark:bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 dark:text-neutral-300 hover:border-brand hover:text-brand transition-colors cursor-pointer shadow-xs"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] font-medium text-neutral-500 text-right">
                  {m.timestamp}
                </div>
              </div>

              {!isAstra && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded border border-border bg-neutral-200 dark:bg-black/40 text-neutral-700 dark:text-neutral-400 mt-1 shadow-xs">
                  <User className="size-3" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-400 p-3 rounded-lg border border-border/60 bg-neutral-100/80 dark:bg-black/20 w-fit shadow-xs">
            <Loader2 className="size-3.5 animate-spin text-brand" />
            <span>Consulting atmospheric respiratory guidelines...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-border/60 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening... Speak naturally..." : "Ask Astra about morning coughs, mask seals, or room filtration..."}
            className="flex-1 h-11 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 text-sm font-semibold text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-brand shadow-xs"
          />

          <button
            type="button"
            onClick={toggleListening}
            className="flex size-11 items-center justify-center rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-foreground transition-colors cursor-pointer shadow-xs"
            title="Speech input"
          >
            {isListening ? <MicOff className="size-5 text-red-600 dark:text-red-400" /> : <Mic className="size-5" />}
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="inline-flex h-11 px-4 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-40 cursor-pointer font-bold shadow-xs"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
