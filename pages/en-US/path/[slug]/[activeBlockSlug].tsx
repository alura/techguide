export { default } from "../../../pt-BR/path/[slug]/[activeBlockSlug]";
import { SiteLocale } from "@src/gql_types";
import { getStaticProps as staticProps } from "../../../pt-BR/path/[slug]/[activeBlockSlug]";
import { getStaticPaths as staticPaths } from "../../../pt-BR/path/[slug]/[activeBlockSlug]";

export const getStaticProps = async (ctx) => {
  return staticProps({ ...ctx, locale: SiteLocale.EnUs });
};

export const getStaticPaths = async (ctx) => {
  return staticPaths({ ...ctx, locale: SiteLocale.EnUs });
};
