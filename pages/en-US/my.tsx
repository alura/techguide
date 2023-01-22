import { SiteLocale } from "@src/gql_types";
import { getStaticProps as getStaticPropsPtBr } from "../pt-BR/my";

export { default } from "../pt-BR/my";

export const getStaticProps = async () => {
  return getStaticPropsPtBr({
    locale: SiteLocale.EnUs,
  });
};
