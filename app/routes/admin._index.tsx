import { Link, useLoaderData } from "react-router";
import type { Article } from "~/lib/types/articles";
import { getArticles } from "~/lib/utils/data";
import { timeTransformer } from "~/lib/utils/timeTransformer";

export async function loader() {
  const articles = await getArticles();
  return { articles };
}

export default function AdminIndex() {
  const { articles } = useLoaderData<{ articles: Article[] }>();

  return (
    <ul className="flex flex-col gap-2">
      {articles.map((article) => (
        <li key={article.id}>
          <Link
            to={`/admin/${article.id}`}
            className="block shadow-black/20 dark:shadow-white/50 py-1 px-2 rounded hover:bg-white/20 hover:shadow"
          >
            <div className="flex items-center gap-2 justify-between">
              <div className="truncate font-bold" title={article.title}>
                {article.title}
              </div>
              <div className="text-end text-gray-500 text-xs shrink-0">
                {article.updatedAt ? (
                  <span>POST: {timeTransformer(article.updatedAt)}</span>
                ) : (
                  <span>PUT: {timeTransformer(article.createdAt)}</span>
                )}
              </div>
            </div>
            <div className="truncate" title={article.description}>
              {article.description}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}