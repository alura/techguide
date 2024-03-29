import React from "react";
import { Box, Link } from "@src/components";
import { useI18n, useI18nLocale } from "@src/infra/i18n";
import { SiteLocale } from "@src/gql_types";

const languages = [
  {
    label: "PT",
    link: "/",
    locale: "PT_BR",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 9">
        <g opacity=".8">
          <path
            fill="#009B3A"
            d="M11.077 7.27a1.23 1.23 0 0 1-1.23 1.23H1.23A1.23 1.23 0 0 1 0 7.27V1.73C0 1.052.551.5 1.23.5h8.616c.68 0 1.23.551 1.23 1.23v5.54Z"
          />
          <path
            fill="#FEDF01"
            d="M10.07 4.5 5.54 7.923 1.007 4.5l4.532-3.423L10.07 4.5Z"
          />
          <path
            fill="#002776"
            d="M5.533 6.465a1.987 1.987 0 1 0 0-3.975 1.987 1.987 0 0 0 0 3.975Z"
          />
          <path
            fill="#CBE9D4"
            d="M3.776 3.542a1.97 1.97 0 0 0-.207.622c1.23-.09 2.898.582 3.614 1.414.124-.186.215-.394.272-.617-.884-.864-2.436-1.424-3.679-1.42Z"
          />
          <path
            fill="#88C9F9"
            d="M3.693 4.572h.308v.308h-.308v-.308Zm.308.616h.308v.307H4v-.307Z"
          />
          <path
            fill="#55ACEE"
            d="M4.615 4.571h.308v.308h-.308v-.308Zm.616.308h.307v.308h-.307v-.308Zm1.23.615h.308v.308h-.308v-.308Zm-.923.308h.308v.308h-.308v-.308Zm.923-1.846h.308v.308h-.308v-.308Z"
          />
          <path fill="#3B88C3" d="M5.848 5.187h.307v.308h-.307v-.308Z" />
        </g>
      </svg>
    ),
  },
  {
    label: "EN",
    link: "/",
    locale: "EN_US",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 9">
        <path
          fill="#B22334"
          d="M10.983 1.115A1.225 1.225 0 0 0 9.923.5H5.616v.615h5.367ZM.077 6.654h11.077v.615H.077v-.615Zm5.539-2.462h5.538v.616H5.616v-.616Zm0-1.23h5.538v.615H5.616v-.615ZM.077 5.423h11.077v.615H.077v-.615ZM1.307 8.5h8.616c.455 0 .847-.249 1.06-.615H.248c.213.366.605.615 1.06.615Zm4.309-6.77h5.538v.616H5.616v-.615Z"
        />
        <path
          fill="#EEE"
          d="M.098 7.478a1.308 1.308 0 0 0 .047.176c.027.08.06.157.102.229v.001h10.736a1.295 1.295 0 0 0 .171-.615H.077c0 .072.009.141.021.209Zm-.02-1.44h11.076v.616H.077v-.616Zm0-1.23v.615h11.076v-.615H.077Zm5.538-1.231h5.538v.615H5.616v-.615Zm0-1.231h5.538v.615H5.616v-.615ZM.077 1.731Zm.17-.616v.002-.002Zm-.13.321c.007-.03.018-.06.028-.09-.01.03-.02.06-.028.09Zm5.499.295h5.538a1.136 1.136 0 0 0-.04-.294 1.3 1.3 0 0 0-.131-.322H5.616v.616Z"
        />
        <path
          fill="#3C3B6E"
          d="M5.616.5H1.308c-.68 0-1.23.551-1.23 1.23v3.078h5.538V.5Z"
        />
        <path
          fill="#fff"
          d="m.693 1.339.19.138-.072.223.19-.138.19.138-.073-.223.19-.138h-.235l-.072-.224-.073.224H.693Zm.616.615.19.138-.073.223.19-.138.19.138-.072-.223.19-.138h-.235l-.073-.223-.072.223h-.235Zm1.23 0 .19.138-.072.223.19-.138.19.138-.073-.223.19-.138H2.92l-.073-.223-.072.223H2.54Zm1.231 0 .19.138-.072.223.19-.138.19.138-.073-.223.19-.138H4.15l-.072-.223-.073.223H3.77Zm-2.46 1.23.19.139-.073.223.19-.138.19.138-.072-.223.19-.138H1.69l-.073-.224-.072.224H1.31Zm1.23 0 .19.139-.072.223.19-.138.19.138-.073-.223.19-.138H2.92l-.073-.224-.072.224H2.54Zm1.231 0 .19.139-.072.223.19-.138.19.138-.073-.223.19-.138H4.15l-.072-.224-.073.224H3.77ZM1.924 1.34l.19.138-.072.223.19-.138.19.138-.073-.223.19-.138h-.235l-.072-.224-.073.224h-.235Zm1.23 0 .191.138-.073.223.19-.138.19.138-.072-.223.19-.138h-.235l-.073-.224-.072.224h-.235Zm1.232 0 .19.138-.073.223.19-.138.19.138-.072-.223.19-.138h-.235l-.073-.224-.072.224h-.235ZM.693 2.569l.19.139-.072.223.19-.138.19.138-.073-.223.19-.139h-.235l-.072-.223-.073.223H.693Zm1.349.362.19-.138.19.138-.073-.223.19-.139h-.235l-.072-.223-.073.223h-.235l.19.139-.072.223Zm1.113-.362.19.139-.073.223.19-.138.19.138-.072-.223.19-.139h-.235l-.073-.223-.072.223h-.235Zm1.23 0 .19.139-.072.223.19-.138.19.138-.072-.223.19-.139h-.235l-.073-.223-.072.223h-.235ZM.694 3.8l.19.138-.072.223.19-.137.19.137-.073-.223.19-.138h-.235l-.072-.223-.073.223H.693Zm1.349.361.19-.137.19.137-.073-.223.19-.138h-.235l-.072-.223-.073.223h-.235l.19.138-.072.223Zm1.113-.36.19.137-.073.223.19-.137.19.137-.072-.223.19-.138h-.235l-.073-.223-.072.223h-.235Zm1.23 0 .19.137-.072.223.19-.137.19.137-.072-.223L5 3.8h-.235l-.073-.223-.072.223h-.235Z"
        />
      </svg>
    ),
  },
  {
    label: "ES",
    link: "/",
    locale: "ES",
    flag: (
      <svg
        width="12"
        height="9"
        viewBox="0 0 12 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.2312 7.26923C11.2312 7.94892 10.6801 8.5 10.0005 8.5H1.38507C0.705374 8.5 0.154297 7.94892 0.154297 7.26923V1.73077C0.154297 1.05108 0.705374 0.5 1.38507 0.5H10.0005C10.6801 0.5 11.2312 1.05108 11.2312 1.73077V7.26923Z"
          fill="#C60A1D"
        />
        <path
          d="M0.154297 2.65381H11.2312V6.34612H0.154297V2.65381Z"
          fill="#FFC400"
        />
        <path
          d="M2.92285 4.19263V5.1157C2.92285 5.62555 3.33608 6.03878 3.84593 6.03878C4.35577 6.03878 4.76901 5.62555 4.76901 5.1157V4.19263H2.92285Z"
          fill="#EA596E"
        />
        <path
          d="M3.8457 3.88513H4.76878V4.80821H3.8457V3.88513Z"
          fill="#F4A2B2"
        />
        <path
          d="M2.92285 3.88513H3.84593V4.80821H2.92285V3.88513Z"
          fill="#DD2E44"
        />
        <path
          d="M3.84593 3.88462C4.35573 3.88462 4.76901 3.67799 4.76901 3.42309C4.76901 3.16819 4.35573 2.96155 3.84593 2.96155C3.33613 2.96155 2.92285 3.16819 2.92285 3.42309C2.92285 3.67799 3.33613 3.88462 3.84593 3.88462Z"
          fill="#EA596E"
        />
        <path
          d="M3.84593 3.42309C4.35573 3.42309 4.76901 3.31977 4.76901 3.19232C4.76901 3.06487 4.35573 2.96155 3.84593 2.96155C3.33613 2.96155 2.92285 3.06487 2.92285 3.19232C2.92285 3.31977 3.33613 3.42309 3.84593 3.42309Z"
          fill="#FFAC33"
        />
        <path
          d="M2.30664 3.88513H2.61433V6.03898H2.30664V3.88513ZM5.07587 3.88513H5.38356V6.03898H5.07587V3.88513Z"
          fill="#99AAB5"
        />
        <path
          d="M2.00195 5.73026H2.92503V6.03795H2.00195V5.73026ZM4.77118 5.73026H5.69426V6.03795H4.77118V5.73026ZM2.30965 3.57642H2.61734V3.88411H2.30965V3.57642ZM5.07888 3.57642H5.38657V3.88411H5.07888V3.57642Z"
          fill="#66757F"
        />
      </svg>
    ),
  },
];

