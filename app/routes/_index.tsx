import { Link } from "react-router";
import { AtricleList } from "~/components/articleList";

import { Avatar } from "~/components/particleAvatar";
import { ArrowLeftUpSvg, GithubSvg, MailSvg } from "~/components/svg";
import { Typewriter } from "~/components/typewriter";
import type { Route } from "./+types/_index";
import { getArticles } from "~/lib/utils/data";

export async function loader() {
  const articleList = await getArticles();
  return {
    articleList: articleList.slice(0, 10),
    haveMore: articleList.length > 10,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { articleList, haveMore } = loaderData;

  return (
    <div className="mx-auto w-full md:w-lg lg:w-2xl p-4">
      <div className="h-screen py-6 grid grid-cols-1 grid-rows-[1fr_1fr_5rem] md:grid-cols-2 md:grid-rows-2 gap-x-50">
        <div className="w-fit h-20 mx-auto mt-20 md:mt-60 mb-auto">
          <Typewriter />
        </div>
        <div className="m-auto md:row-span-2">
          <Avatar />
        </div>
        <div className="m-auto flex items-center gap-4">
          <a
            href="https://github.com/lymtu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubSvg />
          </a>
          <a href="mailto:lymtu2611@outlook.com" aria-label="发送邮件">
            <MailSvg />
          </a>
        </div>
      </div>
      <div className="min-h-screen flex flex-col pt-10">
        <h3 className="text-2xl font-bold">近期文章</h3>
        <AtricleList articles={articleList} />
        {haveMore && (
          <Link
            to="/articles"
            className="self-end w-fit flex items-center hover:text-blue-500"
          >
            <span>查看更多</span>
            <ArrowLeftUpSvg className="scale-75" />
          </Link>
        )}
      </div>
    </div>
  );
}
