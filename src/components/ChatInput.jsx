import { useState } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

// ─────────────────────────────────────────────────────────────────────────────
// ChatInput — Powered by React Query via ChatContext
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatInput() {
  const [value, setValue] = useState('');
  const { sendMessage, isPending } = useChatContext();

  const handleSend = () => {
    if (!value.trim() || isPending) return;
    sendMessage(value);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="shrink-0 border-t border-slate-800 bg-slate-950 px-4 py-3 md:px-8 lg:px-16 xl:px-32">
      <div className="relative mx-auto max-w-3xl">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isPending}
          placeholder="Message Nexora AI…"
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 py-3 pl-4 pr-14 text-sm text-slate-100 placeholder-slate-500 outline-none transition-shadow focus:border-violet-500/60 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] focus:ring-0 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || isPending}
          className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-600">
        Nexora AI can make mistakes. Verify important information.
      </p>
    </footer>
  );
}
