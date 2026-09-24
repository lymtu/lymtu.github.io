import { Form, useNavigation } from "react-router";
import type { FullArticle } from "~/lib/types/articles";

const inputClass =
  "w-full p-2 rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/10";

function FieldInput({
  label,
  name,
  defaultValue,
  disabled,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  disabled: boolean;
  required?: boolean;
}) {
  return (
    <label className="block my-3">
      <span className="block mb-1 font-medium">{label}</span>
      <input
        disabled={disabled}
        className={inputClass}
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </label>
  );
}

export function EditForm({
  article,
  error,
}: {
  article?: FullArticle;
  error?: string;
}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {article ? "编辑文章" : "创建文章"}
      </h2>

      <FieldInput
        label="标题"
        name="title"
        defaultValue={article?.title}
        disabled={isSubmitting}
        required
      />
      <FieldInput
        label="简介"
        name="description"
        defaultValue={article?.description}
        disabled={isSubmitting}
      />

      <label className="block my-3">
        <span className="block mb-1 font-medium">内容</span>
        <textarea
          disabled={isSubmitting}
          required
          className={`${inputClass} resize-y min-h-80`}
          name="content"
          defaultValue={article?.content}
        ></textarea>
      </label>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center gap-5 mt-3">
        {article && (
          <button
            type="submit"
            name="_action"
            value="delete"
            disabled={isSubmitting}
            className="w-full bg-red-500 text-white rounded-xl cursor-pointer py-2 px-2"
            onClick={(e) => {
              if (!window.confirm("确定删除吗？")) {
                e.preventDefault();
              }
            }}
          >
            删除
          </button>
        )}
        <button
          type="submit"
          name="_action"
          value={article ? "update" : "create"}
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white rounded-xl cursor-pointer py-2 px-2"
        >
          提交
        </button>
      </div>
    </Form>
  );
}