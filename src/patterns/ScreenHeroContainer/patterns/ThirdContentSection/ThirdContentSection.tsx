import React from "react";
import { Box, Image, Link, Text } from "@src/components";
import { useI18n } from "@src/infra/i18n";

export function ThirdContentSection() {
  const i18n = useI18n();
  return (
    <Box
      id="7days-of-code"
      tag="section"
      styleSheet={{
        color: "#FFFFFF",
        backgroundColor: "#060C14",
        paddingTop: {
          md: "3.5em",
          lg: "4.5em",
        },
        paddingBottom: {
          md: "3.5em",
          lg: "4.5em",
        },
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: "73px",
      }}
    >
      <Box>
        <Image
          src={i18n.content("7DAYSOFCODE.IMAGE")}
          alt="Descubra!"
          styleSheet={{
            width: {
              xs: "300px",
              sm: "400px",
              md: "400px",
              lg: "auto",
            },
          }}
        />
      </Box>
      <Box
        styleSheet={{
          alignItems: "flex-start",
        }}
      >
        <Text
          styleSheet={{
            alignSelf: {
              xs: "center",
              md: "flex-start",
            },
            gap: "0.5em",
            display: "flex",
            flexDirection: "row",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            justifyContent: {
              xs: "center",
              md: "flex-start",
            },
            textTransform: "uppercase",
            color: "#8992a1",
            fontWeight: "600",
            fontSize: "0.875rem",
            lineHeight: "180%",
            backgroundColor: "#141C2B",
            width: "275px",
            borderRadius: "1000px",
            paddingVertical: "9px",
          }}
          i18nKey="7DAYSOFCODE.PRE_TITLE"
        />
        <Text
          i18nKey="7DAYSOFCODE.TITLE"
          i18nKeyReplace={{
            strong: ({ children }) => (
              <Text
                tag="strong"
                styleSheet={{
                  color: "#F9FF00",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  lineHeight: "180%",
                }}
              >
                {children}
              </Text>
            ),
          }}
        />
        <Text i18nKey="7DAYSOFCODE.DESCRIPTION" />
        <Link
          href={i18n.content("7DAYSOFCODE.CTA_LINK")}
          styleSheet={{
            alignSelf: {
              xs: "center",
              md: "flex-start",
            },
            textDecoration: "none",
            color: "#07080A",
            backgroundColor: "#F9FF00",
            border: "1px solid #F9FF00",
            paddingVertical: "16px",
            paddingHorizontal: "32px",
            fontSize: "16px",
            transition: ".3s",
            borderRadius: "8px",
            hover: {
              opacity: 1,
              color: "#FFFFFF",
              backgroundColor: "transparent",
            },
            focus: {
              opacity: 1,
              backgroundColor: "transparent",
            },
          }}
        >
          {i18n.content("7DAYSOFCODE.CTA")}
        </Link>
      </Box>
    </Box>
  );
}
