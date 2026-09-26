import { GithubSvg, MailSvg } from "~/components/svg";

const skillTags = [
  "React",
  "Next.js",
  "TypeScript",
  "Vite",
  "Vue",
  "Electron",
  "Node.js",
  "Bun / Elysia",
  "MongoDB",
  "WebSocket",
  "Tailwind CSS",
  "Docker",
];

export function meta() {
  return [
    { title: "关于" },
    { name: "description", content: "关于 Lymtu 与这个博客。" },
  ];
}

export default function AboutPage() {
  return (
    <div className="mt-(--header-height) mx-auto w-full md:w-lg lg:w-2xl p-4">
      <section className="py-10">
        <h1 className="text-3xl font-bold">你好，我是 Lymtu</h1>
        <p className="mt-2 text-gray-600 dark:text-white">
          前端开发工程师，主技术栈是 React / Next.js。灵活就业中...
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {skillTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="py-8 border-t border-gray-500/20">
        <h2 className="text-2xl font-bold">这个博客</h2>
        <p className="mt-4 leading-relaxed">
          基于 React Router v8 Framework Mode 构建，使用 TypeScript、react-markdown、
          Tailwind CSS等。
        </p>
        <ul className="mt-4 list-disc pl-5 leading-relaxed">
          <li>作者/维护：Lymtu</li>
          <li>
            贡献：big-pickle
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>Markdown 目录（TOC）</li>
              <li>代码块样式 Tailwind 迁移</li>
              <li>粒子头像图片数据迁移（生成 particlesData）</li>
              <li>后台管理增删改（参考 v7/ 移植）</li>
              <li>后台管理数据安全（前后端校验、ENOENT 容错、数据格式统一）</li>
            </ul>
          </li>
          <li>
            贡献：mimo
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>编写 Markdown 排版样式</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="py-8 border-t border-gray-500/20">
        <h2 className="text-2xl font-bold">联系方式</h2>
        <div className="mt-4 flex items-center gap-6">
          <a
            href="https://github.com/lymtu"
            target="_blank"
            aria-label="GitHub"
          >
            <GithubSvg />
          </a>
          <a href="mailto:lymtu2611@outlook.com" aria-label="发送邮件">
            <MailSvg />
          </a>
        </div>
      </section>
    </div>
  );
}
