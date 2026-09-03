import { Sparkles, Plus, ChevronDown, Thermometer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchModels } from '../APIs/chatApi';
import { useChatContext } from '../context/ChatContext';

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — UI with Dynamic Models via React Query
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { model, setModel, resetChat } = useChatContext();

  // Fetch models from Groq API
  const { data: models, isLoading, isError } = useQuery({
    queryKey: ['groqModels'],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour to avoid spamming the API
  });

  return (
    <aside className="flex w-72 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5">
      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">
          Nexora AI
        </span>
      </div>

      {/* ── New Chat ────────────────────────────────────────────────────── */}
      <button onClick={resetChat} className="group relative flex items-center justify-center gap-2 rounded-lg p-[1px]">
        {/* gradient border trick */}
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400 opacity-70 transition-opacity group-hover:opacity-100" />
        <span className="relative flex w-full items-center justify-center gap-2 rounded-[7px] bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors group-hover:bg-slate-900">
          <Plus className="h-4 w-4" />
          New Chat
        </span>
      </button>

      {/* ── Spacer ──────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Settings ────────────────────────────────────────────────────── */}
      <div className="space-y-5 border-t border-slate-800 pt-5">
        {/* Model selector */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <ChevronDown className="h-3.5 w-3.5" />
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full cursor-pointer rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
          >
            {isLoading && <option value={model}>Loading models...</option>}
            {isError && <option value={model}>Error loading models</option>}
            {!isLoading && !isError && models?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature slider */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
            <Thermometer className="h-3.5 w-3.5" />
            Temperature
            <span className="ml-auto font-mono text-violet-400">0.70</span>
          </label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            defaultValue={0.7}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
