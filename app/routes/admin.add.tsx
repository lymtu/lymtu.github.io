import { redirect, useActionData } from "react-router";
import { EditForm } from "~/components/editForm";
import type { FullArticle } from "~/lib/types/articles";
import { createArticle } from "~/lib/utils/data";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const article: FullArticle = {
    id: "",
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    createdAt: 0,
    updatedAt: null,
    content: String(formData.get("content") ?? "").trim(),
  };

  if (!article.title || !article.content) {
    return { error: "标题和内容不能为空" };
  }

  const ok = await createArticle(article);
  if (!ok) {
    return { error: "创建失败" };
  }

  return redirect("/admin");
}

export default function AdminAdd() {
  const actionData = useActionData<{ error?: string }>();
  return <EditForm error={actionData?.error} />;
}
