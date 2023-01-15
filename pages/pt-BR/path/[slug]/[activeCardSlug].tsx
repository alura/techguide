import { getStaticProps as getStaticPropsBase } from "./index";
import { initializeApollo } from "@src/infra/apolloClient";
import { AllPathsForActiveCardDocument, SiteLocale } from "@src/gql_types";

export { default } from "./index";

export const getStaticProps = async (ctx) => {
  const staticProps = await getStaticPropsBase(ctx);
  const cards = [
    ...staticProps.props.guide.collaborations[0].cards,
    ...staticProps.props.guide.collaborations[1].cards,
    ...staticProps.props.guide.expertises[0].cards,
    ...staticProps.props.guide.expertises[1].cards,
    ...staticProps.props.guide.expertises[2].cards,
  ];
  const card = cards.find((card) => {
    if (card?.item?.slug === ctx.params.activeCardSlug) return true;
    return false;
  });

  const title = card?.item?.name || "Error";
  const categoryTitle = staticProps.props.guide.name;
  return {
    ...staticProps,
    props: {
      ...staticProps.props,
      pageTitle: `${title} | ${categoryTitle}`,
      modalInitialData: {
        categoryTitle,
        title,
        keyObjectives: card?.item?.keyObjectives || [],
        aluraContents: card?.item?.aluraContents || [],
        contents: card?.item?.contents || [],
      },
    },
  };
};

export async function getStaticPaths(ctx) {
  const locale = ((ctx as any).locale || SiteLocale.PtBr) as SiteLocale;

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: AllPathsForActiveCardDocument,
    variables: {
      locale,
      input: {
        limit: 100,
      },
    },
  });

  const paths = data.guides.reduce((acc, guide) => {
    const cards = [
      ...guide.collaborations[0].cards,
      ...guide.collaborations[1].cards,
      ...guide.expertises[0].cards,
      ...guide.expertises[1].cards,
      ...guide.expertises[2].cards,
    ]
      .map((card) => card?.item?.slug)
      .filter(Boolean);

    const allPaths = cards.map((cardSlug) => {
      return {
        params: {
          slug: guide.slug,
          activeCardSlug: cardSlug,
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
