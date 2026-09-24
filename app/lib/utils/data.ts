import { readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import Yaml from "yaml";
import type { Article, FullArticle } from "../types/articles";

const readYaml = () => {
  const yamlPath = join(process.cwd(), "data", "archiving.yaml");
  return readFile(yamlPath, "utf8");
};

const updateYaml = (yaml: string) => {
  const yamlPath = join(process.cwd(), "data", "archiving.yaml");
  return writeFile(yamlPath, yaml, "utf8");
};

const readMd = (mdId: string) => {
  const mdPath = join(process.cwd(), "data", "markdown", `${mdId}.md`);
  return readFile(mdPath, "utf8");
};

const updateMd = (mdId: string, md: string) => {
  const mdPath = join(process.cwd(), "data", "markdown", `${mdId}.md`);
  return writeFile(mdPath, md, "utf8");
};

const deleteMd = (mdId: string) => {
  const mdPath = join(process.cwd(), "data", "markdown", `${mdId}.md`);
  return unlink(mdPath);
};

let articles: Article[];
let cache: Record<string, number> = {};

export const getArticles = async () => {
  try {
    if (!articles) {
      const yaml = await readYaml();
      articles = Yaml.parse(yaml);
    }

    articles.forEach(({ id }, index) => {
      cache[id] = index;
    });

    return articles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

getArticles();

export const getArticle = async (mdId: string): Promise<FullArticle | null> => {
  try {
    const md = await readMd(mdId);
    return {
      ...articles[cache[mdId]],
      content: md,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateArticle = async (mdId: string, article: FullArticle) => {
  try {
    const index = cache[mdId];
    if (index === undefined) {
      throw new Error("Article not found");
    }

    const oldArticle = articles[index];

    const { title, content, description } = article;

    articles[index] = {
      ...oldArticle,
      title,
      description,
      updatedAt: Date.now(),
    };

    await updateYaml(Yaml.stringify(articles));
    await updateMd(mdId, content);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createArticle = async (article: FullArticle) => {
  try {
    const newId = (Number(articles[0]?.id || "0") + 1).toString(36);
    articles.unshift({
      id: newId,
      title: article.title,
      description: article.description,
      createdAt: Date.now(),
      updatedAt: null,
    });

    cache = {};
    articles.forEach(({ id }, index) => {
      cache[id] = index;
    });

    await updateYaml(Yaml.stringify(articles));
    await updateMd(newId, article.content);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteArticle = async (mdId: string) => {
  try {
    const index = cache[mdId];
    if (index === undefined) {
      throw new Error("Article not found");
    }

    articles.splice(index, 1);

    cache = {};
    articles.forEach(({ id }, index) => {
      cache[id] = index;
    });

    await updateYaml(Yaml.stringify(articles));
    await deleteMd(mdId);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
