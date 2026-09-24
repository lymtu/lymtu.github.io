// remark-frontmatter-card.ts
import { visit, SKIP } from "unist-util-visit";
import type { Root, YAML } from "mdast";

export default function remarkFrontmatterCard() {
  return (tree: Root) => {
    visit(tree, "yaml", (node: YAML, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const data: Record<string, string> = {};
      for (const line of node.value.split("\n")) {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
          data[key.trim()] = rest.join(":").trim();
        }
      }

      // 把 yaml 节点替换成一个自定义的 HTML 节点
      // rehype 之后会变成 <div class="md-meta-card">
      parent.children.splice(index, 1, {
        type: "html",
        value: `<div class="md-meta-card" data-title="${data.title ?? ""}" data-date="${data.date ?? ""}" data-author="${data.author ?? ""}" data-tags="${data.tags ?? ""}"></div>`,
      });

      return [SKIP, index];
    });
  };
}