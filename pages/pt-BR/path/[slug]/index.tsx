import {
  HomeGetAllGuidesDocument,
  PathScreenGetGuideBySlugDocument,
  SiteLocale,
} from "@src/gql_types";
import { initializeApollo } from "@src/infra/apolloClient";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";
import { GetStaticPaths } from "next";

export { default } from "@src/screens/PathScreen";

export const getStaticProps = async ({ params, ...ctx }: any) => {
  const apolloClient = initializeApollo();
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;

  const { data } = await apolloClient.query({
    query: PathScreenGetGuideBySlugDocument,
    variables: {
      input: {
        slug: params.slug as string,
      },
      locale,
    },
  });

  return withLocaleContent(
    {
      props: {
        ...data,
        pageTitle: data?.guide?.name,
        locale,
      },
    },
    locale
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const locale = ((ctx as any).locale || SiteLocale.PtBr) as SiteLocale;
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: HomeGetAllGuidesDocument,
    variables: {
      locale,
      input: {
        limit: 100,
      },
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
