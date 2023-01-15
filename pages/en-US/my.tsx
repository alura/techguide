import { SiteLocale } from "@src/gql_types";

export { default } from "../pt-BR/my";

export const getStaticProps = async () => {
  return {
    props: {
      locale: SiteLocale.EnUs,
    },
  };
};
