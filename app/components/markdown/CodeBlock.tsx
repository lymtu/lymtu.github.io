"use client";

import { useState, useCallback, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ThemeMode } from "./index";

/* ---------- 语言显示名映射 ---------- */
const LANG_LABELS: Record<string, string> = {
  js: "JavaScript",
  jsx: "JSX",
  javascript: "JavaScript",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  py: "Python",
  python: "Python",
  css: "CSS",
  scss: "SCSS",
  less: "Less",
  html: "HTML",
  xml: "XML",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  md: "Markdown",
  mdx: "MDX",
  bash: "Bash",
  sh: "Shell",
  zsh: "Zsh",
  sql: "SQL",
  graphql: "GraphQL",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  java: "Java",
  kotlin: "Kotlin",
  kt: "Kotlin",
  swift: "Swift",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  ruby: "Ruby",
  php: "PHP",
  lua: "Lua",
  dockerfile: "Dockerfile",
  toml: "TOML",
};

/* ---------- 语言标识色 ---------- */
const LANG_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  jsx: "#61dafb",
  typescript: "#3178c6",
  tsx: "#3178c6",
  python: "#3776ab",
  css: "#264de4",
  html: "#e34c26",
  json: "#292929",
  go: "#00add8",
  rust: "#dea584",
  java: "#ed8b00",
  ruby: "#cc342d",
  php: "#777bb4",
  swift: "#fa7343",
  sql: "#e38c00",
  bash: "#4eaa25",
  shell: "#4eaa25",
};

/* ---------- Props ---------- */
interface CodeBlockProps {
  language?: string;
  filename?: string;
  theme: ThemeMode;
  children: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  language = "",
  filename,
  theme,
  children,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = children;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
  }, [children]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const langKey = language.toLowerCase();
  const label = LANG_LABELS[langKey] || language.toUpperCase() || "TEXT";
  const dotColor = LANG_COLORS[langKey] || (theme === "dark" ? "#888" : "#aaa");
  const syntaxTheme = theme === "dark" ? oneDark : oneLight;
  const lineCount = children.trim().split("\n").length;

  return (
    <div className={`cb cb--${theme}`}>
      {/* ---- 眉头 ---- */}
      <div className="cb__header">
        <div className="cb__meta">
          <span className="cb__dot" style={{ background: dotColor }} />
          {filename ? (
            <span className="cb__file">{filename}</span>
          ) : (
            <span className="cb__lang">{label}</span>
          )}
        </div>
        <button
          className={`cb__copy ${copied ? "cb__copy--done" : ""}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon /> Copied
            </>
          ) : (
            <>
              <CopyIcon /> Copy
            </>
          )}
        </button>
      </div>

      {/* ---- 代码 ---- */}
      <div className="cb__body">
        <SyntaxHighlighter
          language={language || "text"}
          style={syntaxTheme}
          showLineNumbers={showLineNumbers && lineCount > 3}
          customStyle={{
            margin: 0,
            padding: "1.2rem 1.4rem",
            fontSize: "0.84rem",
            lineHeight: 1.75,
            background: "transparent",
            borderRadius: 0,
            fontFamily: "var(--md-font-mono)",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--md-font-mono) !important", // ← 作用于 <code>
            },
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: theme === "dark" ? "#444" : "#ccc",
            fontSize: "0.72rem",
            userSelect: "none",
            fontFamily: "var(--md-font-mono)",
          }}
        >
          {children.trimEnd()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ---------- 小图标 ---------- */
function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
