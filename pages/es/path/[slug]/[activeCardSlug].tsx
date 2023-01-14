export { default } from "../../../pt-BR/path/[slug]/[activeCardSlug]";
import { SiteLocale } from "@src/gql_types";
import { getStaticProps as staticProps } from "../../../pt-BR/path/[slug]/[activeCardSlug]";
import { getStaticPaths as staticPaths } from "../../../pt-BR/path/[slug]/[activeCardSlug]";

export const getStaticProps = async (ctx) => {
  return staticProps({ ...ctx, locale: SiteLocale.Es });
};

export const getStaticPaths = async (ctx) => {
  return staticPaths({ ...ctx, locale: SiteLocale.Es });
};
