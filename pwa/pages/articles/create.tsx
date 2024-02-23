import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/article/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Article</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
