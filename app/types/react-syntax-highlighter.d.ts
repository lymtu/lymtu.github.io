declare module "react-syntax-highlighter" {
  import type { CSSProperties, ComponentType } from "react";

  interface SyntaxHighlighterProps {
    language?: string;
    style?: Record<string, CSSProperties>;
    customStyle?: CSSProperties;
    codeTagProps?: { style?: CSSProperties };
    lineNumberStyle?: CSSProperties | ((lineNumber: number) => CSSProperties);
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    startingLineNumber?: number;
    children?: string;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  import type { CSSProperties } from "react";

  export const oneDark: Record<string, CSSProperties>;
  export const oneLight: Record<string, CSSProperties>;
}