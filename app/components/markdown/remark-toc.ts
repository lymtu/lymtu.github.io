// remark-toc.ts
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import type { Root, Heading, PhrasingContent } from "mdast";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

function toText(node: PhrasingContent): string {
  if ("value" in node) return node.value;
  const children = (node as { children?: PhrasingContent[] }).children;
  return children ? children.map(toText).join("") : "";
}

declare module "mdast" {
  interface RootData {
    toc?: TocItem[];
  }
}

export default function remarkToc() {
  return (tree: Root) => {
    const slugger = new GithubSlugger();
    const toc: TocItem[] = [];

    visit(tree, "heading", (node: Heading) => {
      if (node.depth < 2 || node.depth > 4) return;
      const text = node.children.map(toText).join("");
      if (!text.trim()) return;
      toc.push({ id: slugger.slug(text), text, depth: node.depth });
    });

    tree.data = { ...tree.data, toc };
  };
}