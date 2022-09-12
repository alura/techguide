import React from "react";
import { Box, Text } from "@src/components";

export default function HeroTitle() {
  return (
    <Box
      styleSheet={{
        zIndex: "2",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: {
          xs: "240px",
          md: "auto",
        },
      }}
    >
      <Text
        styleSheet={{
          gap: "0.5em",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          color: "#8992a1",
          fontWeight: "600",
          fontSize: "0.875rem",
          lineHeight: "180%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "275px",
          borderRadius: "1000px",
          paddingVertical: "9px",
        }}
        i18nKey="SCREEN_HERO_CONTAINER.PRE_TITLE"
      />
      <Text
        tag="h1"
        styleSheet={{
          marginTop: "0.4em",
          maxWidth: "800px",
          fontWeight: "600",
          textAlign: "center",
          letterSpacing: "-0.01em",
          fontSize: {
            xs: "2.063rem",
            md: "4rem",
          },
          lineHeight: {
            xs: "2.375rem",
            md: "4.8125rem",
          },
        }}
        i18nKey="SCREEN_HERO_CONTAINER.TITLE"
        i18nKeyReplace={{
          strong: ({ children }) => (
            <Text
              tag="strong"
              styleSheet={{
                color: "white",
                background: "linear-gradient(to right, #39F6EB, #1184EF)",
                "-webkit-background-clip": "text",
                "-webkit-text-fill-color": "transparent",
              }}
            >
              {children}
            </Text>
          ),
        }}
      />
      <Text
        i18nKey="SCREEN_HERO_CONTAINER.SUB_TITLE"
        styleSheet={{
          maxWidth: "700px",
          marginTop: "1em",
          textAlign: "center",
          fontSize: {
            xs: "1rem",
            md: "1.25rem",
          },
          lineHeight: "1.5rem",
          color: "#8992a1",
        }}
      />
    </Box>
  );
}
