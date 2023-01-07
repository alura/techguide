export { default } from "../../pt-BR/external/[...external]";
import { SiteLocale } from "@src/gql_types";
import { getStaticProps as staticProps } from "../../pt-BR/external/[...external]";
import { getStaticPaths as staticPaths } from "../../pt-BR/external/[...external]";

export const getStaticProps = async (ctx) => {
  return staticProps({ ...ctx, locale: SiteLocale.Es });
};

export const getStaticPaths = async (ctx) => {
  return staticPaths({ ...ctx, locale: SiteLocale.Es });
};
