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

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;
  const data = {};
  const [username, repo, branch, path] = ctx.params.external as string[];
  const URL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path}?aaa`;

  if (URL.includes("undefined")) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await fetch(URL).then((res) => res.json());

    return withLocaleContent(
      {
        props: {
          ...data,
          guide: response,
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
