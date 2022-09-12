import {
  HomeGetAllGuidesDocument,
  PathScreenGetGuideBySlugDocument,
  SiteLocale,
} from "@src/gql_types";
import { initializeApollo } from "@src/infra/apolloClient";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";
import { GetStaticPaths } from "next";

export { default } from "@src/screens/PathScreen";

export const getStaticProps = async ({ params }: any) => {
  const apolloClient = initializeApollo();
  const locale = SiteLocale.PtBr;

  const { data } = await apolloClient.query({
    query: PathScreenGetGuideBySlugDocument,
    variables: {
      input: {
        slug: params.slug as string,
      },
    },
  });

  return withLocaleContent(
    {
      props: {
        ...data,
        pageTitle: data?.guide?.name,
      },
    },
    locale
  );
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
