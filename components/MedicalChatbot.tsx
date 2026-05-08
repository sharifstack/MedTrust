'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdClose,
  MdSend,
  MdSmartToy,
  MdPerson,
  MdMedicalServices,
  MdHealthAndSafety,
  MdCalendarMonth,
  MdSearch,
  MdFavorite,
  MdLocalPharmacy,
  MdInfo,
} from 'react-icons/md';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: <MdCalendarMonth size={14} />, label: 'Book appointment', text: 'How can I book an appointment?' },
  { icon: <MdSearch size={14} />, label: 'Find a doctor', text: 'I need to find a doctor for my symptoms.' },
  { icon: <MdFavorite size={14} />, label: 'Heart symptoms', text: 'I have chest pain and shortness of breath.' },
  { icon: <MdLocalPharmacy size={14} />, label: 'Medication help', text: 'Can you help me understand my medications?' },
  { icon: <MdHealthAndSafety size={14} />, label: 'Health advice', text: 'Give me some general health tips.' },
  { icon: <MdInfo size={14} />, label: 'My vitals', text: 'What do my current vitals mean?' },
];

// Lightweight markdown-to-JSX renderer
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc list-inside space-y-0.5 my-1 text-sm">
          {listItems.map((item, i) => (
            <li key={i} className="text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: applyInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const applyInline = (str: string) =>
    str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 rounded text-[12px]">$1</code>');

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList(String(i));
      if (trimmed === '') {
        if (elements.length > 0) elements.push(<div key={`sp-${i}`} className="h-1" />);
      } else {
        elements.push(
          <p key={i} className="text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: applyInline(trimmed) }} />
        );
      }
    }
  });
  flushList('end');
  return elements;
}

interface MedicalChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MedicalChatbot({ isOpen, onClose }: MedicalChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! 👋 I'm **MedTrust AI**, your personal medical assistant. I can help you with:\n- Finding the right doctor\n- Understanding symptoms\n- Booking appointments\n- Health advice & wellness tips\n- Medication questions\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      setShowQuickPrompts(false);
      setInput('');

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const history = [...messages, userMsg]
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content }));

        // Include the welcome message as context if it's the first real message
        const apiMessages =
          history.length === 1
            ? [{ role: 'user', content }]
            : history;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        });

        const data = await res.json();
        const aiMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.message ?? "I'm sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: '⚠️ Connection error. Please check your internet connection and try again.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[80]"
            onClick={onClose}
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[90] w-full max-w-[420px] flex flex-col"
            style={{ height: 'min(640px, calc(100vh - 96px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200/80"
              style={{
                background: '#ffffff',
                boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,88,190,0.12)',
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center gap-3 px-5 py-4 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #091426 0%, #0058be 100%)',
                }}
              >
                {/* AI Avatar */}
                <div className="relative w-10 h-10 shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/25">
                    <MdSmartToy size={22} className="text-white" />
                  </div>
                  {/* Pulse dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#091426]">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight">MedTrust AI</p>
                  <p className="text-white/60 text-[11px]">Always available</p>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-2.5 py-1 mr-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-300 text-[10px] font-semibold">Online</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <MdClose size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ background: '#f8fafc' }}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'assistant'
                          ? 'bg-gradient-to-br from-[#091426] to-[#0058be]'
                          : 'bg-gradient-to-br from-slate-600 to-slate-800'
                        }`}
                    >
                      {msg.role === 'assistant' ? (
                        <MdMedicalServices size={14} className="text-white" />
                      ) : (
                        <MdPerson size={14} className="text-white" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                          ? 'bg-[#0058be] text-white rounded-tr-sm'
                          : 'bg-white border border-slate-100 shadow-sm rounded-tl-sm'
                        }`}
                      style={msg.role === 'user' ? {} : { color: '#1b1b1d' }}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="space-y-1">{renderMarkdown(msg.content)}</div>
                      ) : (
                        <p className="text-[13px] leading-relaxed text-white">{msg.content}</p>
                      )}
                      <p
                        className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/50 text-right' : 'text-slate-400'
                          }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="flex gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#091426] to-[#0058be] flex items-center justify-center shrink-0">
                        <MdMedicalServices size={14} className="text-white" />
                      </div>
                      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 bg-[#0058be] rounded-full block"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick prompts ── */}
              <AnimatePresence>
                {showQuickPrompts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pt-3 overflow-hidden shrink-0"
                    style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb' }}
                  >
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                      Quick questions
                    </p>
                    <div className="flex flex-wrap gap-1.5 pb-3">
                      {QUICK_PROMPTS.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => sendMessage(p.text)}
                          className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border border-[#0058be]/30 text-[#0058be] bg-[#0058be]/5 hover:bg-[#0058be]/10 hover:border-[#0058be]/50 transition-all"
                        >
                          {p.icon}
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Input bar ── */}
              <div
                className="px-4 pb-4 pt-3 shrink-0"
                style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb' }}
              >
                <div className="flex items-end gap-2">
                  <div
                    className="flex-1 flex items-end rounded-2xl border border-slate-200 bg-slate-50 hover:border-[#0058be]/40 focus-within:border-[#0058be] focus-within:bg-white transition-all px-4 py-2.5"
                    style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about your health…"
                      rows={1}
                      className="flex-1 bg-transparent text-[13px] text-slate-800 placeholder-slate-400 resize-none outline-none leading-5"
                      style={{ maxHeight: '100px', minHeight: '20px' }}
                      onInput={(e) => {
                        const t = e.target as HTMLTextAreaElement;
                        t.style.height = 'auto';
                        t.style.height = `${t.scrollHeight}px`;
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0"
                    style={{
                      background:
                        input.trim() && !isLoading
                          ? 'linear-gradient(135deg, #0058be, #1a7aff)'
                          : '#e2e8f0',
                      cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <MdSend
                      size={18}
                      className={input.trim() && !isLoading ? 'text-white' : 'text-slate-400'}
                      style={{ transform: 'rotate(-45deg) translate(1px, -1px)' }}
                    />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  MedTrust AI provides general guidance only — not a substitute for professional medical advice.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
