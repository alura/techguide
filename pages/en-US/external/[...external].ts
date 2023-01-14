import { SiteLocale } from "@src/gql_types";
export { default } from "../../pt-BR/external/[...external]";
import { getStaticProps as staticProps } from "../../pt-BR/external/[...external]";
import { getStaticPaths as staticPaths } from "../../pt-BR/external/[...external]";

export const getStaticProps = async (ctx) => {
  return staticProps({ ...ctx, locale: SiteLocale.EnUs });
};

export const getStaticPaths = async () => {
  return staticPaths();
};
