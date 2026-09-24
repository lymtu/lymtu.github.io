import { Outlet, useLocation } from "react-router";
import { LeftSvg, MenuFoldRightSvg } from "~/components/svg";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AtricleList } from "~/components/articleList";
import type { Article } from "~/lib/types/articles";
import { getArticles } from "~/lib/utils/data";
import type { Route } from "./+types/articles";
import { timeTransformer } from "~/lib/utils/timeTransformer";

const STORAGE_KEY = "search";

export async function loader() {
  const articleList = await getArticles();
  return {
    articleList,
  };
}

export default function ArticlesLayout({ loaderData }: Route.ComponentProps) {
  const { articleList } = loaderData;

  return (
    <section className="flex justify-between pt-(--header-height) min-h-[85vh]">
      <ListAside articles={articleList} />
      <Outlet />
    </section>
  );
}

export function ListAside({ articles }: { articles: Article[] }) {
  const [showAside, setShowAside] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const initRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { pathname } = useLocation();

  const isChildPage = pathname.includes("/articles/");

  const deferredQuery = useDeferredValue(search);
  const isPending = search !== deferredQuery;
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const queryHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setSearch(e.target.value.trim().toLowerCase());
    }, 500);
  }, []);

  useEffect(() => {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    if (value) setSearch(value);
    initRef.current = true;

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!initRef.current) return;
    if (search) {
      sessionStorage.setItem(STORAGE_KEY, search);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [search]);

  const renderMap = useMemo(() => {
    let baseArr = articles;

    if (search) {
      baseArr = baseArr.filter((article) =>
        article.title.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    const cache = {} as Record<string, Article[]>;
    for (const article of baseArr) {
      const yaer = timeTransformer(article.createdAt, "yyyy");
      const itemCache = cache[yaer] ? cache[yaer] : [];
      itemCache.push(article);
      cache[yaer] = itemCache;
    }
    return cache;
  }, [articles, search]);

  const showAsideHandler = useCallback(() => {
    setShowAside(true);
  }, []);

  const hideAsideHandler = useCallback(() => {
    setShowAside(false);
  }, []);

  useEffect(() => {
    if (!isChildPage) {
      setShowAside(true);
    } else {
      if (window.innerWidth > 768) {
        setShowAside(true);
      } else {
        setShowAside(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!isChildPage) return;
    let timeout: NodeJS.Timeout | null = null;
    const resizeHandler = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        if (window.innerWidth > 768) {
          setShowAside(true);
        } else {
          setShowAside(false);
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
  }, [isChildPage]);

  return (
    <>
      {showAside ? (
        <div
          style={{ viewTransitionName: "sidebar" }}
          className={
            isChildPage
              ? (showAside ? "fixed z-10 md:flex md:sticky" : "hidden") +
                " md:flex w-[300px] xl:w-[320px] 2xl:w-[400px] h-[calc(100vh-var(--header-height)-10px)] bg-white/50 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none overflow-hidden flex-col top-[calc(5px+var(--header-height))] left-0 transition-[top] duration-300"
              : "w-5/6 mx-auto md:w-lg lg:w-2xl"
          }
        >
          <div
            className={
              "shrink-0 basis-8 mt-2 flex items-center justify-between py-1 " +
              (isChildPage
                ? "h-8 mx-4 border-b border-black/10 dark:border-white/20"
                : "")
            }
          >
            <h3
              className={"font-bold " + (isChildPage ? "text-xl" : "text-2xl")}
            >
              归档
            </h3>
            <button
              type="button"
              hidden={!isChildPage}
              onClick={hideAsideHandler}
              className="cursor-pointer md:hidden"
            >
              <LeftSvg />
            </button>
          </div>
          {!isChildPage && (
            <div className="flex justify-end">
              <form action="" method="post" className="flex items-center gap-2">
                <input
                  type="text"
                  name="title"
                  className={
                    "w-75 p-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/10 " +
                    (isChildPage ? "my-1" : "my-4")
                  }
                  placeholder="查询标题..."
                  onChange={queryHandler}
                  ref={inputRef}
                />
                <button
                  type="reset"
                  className="px-3 py-1.5 cursor-pointer rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearch("");
                    inputRef.current!.value = "";
                  }}
                >
                  清除
                </button>
              </form>
            </div>
          )}
          <div
            className={
              isChildPage
                ? "flex-1 min-h-0 h-[calc(100%-32px)] overflow-y-auto pb-10"
                : ""
            }
          >
            {isPending ? (
              <div>加载中...</div>
            ) : (
              Object.keys(renderMap)
                .sort((a, b) => Number(b) - Number(a))
                .map((key) => (
                  <div key={key} className="">
                    <h4 className="font-bold text-lg mt-2 ml-2">{key}</h4>
                    <AtricleList articles={renderMap[key]} />
                  </div>
                ))
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          hidden={!isChildPage}
          className={
            "md:hidden cursor-pointer fixed left-4 top-[calc(10px+var(--header-height))] transition-[top] duration-300 " +
            (showAside ? "hidden" : "")
          }
          onClick={showAsideHandler}
        >
          <MenuFoldRightSvg />
        </button>
      )}
    </>
  );
}
