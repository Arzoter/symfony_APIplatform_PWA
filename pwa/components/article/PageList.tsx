import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Article } from "../../types/Article";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getArticlesPath = (page?: string | string[] | undefined) =>
  `/articles${typeof page === "string" ? `?page=${page}` : ""}`;
export const getArticles = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Article>>(getArticlesPath(page));
const getPagePath = (path: string) =>
  `/articles/page/${parsePage("articles", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: articles, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Article>> | undefined
  >(getArticlesPath(page), getArticles(page));
  const collection = useMercure(articles, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Article List</title>
        </Head>
      </div>
      <List articles={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
