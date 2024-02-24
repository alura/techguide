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
          xs: "56px",
          md: "130px",
          lg: "130px",
        },
        paddingBottom: {
          xs: "56px",
          md: "130px",
          lg: "130px",
        },
      }}
    >
      <Box
        styleSheet={{
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "80rem",
          width: "100%",
          margin: "0 auto",
          flexDirection: {
            xs: "column-reverse",
            md: "row",
            lg: "row",
          },
          gap: {
            xs: "40px",
            md: "53px",
            lg: "73px",
          },
        }}
      >
        <Box
          styleSheet={{
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          <Image
            src={i18n.content("7DAYSOFCODE.IMAGE")}
            alt="Descubra!"
            styleSheet={{
              width: {
                xs: "300px",
                sm: "400px",
                md: "380px",
                lg: "476px",
              },
            }}
          />
        </Box>
        <Box
          styleSheet={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <Box
            styleSheet={{
              maxWidth: "525px",
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
                borderRadius: "1000px",
                paddingVertical: "9px",
                paddingHorizontal: "20px",
              }}
              i18nKey="7DAYSOFCODE.PRE_TITLE"
            />
            <Text
              styleSheet={{
                marginTop: "24px",
                fontWeight: "600",
                fontSize: {
                  xs: "24px",
                  sm: "32px",
                  md: "38px",
                  lg: "48px",
                },
                textAlign: {
                  xs: "center",
                  sm: "center",
                  md: "left",
                },
                lineHeight: "1",
              }}
              i18nKey="7DAYSOFCODE.TITLE"
              i18nKeyReplace={{
                strong: ({ children }) => (
                  <Text
                    tag="strong"
                    styleSheet={{
                      color: "#F9FF00",
                    }}
                  >
                    {children}
                  </Text>
                ),
              }}
            />
            <Text
              styleSheet={{
                marginTop: "24px",
                fontSize: "16px",
                lineHeight: "180%",
                color: "#8992A1",
              }}
              i18nKey="7DAYSOFCODE.DESCRIPTION"
            />
            <Link
              href={i18n.content("7DAYSOFCODE.CTA_LINK")}
              styleSheet={{
                marginTop: "40px",
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
      </Box>
    </Box>
  );
}
