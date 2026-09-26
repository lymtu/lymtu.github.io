import type { Config } from "@react-router/dev/config";
import { getArticles } from "./app/lib/utils/data";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: process.env.NODE_ENV === "production" ? false : true,
  prerender: () => {
    const articles = getArticles();

    return [
      "/",
      "/about",
      "/articles",
      ...articles.map((article) => `/articles/${article.title}`),
    ];
  },
} satisfies Config;
