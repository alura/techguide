import { Box, Text, Image, Link } from "@src/components";
import { useI18n } from "@src/infra/i18n";
import React from "react";

export default function SecondContentSection() {
  const i18n = useI18n();
  return (
    <Box
      tag="section"
      className="discover"
      styleSheet={{
        background: "linear-gradient(180deg, #101926 0%, #010d1a 62.08%)",
        color: "#fff",
        paddingTop: {
          md: "3.5em",
          lg: "4.5em",
        },
        alignItems: "center",
      }}
    >
      <Box
        className="container"
        styleSheet={{
          position: "relative",
          display: "grid",
          maxWidth: "80rem",
          width: "100%",
          minHeight: {
            xs: "initial",
            md: "580px",
          },
          paddingTop: {
            xs: "3.5em",
            md: "0",
          },
          paddingHorizontal: {
            xs: "1.875rem",
          },
          alignItems: {
            xs: "center",
            md: "flex-start",
          },
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: {
            xs: "3.75em",
            md: "6.4375em",
          },
          textAlign: {
            xs: "center",
            md: "start",
          },
        }}
      >
        <Box
          className="container--flexbox"
          styleSheet={{
            alignItems: "center",
            margin: { xs: "0", md: "0 0 4.5em", lg: "0" },
            padding: { lg: "0" },
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
              backgroundColor: {
                xs: "rgba(0, 0, 0, 0.5)",
                md: "transparent",
              },
              width: "275px",
              borderRadius: "1000px",
              paddingVertical: "9px",
            }}
            i18nKey="SCREEN_HERO_CONTAINER.PRE_TITLE"
          />
          <Text
            tag="h2"
            styleSheet={{
              color: "white",
              fontSize: {
                xs: "1.5rem",
                md: "2.875rem",
              },
              lineHeight: { xs: "1.6875rem", md: "3.625rem" },
              margin: { xs: "2em 0 1.5em 0", md: "0.34em 0 0.7em 0" },
              width: {
                xs: "240px",
                md: "auto",
              },
            }}
          >
            {i18n.content("SCREEN_HERO_CONTAINER.SECOND_SECTION.TITLE")}
          </Text>
          <Text
            tag="p"
            styleSheet={{
              textAlign: {
                xs: "center",
                md: "start",
              },
              boxSizing: "inherit",
              margin: "0",
              padding: "0",
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              color: "#8992a1",
              marginBottom: "2.5em",
              width: {
                xs: "240px",
                md: "auto",
              },
            }}
          >
            {i18n.content("SCREEN_HERO_CONTAINER.SECOND_SECTION.SUB_TITLE")}
          </Text>
          <Link
            href="/"
            styleSheet={{
              alignSelf: {
                xs: "center",
                md: "flex-start",
              },
              textDecoration: "none",
              color: "#FFFFFF",
              backgroundColor: "#0052FF",
              border: "1px solid #0052FF",
              paddingVertical: "16px",
              paddingHorizontal: "32px",
              fontSize: "16px",
              transition: ".3s",
              borderRadius: "8px",
              hover: {
                opacity: 1,
                backgroundColor: "transparent",
              },
              focus: {
                opacity: 1,
                backgroundColor: "transparent",
              },
            }}
          >
            {i18n.content("SCREEN_HERO_CONTAINER.SECOND_SECTION.BTN")}
          </Link>
        </Box>
        <Box
          className="discover__illustration"
          styleSheet={{
            position: {
              xs: "relative",
              md: "absolute",
            },
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: {
              xs: "center",
              md: "flex-end",
            },
          }}
        >
          <Image
            src={i18n.content("IMAGES.DISCOVER_IMAGE")}
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
      </Box>
    </Box>
  );
}
