import { GetAllCardsDocument, SiteLocale } from "@src/gql_types";
import { initializeApollo } from "@src/infra/apolloClient";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";
import { GetStaticProps } from "next";
import { slugify } from "@src/infra/slugify";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const apolloClient = initializeApollo();
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;
  const [username, repo, branch, path] = ctx.params.external as string[];
  const URL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path.replace(
    "__",
    "."
  )}`;

  if (URL.includes("undefined")) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await fetch(URL).then((res) => res.json());
    const { data } = await apolloClient.query({
      query: GetAllCardsDocument,
      variables: {
        locale,
        input: {
          limit: 10 * 1000,
        },
      },
    });

    const cardsById = data.cards.reduce((acc, card) => {
      return {
        ...acc,
        [card.id]: card,
      };
    }, {});

    const guide = Object.entries(response).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        return {
          ...acc,
          [key]: value.map((item) => {
            return {
              ...item,
              cards: item.cards
                .map((card) => {
                  if (card.id) {
                    const cardInfo = cardsById[card.id];

                    if (!cardInfo) {
                      return null;
                    }

                    return {
                      item: {
                        slug: slugify(card.id),
                        id: card.id,
                        ...cardInfo,
                      },
                    };
                  }

                  const keyObjectives =
                    card.keyObjectives || card["key-objectives"] || [];

                  return {
                    item: {
                      slug: slugify(card.name),
                      id: card.name,
                      ...card,
                      keyObjectives: keyObjectives.map((keyObjective) => ({
                        id: slugify(keyObjective),
                        name: keyObjective,
                      })),
                    },
                  };
                })
                .filter(Boolean),
            };
          }),
        };
      }

      return {
        ...acc,
        [key]: value,
      };
    }, {});

    return withLocaleContent(
      {
        props: {
          ...data,
          guide,
          locale,
        },
        revalidate: 60 * 60 * 24,
      },
      locale
    );
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export { default } from "@src/screens/PathScreen";