export function LanguageSwitch() {
  const i18n = useI18n();
  const siteLocale = useI18nLocale();
  return (
    <Box
      styleSheet={{
        padding: "26px 16px",
        paddingBottom: "0",
        marginBottom: "50px",
      }}
    >
      <Box
        styleSheet={{
          maxWidth: "80rem",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          styleSheet={{
            flex: 1,
            color: "#FFFFFF",
            alignItems: "flex-start",
          }}
        >
          <Link href="#7days-of-code">{i18n.content("7DAYSOFCODE.CTA")}</Link>
        </Box>
        <Box
          tag="nav"
          styleSheet={{
            display: "flex",
            flexDirection: "row",
            gap: {
              xs: "4px",
              sm: "8px",
            },
          }}
        >
          {languages.map(({ label, flag, link, locale }) => {
            return (
              <Link
                key={locale}
                href={link}
                locale={locale as SiteLocale}
                styleSheet={{
                  border: "1px solid #D1DAF8",
                  borderRadius: "10000px",
                  width: {
                    xs: "50px",
                    sm: "56px",
                  },
                  height: "27px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  gap: "4px",
                  flexDirection: "row",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                  hover: {
                    backgroundColor: "#233346",
                    border: "1px solid #43E1EB",
                  },
                  ...(locale === siteLocale && {
                    backgroundColor: "#233346",
                    border: "1px solid #43E1EB",
                  }),
                }}
              >
                <Box
                  styleSheet={{
                    width: "11px",
                    heigh: "8px",
                  }}
                >
                  {flag}
                </Box>
                {label}
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
