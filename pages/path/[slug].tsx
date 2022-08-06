import {
  HomeGetAllGuidesDocument,
  PathScreenGetGuideBySlugDocument,
  SiteLocale,
} from "@src/gql_types";
import { initializeApollo } from "@src/infra/apolloClient";
import { GetStaticPaths, GetStaticProps } from "next";

export { default } from "@src/screens/PathScreen";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: PathScreenGetGuideBySlugDocument,
    variables: {
      input: {
        slug: params.slug as string,
      },
    },
  });

  return {
    props: data,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: HomeGetAllGuidesDocument,
    variables: {
      locale: SiteLocale.PtBr,
    },
  });

  const paths = data.guides.map((guide) => {
    return {
      params: {
        slug: guide.slug,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};
