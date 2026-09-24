import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkToc, { type TocItem } from "~/components/markdown/remark-toc";

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkToc);

export function extractToc(content: string): TocItem[] {
  const tree = processor.parse(content);
  processor.runSync(tree);
  return (tree.data?.toc as TocItem[]) ?? [];
}

export { type TocItem };