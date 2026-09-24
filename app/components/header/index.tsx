"use client";

import { Link, useLocation } from "react-router";
import { useEffect, useMemo, useRef } from "react";
import { ThemeToggler } from "../themeToggler";

export function Header() {
  const { pathname } = useLocation();
  const headerDomRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (!headerDomRef.current) {
          return;
        }

        const scrollY = window.scrollY;

        if (scrollY <= 0) {
          headerDomRef.current.style.transform = "translateY(0)";
          document.body.style.setProperty("--header-height", "60px");
          lastScrollY.current = 0;
          return;
        }

        if (
          scrollY + window.innerHeight >=
          document.documentElement.scrollHeight
        ) {
          headerDomRef.current.style.transform = "translateY(-100%)";
          lastScrollY.current = scrollY;
          document.body.style.setProperty("--header-height", "0px");
          return;
        }

        if (scrollY > lastScrollY.current) {
          headerDomRef.current.style.transform = "translateY(-100%)";
          document.body.style.setProperty("--header-height", "0px");
        } else {
          headerDomRef.current.style.transform = "translateY(0)";
          document.body.style.setProperty("--header-height", "60px");
        }
        lastScrollY.current = scrollY;
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pathnameArr = useMemo(() => {
    if (pathname === "/") return [];
    const pathnameArr = pathname.split("/").slice(1);

    let base: string = "";

    return pathnameArr.map((pathnameItem) => {
      base = base + "/" + pathnameItem;
      return {
        path: base,
        name: pathnameItem,
      };
    });
  }, [pathname]);

  return (
    <header
      ref={headerDomRef}
      className="h-15 w-full backdrop-blur-lg flex justify-between px-6 py-4 z-10 fixed top-0 left-0 overflow-hidden border-b border-gray-500/20 transition-transform duration-300 ease-in-out"
    >
      <div className="flex items-end flex-nowrap gap-1">
        <Link to="/" className="text-xl font-bold">
          Lymtu的博客
        </Link>
        <span className="hidden md:flex gap-1">
          {pathnameArr.map((pathnameItem) => (
            <span key={pathnameItem.path} className="flex items-center gap-1">
              <span>/</span>
              <Link
                to={pathnameItem.path}
                className="hover:text-blue-500 hover:underline"
              >
                {pathnameItem.name}
              </Link>
            </span>
          ))}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggler />
        <div className="spacer">|</div>
        <nav className="flex items-center gap-4">
          {[
            { path: `/`, name: `首页` },
            { path: `/articles`, name: `归档` },
            { path: `/about`, name: `关于` },
          ].map((e) => (
            <Link
              key={e.path}
              to={e.path}
              className={
                "font-medium hover:underline " +
                (e.path === pathname ? "text-blue-500" : "")
              }
            >
              {e.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
