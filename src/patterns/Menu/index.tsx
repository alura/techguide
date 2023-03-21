import React from "react";
import { Box, Image, Link } from "@src/components";
import { useI18n } from "@src/infra/i18n";

export default function Menu() {
  const i18n = useI18n();
  return (
    <Box
      styleSheet={{
        width: "100%",
        margin: "0 auto",
        alignItems: "center",
        padding: "1.25em 1rem",
        color: "#FFFFFF",
        backgroundColor: "#080f1b",
      }}
    >
      <Box
        styleSheet={{
          width: "100%",
          maxWidth: "80rem",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/">
          <Image
            src="/assets/image/logo.svg"
            alt={i18n.content("MENU.LOGO_ALT")}
            styleSheet={{
              width: "29px",
              height: "29px",
            }}
          />
        </Link>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=alura&repo=techguide&type=star&count=true"
          frameBorder="0"
          scrolling="0"
          width="110"
          height="30"
          title="GitHub"
        />
        {/* TODO: Removed until v2 */}
        {/* <Link
          href="/"
          styleSheet={{
            fontWeight: "600",
            fontSize: "0.6047rem",
            lineHeight: "171.02%",
            textDecoration: "underline",
          }}
        >
          {i18n.content("MENU.CTA_TEXT")}
        </Link> */}
      </Box>
    </Box>
  );
}
