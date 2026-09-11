import { useState } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchModels } from "../APIs/chatApi";
import { useChatContext } from "../context/ChatContext";

// ─────────────────────────────────────────────────────────────────────────────
// ChatInput — Powered by React Query via ChatContext
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatInput() {
  const [value, setValue] = useState("");
  const { sendMessage, isPending, model, setModel } = useChatContext();

  const {
    data: models,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["groqModels"],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour to avoid spamming the API
  });

  const handleSend = () => {
    if (!value.trim() || isPending) return;
    sendMessage(value);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="shrink-0 border-t border-slate-900 bg-[#030611] px-4 py-4 md:px-8 lg:px-16 xl:px-32">
      {/* Unified Input Container */}
      {/* <div className="flex md:w-full lg:w-full border"> */}
      <div className="mx-auto flex max-w-4xl justify-center items-center p-2 rounded-2xl border border-[#1e2638] bg-[#090d1a] transition focus-within:border-violet-600/60 focus-within:ring-1 focus-within:ring-violet-600/30">
        {/* Textarea */}
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isPending}
          placeholder="Message Nexora AI…"
          className="min-h-[52px] w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-slate-200 placeholder-slate-500 outline-none disabled:opacity-50"
        />

        {/* Bottom Controls Row */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Left: Model Selector */}
          <div className="flex items-center">
            {isLoading ? (
              <span className="pl-2 text-xs text-slate-500">
                Loading models...
              </span>
            ) : isError ? (
              <span className="pl-2 text-xs text-slate-500">
                Error loading models
              </span>
            ) : (
              <div className="relative flex items-center">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  aria-label="Select AI model"
                  className="appearance-none max-w-[120px] truncate cursor-pointer rounded-full bg-[#0d1225] py-1.5 pl-3 pr-8 text-xs text-slate-300 outline-none transition hover:bg-[#1a233a]"
                >
                  {models?.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className="bg-[#090d1a] text-slate-200"
                    >
                      {m.id}
                    </option>
                  ))}
                </select>
                {/* Custom Chevron Icon for the select */}
                <svg
                  className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            )}
          </div>
        </div>
        {/* Right: Send Button */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || isPending}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-[#361e6d] disabled:text-slate-500 disabled:opacity-50"
          aria-label="Send message"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </button>
      </div>
      {/* </div> */}
      <p className="mt-2.5 text-center text-[11px] text-slate-600">
        Nexora AI can make mistakes. Verify important information.
      </p>
    </footer>
  );
}
