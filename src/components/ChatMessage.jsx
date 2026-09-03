import { useState } from 'react';
import { User, Bot, ClipboardCopy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


function parseContent(raw) {
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIdx) {
      const text = raw.slice(lastIdx, match.index).trim();
      if (text) parts.push({ type: 'text', value: text });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'text',
      value: match[2].replace(/\n+$/, ''),   // strip trailing newlines
    });
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < raw.length) {
    const text = raw.slice(lastIdx).trim();
    if (text) parts.push({ type: 'text', value: text });
  }

  return parts;
}


function renderInlineMarkdown(text) {
  // Match **bold** or `inline code`
  return text.split(/(\*\*.*?\*\*|`[^`]+`)/g).map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded bg-slate-700/60 px-1.5 py-0.5 font-mono text-[0.8em] text-violet-300"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}


function TextBlock({ text }) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderInlineMarkdown(para)}
        </p>
      ))}
    </div>
  );
}

// ── CodeBlock sub‑component ─────────────────────────────────────────────────

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-slate-700/60">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-1.5">
        <span className="text-xs font-medium text-slate-400">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <ClipboardCopy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Highlighted code */}
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#0f172a',
          fontSize: '0.82rem',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  const segments = parseContent(content);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-violet-600/20 text-violet-400'
            : 'bg-slate-800 text-slate-400'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] space-y-2 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-violet-600/15 text-slate-100'
            : 'bg-slate-800/70 text-slate-300'
        }`}
      >
        {segments.map((seg, i) =>
          seg.type === 'code' ? (
            <CodeBlock key={i} lang={seg.lang} code={seg.value} />
          ) : (
            <TextBlock key={i} text={seg.value} />
          ),
        )}
      </div>
    </div>
  );
}
