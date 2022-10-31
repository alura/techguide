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
          tag="nav"
        >
          <ul
            style={{ listStyle: "none", display: "flex", gap: "1rem" }}
            aria-label="Alura nas mídias sociais"
          >
            <li>
              <Link
                href="https://youtube.com/aluracursosonline"
                aria-label="Youtube"
              >
                <Icon name="youtube" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.facebook.com/AluraCursosOnline/"
                aria-label="Facebook"
              >
                <Icon name="facebook" />
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/aluraonline" aria-label="Twitter">
                <Icon name="twitter" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/aluraonline/"
                aria-label="Instagram"
              >
                <Icon name="instagram" />
              </Link>
            </li>
            <li>
              <Link
                href="https://play.google.com/store/apps/details?id=br.com.alura.mobi"
                aria-label="Play store"
              >
                <Icon name="playstore" />
              </Link>
            </li>
            <li>
              <Link
                href="https://apps.apple.com/br/app/alura-cursos-online/id1225776635"
                aria-label="Apple store"
              >
                <Icon name="appstore" />
              </Link>
            </li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
}
