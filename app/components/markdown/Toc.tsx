import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuFoldLeftSvg, RightSvg } from "~/components/svg";
import { extractToc } from "~/lib/utils/toc";

interface MarkdownTocProps {
  content: string;
}

export function MarkdownToc({ content }: MarkdownTocProps) {
  const toc = useMemo(() => extractToc(content), [content]);
  const [show, setShow] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>("");

  const minDepth = useMemo(() => {
    if (toc.length === 0) return 2;
    return Math.min(...toc.map((item) => item.depth));
  }, [toc]);

  /* ---------- 滚动高亮当前标题 ---------- */
  useEffect(() => {
    const headingIds = toc.map((item) => item.id).filter(Boolean);
    if (headingIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [toc]);

  /* ---------- 按屏幕宽度控制显隐（与 ListAside 一致，阈值 xl） ---------- */
  useEffect(() => {
    if (window.innerWidth > 1280) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const resizeHandler = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        if (window.innerWidth > 1280) {
          setShow(true);
        } else {
          setShow(false);
        }
      }, 250);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (window.innerWidth <= 1280) {
        setShow(false);
      }
    },
    [],
  );

  if (toc.length === 0) return null;

  return (
    <>
      {show ? (
        <div className="fixed z-10 xl:flex xl:sticky xl:flex w-[300px] xl:w-[320px] 2xl:w-[400px] h-[calc(100vh-var(--header-height)-10px)] bg-white/50 dark:bg-black/30 backdrop-blur-lg xl:bg-transparent xl:backdrop-blur-none overflow-hidden flex-col top-[calc(5px+var(--header-height))] right-0 transition-[top] duration-300">
          <div className="shrink-0 basis-8 mt-2 flex items-center justify-between py-1 h-8 mx-4 border-b border-black/10 dark:border-white/20">
            <h3 className="font-bold text-xl">目录</h3>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="cursor-pointer xl:hidden"
            >
              <RightSvg />
            </button>
          </div>
          <div className="flex-1 min-h-0 h-[calc(100%-32px)] overflow-y-auto pb-10">
            <div className="p-2 flex flex-col gap-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  style={{ paddingLeft: 8 + (item.depth - minDepth) * 16 }}
                  className={
                    "truncate shadow-black/20 dark:shadow-white/50 py-1 px-2 rounded cursor-pointer text-[0.85rem] " +
                    (item.id === activeId
                      ? "bg-white/20 shadow font-bold text-(--md-accent)"
                      : "hover:bg-white/20 hover:shadow hover:text-(--md-accent)")
                  }
                  title={item.text}
                >
                 h{item.depth} · {item.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="xl:hidden cursor-pointer fixed right-4 top-[calc(10px+var(--header-height))]"
          onClick={() => setShow(true)}
        >
          <MenuFoldLeftSvg />
        </button>
      )}
    </>
  );
}
