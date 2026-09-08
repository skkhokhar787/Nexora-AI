import { useState } from "react";
import { User, Bot, ClipboardCopy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

// ── CodeBlock sub-component ─────────────────────────────────────────────────

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-slate-700/60">
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

      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#0f172a",
          fontSize: "0.82rem",
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Markdown component overrides ────────────────────────────────────────────

const markdownComponents = {
  // Fenced/inline code both come through here; `inline` tells them apart
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");

    if (inline) {
      return (
        <code
          className="rounded bg-slate-700/60 px-1.5 py-0.5 font-mono text-[0.8em] text-violet-300"
          {...props}
        >
          {children}
        </code>
      );
    }

    return <CodeBlock lang={match ? match[1] : "text"} code={codeString} />;
  },
  p({ children }) {
    return <p className="whitespace-pre-wrap mb-2 last:mb-0">{children}</p>;
  },
  strong({ children }) {
    return <strong className="font-semibold text-white">{children}</strong>;
  },
  ul({ children }) {
    return <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal pl-5 space-y-1 mb-2">{children}</ol>;
  },
  a({ children, href }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 underline hover:text-violet-300"
      >
        {children}
      </a>
    );
  },
};

// ── Main Component ──────────────────────────────────────────────────────────

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-violet-600/20 text-violet-400"
            : "bg-slate-800 text-slate-400"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-violet-600/15 text-slate-100"
            : "bg-slate-800/70 text-slate-300"
        }`}
      >
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
