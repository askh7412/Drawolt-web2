'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Maximize2, Minimize2, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { Locale } from '@/lib/i18n/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS: Record<Locale, string[]> = {
  en: [
    'Compare Standard vs TOP LINE series',
    'How does DRAWOLT ID serial verification work?',
    'Explain RBAC isolation for dealers',
    'Requirements to become a distributor',
  ],
  fa: [
    'تفاوت سری Standard و TOP LINE چیست؟',
    'نحوه استعلام اصالت DRAWOLT ID چگونه است؟',
    'امنیت و ایزوله‌سازی اطلاعات نمایندگان در RBAC',
    'شرایط و مدارک لازم برای اخذ نمایندگی فروش',
  ],
  de: [
    'Unterschied zwischen Standard und TOP LINE',
    'Wie funktioniert die DRAWOLT ID Prüfung?',
    'RBAC-Datentrennung für Fachhändler erklären',
    'Voraussetzungen für Vertriebspartner',
  ],
  ar: [
    'قارن بين سلسلة Standard و TOP LINE',
    'كيف يعمل التحقق من الرقم التسلسلي DRAWOLT ID؟',
    'شرح عزل البيانات للموزعين في نظام RBAC',
    'متطلبات التقديم لوكالة التوزيع',
  ],
};

export function RamaxAssistant() {
  const { locale, dir } = useLocale();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || streaming) return;

    const baseMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages([...baseMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setErrorMsg(null);
    setStreaming(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          locale,
          stream: true,
          history: baseMessages.slice(-8),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMessages(baseMessages);
        setErrorMsg(errData.error || 'Ramax encountered a server error.');
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setMessages(baseMessages);
        setErrorMsg('Streaming response unavailable.');
        setStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const clean = line.replace(/^data:\s*/, '').trim();
          if (!clean || clean === '[DONE]') continue;
          try {
            const payload = JSON.parse(clean) as { text?: string; error?: string };
            if (payload.error) {
              setErrorMsg(payload.error);
            } else if (payload.text) {
              accumulated += payload.text;
              setMessages([...baseMessages, { role: 'assistant', content: accumulated }]);
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }
          } catch {
            // Skip malformed SSE chunk
          }
        }
      }
    } catch {
      setMessages(baseMessages);
      setErrorMsg('Network error while contacting Ramax.');
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleCopy = (idx: number, content: string) => {
    void navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    window.setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div dir={dir} className="fixed right-5 bottom-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-3 flex flex-col overflow-hidden rounded-2xl border border-[#E5E9ED] bg-white shadow-2xl transition-all ${
              expanded
                ? 'h-[620px] w-[92vw] max-w-[560px]'
                : 'h-[490px] w-[350px] sm:w-[410px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E9ED] bg-[#101C35] px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9DCB16] font-mono text-xs font-bold text-[#101C35]">
                  RMX
                </span>
                <div>
                  <h3 className="text-sm font-semibold leading-none">
                    Ramax <span className="text-xs font-normal text-white/75">· راماکس</span>
                  </h3>
                  <p className="mt-1 text-[11px] text-white/70">
                    DRAWOLT Engineering & Partner Intelligence
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setErrorMsg(null);
                    }}
                    title="Clear conversation"
                    className="rounded-lg p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  title={expanded ? 'Compact size' : 'Expand window'}
                  className="rounded-lg p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {expanded ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Ramax"
                  className="rounded-lg p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation body */}
            <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto bg-[#F6F8FA] p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-[#E5E9ED] bg-white p-4 text-xs leading-relaxed text-[#202226]">
                    <p className="font-semibold text-[#101C35]">
                      {locale === 'fa'
                        ? 'سلام! من راماکس (Ramax)، دستیار فنی و تجاری DRAWOLT هستم.'
                        : locale === 'de'
                          ? 'Hallo! Ich bin Ramax, Ihr DRAWOLT Technik- und Partner-Assistent.'
                          : locale === 'ar'
                            ? 'مرحباً! أنا راماكس (Ramax)، المساعد الفني والتجاري لمنصة DRAWOLT.'
                            : 'Hello! I am Ramax, the DRAWOLT industrial engineering and partner concierge.'}
                    </p>
                    <p className="mt-1.5 text-[#7D8792]">
                      {locale === 'fa'
                        ? 'فقط بر اساس داده‌های مستند پلتفرم پاسخ می‌دهم و هیچ مشخصات یا تاییدیه مالی جعلی تولید نمی‌کنم.'
                        : 'I provide verified guidance within platform rules and never fabricate specs or financial approvals.'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-[#7D8792]">
                      {locale === 'fa' ? 'پیشنهادهای سریع:' : 'Quick Engineering Prompts'}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {QUICK_PROMPTS[locale].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          className="rounded-lg border border-[#E5E9ED] bg-white px-3 py-2 text-start text-xs font-medium text-[#101C35] transition-colors hover:border-[#101C35]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#101C35] text-white'
                        : 'border border-[#E5E9ED] bg-white text-[#202226]'
                    }`}
                  >
                    {msg.content || (streaming && idx === messages.length - 1 ? '...' : '')}
                  </div>
                  {msg.role === 'assistant' && msg.content && (
                    <button
                      type="button"
                      onClick={() => handleCopy(idx, msg.content)}
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[#7D8792] hover:text-[#101C35]"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="h-3 w-3 text-[#9DCB16]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}

              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[#E5E9ED] bg-white p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  locale === 'fa'
                    ? 'سوال خود را از راماکس بپرسید...'
                    : 'Ask Ramax about tools, warranty, RBAC, or dealer orders...'
                }
                className="min-w-0 flex-1 rounded-lg border border-[#E5E9ED] bg-[#F6F8FA] px-3 py-2 text-xs text-[#101C35] placeholder:text-[#7D8792] focus:border-[#101C35] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#9DCB16] px-3.5 py-2 text-xs font-bold text-[#101C35] transition-colors hover:bg-[#8EB812] disabled:opacity-45"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{locale === 'fa' ? 'ارسال' : 'Send'}</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-xl border border-[#101C35]/15 bg-[#101C35] px-4 py-3 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-[#202226] focus-visible:outline-2 focus-visible:outline-[#9DCB16]"
      >
        <Sparkles className="h-4 w-4 text-[#9DCB16]" />
        <span className="whitespace-nowrap">
          {locale === 'fa' ? 'گفتگو با راماکس (Ramax AI)' : 'Ask Ramax AI'}
        </span>
      </button>
    </div>
  );
}
