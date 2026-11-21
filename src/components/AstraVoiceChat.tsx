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
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-black/30 text-brand">
            <Stethoscope className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-montserrat text-base font-semibold text-foreground">Astra</h3>
              <Chip tone="default">Respiratory advisor</Chip>
            </div>
            <p className="text-xs text-neutral-400">
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
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/40 px-2.5 text-xs text-neutral-400 hover:text-foreground hover:bg-black/20 transition-colors"
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
                <div className="flex size-6 shrink-0 items-center justify-center rounded border border-border bg-black/40 text-brand mt-1">
                  <Stethoscope className="size-3" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-xl p-3.5 text-xs leading-relaxed space-y-2 border ${
                  isAstra
                    ? 'border-border/40 bg-black/30 text-neutral-200'
                    : 'border-border/20 bg-neutral-900 text-white font-medium ml-auto'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-border/30">
                    {m.suggestedActions.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="rounded border border-border/40 bg-black/20 px-2.5 py-1 text-[11px] text-neutral-300 hover:border-brand hover:text-brand transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-neutral-500 text-right">
                  {m.timestamp}
                </div>
              </div>

              {!isAstra && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded border border-border bg-black/40 text-neutral-400 mt-1">
                  <User className="size-3" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 p-3 rounded-lg border border-border/30 bg-black/20 w-fit">
            <Loader2 className="size-3.5 animate-spin text-brand" />
            <span>Consulting atmospheric respiratory guidelines...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-border/40 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening... Speak naturally..." : "Ask Astra about morning coughs, mask seals, or room filtration..."}
            className="flex-1 h-9 rounded-md border border-border bg-black/30 px-3 text-xs text-foreground placeholder-neutral-500 focus:outline-none focus:border-brand"
          />

          <button
            type="button"
            onClick={toggleListening}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-black/20 text-neutral-400 hover:text-foreground transition-colors cursor-pointer"
            title="Speech input"
          >
            {isListening ? <MicOff className="size-4 text-red-400" /> : <Mic className="size-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
