import React from "react";
import { useRouter } from "next/router";
import { SiteLocale } from "@src/gql_types";
import { Box } from "@src/components";
import { useI18n } from "@src/infra/i18n";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";
import { pageHOC } from "@src/wrappers/pageHOC";

function ToScreen({ locale }: { locale: SiteLocale }) {
  const router = useRouter();
  const i18n = useI18n();

  React.useEffect(() => {
    if (router.isReady) {
      const [localePrefix, localeSufix] = locale.split("_");
      const urlLocale = `${localePrefix.toLowerCase()}${
        localeSufix ? `-${localeSufix}` : localeSufix
      }`.replace("undefined", "");

      const url = (router.query.url as string) || "";

      if (!url.includes("https://github.com/")) {
        globalThis.alert(
          `You must provide a github URL like /my?url=https://github.com/omariosouto/omariosouto/blob/main/techguide-v1.json`
        );
        router.push("/");
        return;
      }

      const [, , , username, repo, , branch, ...path] = url.split("/");

      const nextUrl = `/${urlLocale}/external/${username}/${repo}/${branch}/${path
        .join("___")
        .replaceAll(".", "__")}/`;

      router.push(nextUrl);
    }
  }, [router]);

  return (
    <Box
      styleSheet={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f1724",
        color: "white",
        fontSize: "30px",
        fontWeight: "bold",
      }}
    >
      {i18n.content("MY.GENERATE_GUIDE")}
    </Box>
  );
}

export default pageHOC(ToScreen);

export const getStaticProps = async (ctx) => {
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;

  return withLocaleContent(
    {
      props: {
        locale,
      },
    },
    locale
  );
};
