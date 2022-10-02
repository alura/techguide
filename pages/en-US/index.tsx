export { default } from "../index";
import { SiteLocale } from "@src/gql_types";
import { getStaticProps as staticProps } from "../index";

export const getStaticProps = async (ctx) => {
  return staticProps({ ...ctx, locale: SiteLocale.EnUs });
};
