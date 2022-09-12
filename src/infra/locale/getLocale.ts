import { SiteLocale } from "@src/gql_types";

export function getLocale(locale: SiteLocale) {
  return locale || "PT_BR";
}
