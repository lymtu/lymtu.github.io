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

/* ---------- 语言标识：首字母大写 ---------- */
function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

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
  const label = LANG_LABELS[langKey] || toTitleCase(language) || "Text";
  const dotColor = LANG_COLORS[langKey] || (theme === "dark" ? "#888" : "#aaa");
  const syntaxTheme = theme === "dark" ? oneDark : oneLight;
  const lineCount = children.trim().split("\n").length;

  return (
    <div className="my-[1.5em] rounded-lg overflow-hidden border border-(--md-border)">
      {/* ---- 眉头 ---- */}
      <div className="flex items-center justify-between px-4 py-[0.55em] bg-(--md-code-header-bg) border-b border-(--md-border)">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="size-2 rounded-full shrink-0 shadow-[0_0_0_2px_var(--md-code-header-bg)]"
            style={{ background: dotColor }}
          />
          {filename ? (
            <span className="font-(family-name:--md-font-mono) text-[0.72rem] text-(--md-text-muted) truncate">
              {filename}
            </span>
          ) : (
            <span className="font-(family-name:--md-font-mono) text-xs tracking-wider text-(--md-code-header-text)">
              {label}
            </span>
          )}
        </div>
        <button
          className={
            "flex items-center gap-[0.35em] px-[0.65em] py-[0.3em] border rounded-[5px] bg-transparent font-(family-name:--md-font-mono) text-[0.7rem] cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 " +
            (copied
              ? "text-green-500 border-green-500"
              : "border-(--md-border) text-(--md-code-header-text) hover:bg-(--md-code-copy-hover) hover:text-(--md-text) hover:border-(--md-text-muted)")
          }
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
      <div className="bg-(--md-code-body-bg) overflow-x-auto">
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
              fontFamily: "var(--md-font-mono)",
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
