import React from "react";
import { useRouter } from "next/router";
import { SiteLocale } from "@src/gql_types";

export default function ToScreen({ locale }: { locale: SiteLocale }) {
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      const [localePrefix, localeSufix] = locale.split("_");
      const urlLocale = `${localePrefix.toLowerCase()}${
        localeSufix ? `-${localeSufix}` : localeSufix
      }`.replace("undefined", "");

      const url = router.query.url as string;
      const [, , , username, repo, , branch, path] = url.split("/");

      const nextUrl = `/${urlLocale}/external/${username}/${repo}/${branch}/${path.replaceAll(
        ".",
        "__"
      )}/`;
      router.push(nextUrl);
    }
  }, [router]);

  return <div>Redirect...</div>;
}

export const getStaticProps = async () => {
  return {
    props: {
      locale: SiteLocale.PtBr,
    },
  };
};
