export type Article = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number | null;
};

export type FullArticle = Article & {
  content: string;
};
