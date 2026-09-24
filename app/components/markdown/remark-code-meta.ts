// remark-code-meta.ts
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

export default function remarkCodeMeta() {
  return (tree: Root) => {
    visit(tree, 'code', (node) => {
      if (node.meta) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        // 把 meta 透传下去
        node.data.hProperties.meta = node.meta;
      }
    });
  };
}