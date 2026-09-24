"use client";

import { useEffect, useRef } from "react";

const GISCUS = {
  "data-repo": "lymtu/ai-blog-ssg",
  "data-repo-id": "R_kgDOTE6Mdw",
  "data-category": "Announcements",
  "data-category-id": "DIC_kwDOTE6Md84C_3dM",
  "data-mapping": "pathname",
  "data-strict": "0",
  "data-reactions-enabled": "1",
  "data-emit-metadata": "0",
  "data-input-position": "top",
  "data-lang": "zh-CN",
};

const giscusTheme = () =>
  document.documentElement.classList.contains("dark")
    ? "transparent_dark"
    : "light";

export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    for (const [key, value] of Object.entries(GISCUS)) {
      script.setAttribute(key, value);
    }
    script.dataset.theme = giscusTheme();
    container.append(script);

    const sync = () => {
      script.dataset.theme = giscusTheme();
      const iframe = container.querySelector<HTMLIFrameElement>(
        "iframe.giscus-frame",
      );
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: script.dataset.theme } } },
        "https://giscus.app",
      );
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", sync);
      script.remove();
      container.replaceChildren();
    };
  }, []);

  return (
    <section className="mt-10 pt-8 pb-20 border-t border-black/10 dark:border-white/20">
      <h2 className="mb-5 font-semibold">评论</h2>
      <div className="giscus" ref={containerRef} />
    </section>
  );
}