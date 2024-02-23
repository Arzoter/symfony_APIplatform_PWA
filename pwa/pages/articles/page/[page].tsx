import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getArticles,
  getArticlesPath,
} from "../../../components/article/PageList";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getArticlesPath(page), getArticles(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Article>>("/articles");
  const paths = await getCollectionPaths(
    response,
    "articles",
    "/articles/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
