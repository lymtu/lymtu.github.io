import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useTheme } from "~/lib/store/theme";
import remarkCodeMeta from "./remark-code-meta";

import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

import "./style.css";

export type ThemeMode = "light" | "dark";

interface MarkdownViewerProps {
  content: string;
  theme?: ThemeMode;
  filename?: string; // 代码块默认文件名
  className?: string;
  style?: React.CSSProperties;
}

export default function MarkdownViewer({
  content,
  className = "",
  style,
}: MarkdownViewerProps) {
  const { currentTheme: theme } = useTheme();

  return (
    <div className={`md-body ${className}`} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCodeMeta]}
        rehypePlugins={[rehypeSlug]}
        components={{
          /* ---------- 代码块 / 行内代码 ---------- */
          code({ node, className, children, ...props }) {
            const codeStr = String(children).replace(/\n$/, "");
            const match = /language-(\w+)/.exec(className || "");

            if (match) {
              // ---------- 从 meta 解析文件名 ----------
              const meta: string = String(node!.properties?.meta || "");
              let blockFilename: string | undefined;

              // 匹配 filename="xxx" 或 filename='xxx' 或 filename=xxx
              const fileMatch = meta.match(/filename=["']?([^"'\s,]+)["']?/);
              if (fileMatch) {
                blockFilename = fileMatch[1];
              } else if (meta.trim() && !meta.includes("=")) {
                // 如果 meta 就是纯文件名: ```tsx App.tsx
                blockFilename = meta.trim();
              }

              return (
                <CodeBlock
                  theme={theme}
                  language={match[1]}
                  filename={blockFilename}
                >
                  {codeStr}
                </CodeBlock>
              );
            }

            return (
              <code className="md-inline-code" {...props}>
                {children}
              </code>
            );
          },

          /* ---------- 去掉外层 <pre>（CodeBlock 自带） ---------- */
          pre({ children }) {
            return <>{children}</>;
          },

          /* ---------- 链接新窗口打开 ---------- */
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },

          /* ---------- 图片 ---------- */
          img({ src, alt }) {
            return (
              <figure className="md-figure">
                <img
                  src={src}
                  className="w-62.5 md:w-3/4 rounded object-contain"
                  loading="lazy"
                />
                {alt && <figcaption>{alt}</figcaption>}
              </figure>
            );
          },

          /* ---------- 表格 ---------- */
          table({ children, ...props }) {
            return (
              <div className="md-table-wrap">
                <table {...props}>{children}</table>
              </div>
            );
          },

          div({ className, ...props }) {
            if (className === "md-meta-card") {
              const { title, date, author, tags } = props as Record<
                string,
                string
              >;
              if (!title) return null;
              return (
                <header
                  className="mb-8 pb-6 border-b"
                  style={{ borderColor: "var(--md-border)" }}
                >
                  <h1
                    className="text-3xl font-bold mb-2"
                    style={{ color: "var(--md-heading)" }}
                  >
                    {title}
                  </h1>
                  <div
                    className="flex items-center gap-4 text-sm"
                    style={{ color: "var(--md-text-muted)" }}
                  >
                    {date && <span>{date}</span>}
                    {author && <span>{author}</span>}
                    {tags && (
                      <div className="flex gap-2">
                        {tags.split(",").map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ background: "var(--md-bg-tertiary)" }}
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </header>
              );
            }
            return <div {...props}>{props.children}</div>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
