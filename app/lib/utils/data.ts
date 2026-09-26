import fs from "fs/promises";
import path from "node:path";

import Yaml from "yaml";

import type { Article } from "../types/articles";
import { timeTransformer } from "./timeTransformer";

const MD_DIR_PATH = path.join(process.cwd(), "data", "markdown");

const cache: Record<string, number> = {};

const filesInfo = (await fs
  .readdir(MD_DIR_PATH)
  .then((files) => files.filter((fileName) => fileName.endsWith(".md")))
  .then((files) =>
    Promise.all(
      files.map(async (fileName, index) => {
        const filePath = path.join(MD_DIR_PATH, fileName);
        const [meta, content] = (await fs.readFile(filePath, "utf-8")).split(
          "=== meta ===",
        );
        const metaInfo = Yaml.parse(meta) as Partial<{
          title: string;
          description: string;
          createdAt: string;
          updatedAt: string;
        }>;
        if (!metaInfo) {
          throw new Error(`metaInfo is not defined in ${fileName}`);
        }

        const title = metaInfo?.title || fileName;

        const createdAt = Number(metaInfo?.createdAt);
        const updatedAt = Number(metaInfo?.updatedAt) || null;

        return {
          title,
          description: metaInfo?.description || "",
          createdAt,
          updatedAt: updatedAt ? timeTransformer(updatedAt) : null,
          content,
        };
      }),
    ),
  )
  .then((articles) =>
    articles
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((article, index) => {
        cache[article.title] = index;
        return {
          ...article,
          createdAt: timeTransformer(article.createdAt),
        };
      }),
  )) as Article[];

export const getArticles = () => {
  return filesInfo;
};

export const getArticle = (mdId: string) => {
  const index = cache[mdId];
  if (index === undefined) {
    return null;
  }
  return filesInfo[index];
};
