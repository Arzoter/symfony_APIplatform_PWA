import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/article/Show";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getArticle = async (id: string | string[] | undefined) =>
  id ? await fetch<Article>(`/articles/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: article, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Article> | undefined>(["article", id], () =>
      getArticle(id)
    );
  const articleData = useMercure(article, hubURL);

  if (!articleData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Article ${articleData["@id"]}`}</title>
        </Head>
      </div>
      <Show article={articleData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["article", id], () => getArticle(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Article>>("/articles");
  const paths = await getItemPaths(response, "articles", "/articles/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
