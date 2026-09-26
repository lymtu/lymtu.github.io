import { getArticle } from "~/lib/utils/data";
import type { Route } from "./+types/articles.$articleId";
import { timeTransformer } from "~/lib/utils/timeTransformer";
import MarkdownViewer from "~/components/markdown";
import { MarkdownToc } from "~/components/markdown/Toc";
import { Comments } from "~/components/comments";

export async function loader({ params }: Route.LoaderArgs) {
  const article = await getArticle(params.articleId);
  return article;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const article = loaderData;
  return [
    {
      title: article?.title ? `${article.title} - Lymtu 的个人博客` : "文章",
    },
    {
      name: "description",
      content: article?.description ?? "Lymtu 的个人博客文章。",
    },
  ];
}

export default function Product({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    throw new Response("Not Found", { status: 404 });
  }

  const { title, createdAt, updatedAt, content } = loaderData;
  return (
    <div className="flex-1 min-w-0 flex gap-8 transition-[width] duration-300">
      <div className="flex-1 min-w-0 mt-10 px-[4vw]">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center gap-4 justify-end">
          <span>PUT：{timeTransformer(createdAt)}</span>
          {updatedAt && <span>POST：{timeTransformer(updatedAt)}</span>}
        </div>

        {content && <MarkdownViewer content={content} />}
        <Comments />
      </div>
      {content && <MarkdownToc content={content} />}
    </div>
  );
}
