import React from "react";
import { Box, Icon, Image, Link, Text } from "@src/components";
import pkg from "../../../package.json";
import { useI18n } from "@src/infra/i18n";

export default function Footer() {
  const i18n = useI18n();
  return (
    <Box
      tag="footer"
      styleSheet={{
        color: "#8992a1",
        backgroundColor: "#080f1b",
        alignItems: "center",
        padding: {
          xs: "4.9375em 0",
          md: "3.75em 0",
        },
      }}
    >
      <Box
        styleSheet={{
          width: "100%",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          paddingHorizontal: {
            md: "2.5rem",
          },
          maxWidth: "80rem",
        }}
      >
        <Box>
          <Image
            styleSheet={{
              width: { xs: "69px", md: "45px" },
              height: { xs: "69px", md: "45px" },
              marginBottom: {
                xs: "2.5em",
                md: "0",
              },
            }}
            src="/assets/image/logo.svg"
            alt="Logo"
          />
        </Box>
        <Box
          styleSheet={{
            flex: 1,
            padding: "0 1em",
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1.5",
            textAlign: {
              xs: "center",
              md: "initial",
            },
            marginBottom: {
              xs: "2em",
              md: "0",
            },
          }}
        >
          <Text
            tag="p"
            styleSheet={{
              marginBottom: "4px",
            }}
          >
            {i18n.content("FOOTER.DESCRIPTION")}
            {pkg.version}
          </Text>
          <Text
            tag="p"
            styleSheet={{
              marginBottom: "4px",
            }}
          >
            <Link
              href="https://www.alura.com.br/sobre"
              styleSheet={{
                textDecoration: "none",
                color: "#FFFFFF",
              }}
            >
              Alura,
            </Link>{" "}
            <Link
              href="https://www.cursospm3.com.br/"
              styleSheet={{
                textDecoration: "none",
                color: "#FFFFFF",
              }}
            >
              PM3
            </Link>{" "}
            e{" "}
            <Link
              href="https://www.fiap.com.br/"
              styleSheet={{
                textDecoration: "none",
                color: "#FFFFFF",
              }}
            >
              FIAP
            </Link>
          </Text>
          <Text>
            {i18n.content("FOOTER.OPEN_SOURCE_CTA", {
              link: ({ children, text, ...props }: any) => (
                <>
                  <Link
                    {...props}
                    styleSheet={{
                      textDecoration: "none",
                      color: "#FFFFFF",
                    }}
                  >
                    {children}
                    {text}
                  </Link>
                </>
              ),
            })}
          </Text>
        </Box>
        <Box
          styleSheet={{
            color: "white",
            flexDirection: "row",
            fontSize: "22px",
            gap: "0.625em",
          }}
        >
          <Link href={i18n.content("FOOTER.YOUTUBE")}>
            <Icon name="youtube" />
          </Link>
          <Link href={i18n.content("FOOTER.FACEBOOK")}>
            <Icon name="facebook" />
          </Link>
          <Link href={i18n.content("FOOTER.TWITTER")}>
            <Icon name="twitter" />
          </Link>
          <Link href={i18n.content("FOOTER.INSTAGRAM")}>
            <Icon name="instagram" />
          </Link>
          <Link href={i18n.content("FOOTER.PLAYSTORE")}>
            <Icon name="playstore" />
          </Link>
          <Link href={i18n.content("FOOTER.APPSTORE")}>
            <Icon name="appstore" />
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
