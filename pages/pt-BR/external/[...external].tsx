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
  )}?aaa`;

  if (URL.includes("undefined")) {
    return {
      notFound: true,
    };
  }

  try {
    // const response = await fetch(URL).then((res) => res.json());
    const response = {
      name: "Nome do Guia",
      expertises: [
        {
          name: "Nivel 1 - Básico",
          cards: [
            {
              name: "Nome do Cartão Customizado",
              description: "Descrição do Cartão",
              link: "Link do Cartão",
              "key-objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
              contents: [
                {
                  type: "SITE",
                  title: "Node.js - Documentation",
                  link: "https://nodejs.dev/en/learn/",
                },
              ],
            },
            {
              id: "nodejs-fundamentals",
            },
          ],
        },
        {
          name: "Nivel 2 - Intermediário",
          cards: [],
        },
        {
          name: "Nivel 3 - Avançado",
          cards: [],
        },
      ],
      collaborations: [
        {
          name: "Lado Esquerdo do T",
          cards: [],
        },
        {
          name: "Lado Direito do T",
          cards: [],
        },
      ],
    };

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
