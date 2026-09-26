import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useTheme } from "~/lib/store/theme";
import remarkCodeMeta from "./remark-code-meta";

import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

export type ThemeMode = "light" | "dark";

interface MarkdownViewerProps {
  content: string;
  theme?: ThemeMode;
  filename?: string; // 代码块默认文件名
  className?: string;
  style?: React.CSSProperties;
}

const HEADING_COMMON =
  "text-(--md-heading) font-bold leading-[1.3] mt-[2.4em] mb-[0.6em] scroll-mt-[calc(var(--header-height)+16px)]";

const HEADING_CLASSES: Record<number, string> = {
  1: `${HEADING_COMMON} text-[2rem] tracking-[-0.02em] border-b-2 border-(--md-border) pb-[0.3em]`,
  2: `${HEADING_COMMON} text-[1.55rem] tracking-[-0.01em]`,
  3: `${HEADING_COMMON} text-[1.25rem]`,
  4: `${HEADING_COMMON} text-[1.1rem]`,
  5: `${HEADING_COMMON} text-[0.95rem] uppercase tracking-[0.06em]`,
  6: `${HEADING_COMMON} text-[0.9rem] text-(--md-text-muted)`,
};

function headingComponent(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as React.ElementType;
  return function Heading(props: React.ComponentProps<typeof Tag>) {
    const { node: _node, className, children, ...rest } = props;
    return (
      <Tag className={`${HEADING_CLASSES[level]} ${className ?? ""}`} {...rest}>
        {children}
      </Tag>
    );
  };
}

export default function MarkdownViewer({
  content,
  className = "",
  style,
}: MarkdownViewerProps) {
  const { currentTheme: theme } = useTheme();

  return (
    <div
      className={`md-body max-w-(--md-max-width) py-8 pb-16 text-[1.25rem] leading-[1.8] text-(--md-text) antialiased *:first:mt-0.5 ${className}`}
      style={style}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCodeMeta]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: headingComponent(1),
          h2: headingComponent(2),
          h3: headingComponent(3),
          h4: headingComponent(4),
          h5: headingComponent(5),
          h6: headingComponent(6),

          /* ---------- 段落 & 文本 ---------- */
          p({ node, children, ...props }) {
            return (
              <p className="mb-[1.25em] indent-[2em]" {...props}>
                {children}
              </p>
            );
          },

          strong({ node, children, ...props }) {
            return (
              <strong className="font-bold text-(--md-heading)" {...props}>
                {children}
              </strong>
            );
          },

          em({ node, children, ...props }) {
            return <em className="italic" {...props}>{children}</em>;
          },

          del({ node, children, ...props }) {
            return (
              <del className="text-(--md-text-muted) line-through" {...props}>
                {children}
              </del>
            );
          },

          /* ---------- 链接 ---------- */
          a({ node, href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--md-link) no-underline [border-bottom:1px_solid_transparent] hover:border-b-(--md-accent-hover) hover:text-(--md-accent-hover)"
                {...props}
              >
                {children}
              </a>
            );
          },

          /* ---------- 行内代码 ---------- */
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
              <code
                className="font-(family-name:--md-font-mono) text-[0.84em] px-[0.45em] py-[0.15em] rounded bg-(--md-inline-code-bg) text-(--md-inline-code-text) wrap-break-word"
                {...props}
              >
                {children}
              </code>
            );
          },

          /* ---------- 去掉外层 <pre>（CodeBlock 自带） ---------- */
          pre({ children }) {
            return <>{children}</>;
          },

          /* ---------- 引用块 ---------- */
          blockquote({ node, children, ...props }) {
            return (
              <blockquote
                className="my-[1.5em] px-[1.2em] py-[0.8em] border-l-4 border-(--md-blockquote-border) bg-(--md-blockquote-bg) rounded-r-lg text-(--md-text) [&>p:last-child]:mb-0 [&>blockquote]:my-[0.8em]"
                {...props}
              >
                {children}
              </blockquote>
            );
          },

          /* ---------- 列表 ---------- */
          ul({ node, className, children, ...props }) {
            return (
              <ul
                className={`list-disc pl-[1.6em] mb-[1.25em] marker:text-(--md-text-muted) marker:text-[0.95em] marker:font-sans ${className ?? ""}`}
                {...props}
              >
                {children}
              </ul>
            );
          },

          ol({ node, className, children, ...props }) {
            return (
              <ol
                className={`list-decimal pl-[2.2em] mb-[1.25em] marker:text-(--md-accent) marker:text-[0.9em] marker:font-sans ${className ?? ""}`}
                {...props}
              >
                {children}
              </ol>
            );
          },

          li({ node, className, children, ...props }) {
            /* GFM 任务列表会注入 task-list-item，需去掉项目符号 */
            const isTask = String(className).includes("task-list-item");
            return (
              <li
                className={`${className ?? ""} ${isTask ? "list-none" : "marker:text-[0.95em]"} mb-[0.35em] [&>ul]:mt-[0.35em] [&>ol]:mt-[0.35em] [&>ul]:mb-0 [&>ol]:mb-0`}
                {...props}
              >
                {children}
              </li>
            );
          },

          /* ---------- GFM 任务列表 ---------- */
          input({ node, type, ...props }) {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  className="mr-[0.45em] accent-(--md-accent) scale-110"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          /* ---------- 分割线 ---------- */
          hr() {
            return <hr className="border-none h-px bg-(--md-hr) my-[2.5em]" />;
          },

          /* ---------- 图片 ---------- */
          img({ src, alt }) {
            return (
              <figure className="my-[1.8em] text-center">
                <img
                  src={src}
                  className="max-w-full h-auto w-62.5 md:w-3/4 rounded object-contain shadow-[0_4px_20px_var(--md-img-shadow)]"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="mt-[0.6em] text-[0.82rem] text-(--md-text-muted) italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },

          /* ---------- 表格 ---------- */
          table({ node, children, ...props }) {
            return (
              <div className="overflow-x-auto my-[1.5em] rounded-lg border border-(--md-border)">
                <table
                  className="w-full border-collapse text-[0.9rem]"
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },

          th({ node, children, ...props }) {
            return (
              <th
                className="bg-(--md-table-header-bg) font-semibold text-left whitespace-nowrap text-(--md-heading) px-4 py-[0.7em] border-b border-(--md-border)"
                {...props}
              >
                {children}
              </th>
            );
          },

          td({ node, children, ...props }) {
            return (
              <td
                className="px-4 py-[0.7em] border-b border-(--md-border)"
                {...props}
              >
                {children}
              </td>
            );
          },

          tr({ node, children, ...props }) {
            return (
              <tr
                className="even:bg-(--md-table-stripe) last:[&>td]:border-b-0"
                {...props}
              >
                {children}
              </tr>
            );
          },

          /* ---------- 脚注引用 ---------- */
          sup({ node, children, ...props }) {
            return (
              <sup className="[&>a]:font-semibold [&>a]:text-[0.75em]" {...props}>
                {children}
              </sup>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}