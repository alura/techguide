import { getStaticProps as getStaticPropsBase } from "./index";
import { initializeApollo } from "@src/infra/apolloClient";
import { AllPathsForActiveBlockDocument, SiteLocale } from "@src/gql_types";

export { default } from "./index";

export const getStaticProps = async (ctx) => {
  const staticProps = await getStaticPropsBase(ctx);
  const blocks = [
    ...staticProps.props.guide.collaborations[0].blocks,
    ...staticProps.props.guide.collaborations[1].blocks,
    ...staticProps.props.guide.expertises[0].blocks,
    ...staticProps.props.guide.expertises[1].blocks,
    ...staticProps.props.guide.expertises[2].blocks,
  ];
  const block = blocks.find((block) => {
    if (block?.item?.slug === ctx.params.activeBlockSlug) return true;
    return false;
  });

  const title = block?.item?.name || "Error";
  const categoryTitle = staticProps.props.guide.name;
  return {
    ...staticProps,
    props: {
      ...staticProps.props,
      pageTitle: `${title} | ${categoryTitle}`,
      modalInitialData: {
        categoryTitle,
        title,
        keyObjectives: block?.item?.keyObjectives || [],
        aluraContents: block?.item?.aluraContents || [],
        contents: block?.item?.contents || [],
      },
    },
  };
};

export async function getStaticPaths(ctx) {
  const locale = ((ctx as any).locale || SiteLocale.PtBr) as SiteLocale;

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: AllPathsForActiveBlockDocument,
    variables: {
      locale,
    },
  });

  const paths = data.guides.reduce((acc, guide) => {
    const blocks = [
      ...guide.collaborations[0].blocks,
      ...guide.collaborations[1].blocks,
      ...guide.expertises[0].blocks,
      ...guide.expertises[1].blocks,
      ...guide.expertises[2].blocks,
    ]
      .map((block) => block?.item?.slug)
      .filter(Boolean);

    const allPaths = blocks.map((blockSlug) => {
      return {
        params: {
          slug: guide.slug,
          activeBlockSlug: blockSlug,
        },
      };
    });

    return [...acc, ...allPaths];
  }, []);

  return {
    paths: paths,
    fallback: "blocking",
  };
}
