"use client";

import { type Article } from "~/lib/types/articles";
import { timeTransformer } from "~/lib/utils/timeTransformer";

import { NavLink } from "react-router";

export const AtricleList = function ({
  showDescription = true,
  articles,
}: {
  showDescription?: boolean;
  articles: Article[];
}) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {articles.length > 0 ? (
        articles.map((article) => {
          return (
            <NavLink
              key={article.id}
              to={`/articles/${article.id}`}
              className={({ isActive }) =>
                "shadow-black/20 dark:shadow-white/50 py-1 px-2 transition-shadow rounded cursor-pointer " +
                (isActive ? "bg-white/20 shadow" : "hover:bg-white/20 hover:shadow")
              }
            >
              <div className="flex items-center gap-2 justify-between">
                <div className="truncate font-bold" title={article.title}>
                  {article.title}
                </div>
              </div>
              {showDescription && (
                <div className="truncate" title={article.description}>
                  {article.description}
                </div>
              )}

              <div className="text-end text-gray-500 text-xs">
                {article.updatedAt ? (
                  <span>POST: {timeTransformer(article.updatedAt)}</span>
                ) : (
                  <span>PUT: {timeTransformer(article.createdAt)}</span>
                )}
              </div>
            </NavLink>
          );
        })
      ) : (
        <div className="m-auto mt-10">暂无文章</div>
      )}
    </div>
  );
}
