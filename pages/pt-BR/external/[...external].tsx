import { SiteLocale } from "@src/gql_types";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";
import { GetStaticProps } from "next";

export async function getStaticPaths(ctx) {
  // eslint-disable-next-line no-console
  console.log(ctx);

  return {
    paths: [],
    fallback: "blocking",
  };
}

function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD") // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-") // separator
    .replace(/-+/g, "-"); // remove repeated separator
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;
  const data = {};
  const [username, repo, branch, path] = ctx.params.external as string[];
  const URL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path.replace(
    "__",
    "."
  )}`;
  // eslint-disable-next-line no-console
  console.log(URL);
  if (URL.includes("undefined")) {
    return {
      notFound: true,
    };
  }

  const response = await fetch(URL).then((res) => res.json());

  // eslint-disable-next-line no-console
  console.log(response);

  const guide = Object.entries(response).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: value.map((item) => {
          return {
            ...item,
            blocks: item.cards
              .map((card) => {
                if (card.id) return null;
                return {
                  item: {
                    slug: slugify(card.name),
                    id: card.name,
                    ...card,
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
      revalidate: 60,
    },
    locale
  );
};

export { default } from "@src/screens/PathScreen";
