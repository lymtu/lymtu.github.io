import { redirect, useActionData, useLoaderData } from "react-router";
import { EditForm } from "~/components/editForm";
import type { FullArticle } from "~/lib/types/articles";
import { deleteArticle, getArticle, updateArticle } from "~/lib/utils/data";

export async function loader({ params }: { params: { articleId: string } }) {
  const article = await getArticle(params.articleId);
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }
  return article;
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { articleId: string };
}) {
  const articleId = params.articleId;
  const formData = await request.formData();
  const intent = formData.get("_action");

  if (intent === "delete") {
    const ok = await deleteArticle(articleId);
    if (!ok) {
      return { error: "删除失败" };
    }
    return redirect("/admin");
  }

  const article: FullArticle = {
    id: articleId,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    createdAt: 0,
    updatedAt: null,
    content: String(formData.get("content") ?? "").trim(),
  };

  if (!article.title || !article.content) {
    return { error: "标题和内容不能为空" };
  }

  const ok = await updateArticle(articleId, article);
  if (!ok) {
    return { error: "更新失败" };
  }

  return redirect("/admin");
}

export default function AdminEdit() {
  const article = useLoaderData<FullArticle>();
  const actionData = useActionData<{ error?: string }>();
  return <EditForm article={article} error={actionData?.error} />;
}
