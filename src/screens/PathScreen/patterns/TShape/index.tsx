import React from "react";
import { Box, Image, Link, Text } from "@src/components";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";
import { TItemCard } from "./patterns/TItemCard";
import { useI18n, useI18nLocale } from "@src/infra/i18n";
import { parseContent } from "@src/infra/i18n/parseContent";

interface TShapeProps {
  guide: PathScreenGetGuideBySlugQuery["guide"];
  externalGuideCreator?: string;
}
export default function TShape({ guide, externalGuideCreator }: TShapeProps) {
  const i18n = useI18n();
  const locale = useI18nLocale();
  const leftSide = guide.collaborations[0];
  const rightSide = guide.collaborations[1];
  const expertiseStart = guide.expertises[0];
  const expertiseMid = guide.expertises[1];
  const expertiseEnd = guide.expertises[2];

  const isExternalGuide = externalGuideCreator;
  const externalGuideMetadata = i18n
    .contentRaw("COMPANIES")
    ?.find((company) => {
      if (company.githubUser === externalGuideCreator) return true;
      return false;
    });

  const TItems = [
    {
      name: leftSide.name,
      cards: leftSide.cards,
    },
    {
      name: guide.name,
      cards: [expertiseStart, expertiseMid, expertiseEnd],
    },
    {
      name: rightSide.name,
      cards: rightSide.cards,
    },
  ];

  return (
    <Box
      styleSheet={{
        maxWidth: "1200px",
        width: "100%",
        marginHorizontal: "auto",
        marginTop: {
          xs: "3em",
          md: "6em",
        },
      }}
    >
      {isExternalGuide && (
        <Box
          styleSheet={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            maxWidth: "605px",
            margin: "0 auto 48px auto",
            gap: {
              xs: "20px",
              md: "8px",
            },
          }}
        >
          <Box
            styleSheet={{
              backgroundColor: "#FFFFFF",
              maxWidth: "173px",
              padding: "12px",
              borderRadius: "11px",
              boxShadow: "0px 11.9189px 51.2514px #8AA2AA",
              margin: "auto",
            }}
          >
            <Image
              src={externalGuideMetadata.logo}
              alt={`Logo ${externalGuideMetadata.name}`}
              styleSheet={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box
            styleSheet={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.03) -30.29%, rgba(255, 255, 255, 0) 144.92%)",
              border: "1px solid #242A2E",
              backdropFilter: "blur(22.8691px)",
              borderRadius: "14px",
              padding: "18px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              tag="p"
              styleSheet={{
                fontWeight: "400",
                fontSize: "14px",
                color: "#8992A1",
                maxWidth: "520px",
              }}
            >
              <Box
                tag="span"
                styleSheet={{
                  display: "block",
                }}
              >
                {parseContent(externalGuideMetadata.guideDescription)}
              </Box>
            </Text>
          </Box>
        </Box>
      )}
      <Box
        styleSheet={{
          display: "grid",
          gap: "10px",
          width: "100%",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        {TItems.map((item, index) => {
          const key = `${item.name}-${index}`;
          const isMain = index === 1;
          return (
            <Box
              key={key}
              styleSheet={{
                width: "100%",
              }}
            >
              <Text
                styleSheet={{
                  width: "100%",
                  color: "#FFFFFF",
                  margin: 0,
                  minHeight: {
                    xs: "80px",
                    sm: "106px",
                  },
                  fontSize: { xs: "8px", sm: "12px", md: "20px", lg: "25px" },
                  padding: { xs: "0.9375em 6px", md: "16px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  background:
                    "linear-gradient(304.78deg, rgba(13, 14, 13, 0.44) -6.31%, rgba(178, 191, 171, 0) 110.8%)",
                  backdropFilter: "blur(2.8586rem)",
                  borderRadius: "4px",
                  textAlign: "center",
                  marginBottom: "9px",
                  ...(isMain && {
                    background: "#03c2e0",
                    boxShadow: "0px 0.625rem 2.6875rem #127797",
                  }),
                }}
              >
                {item.name}
              </Text>
              {isMain ? (
                item.cards.map((card, index) => (
                  <Box key={index}>
                    <Box
                      styleSheet={{
                        padding: "16px",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: {
                          xs: "column",
                          md: "row",
                        },
                        textAlign: "center",
                        background: "#08181F",
                        border: "1px solid #03C2E0",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        fontStyle: "italic",
                        fontSize: {
                          xs: "6px",
                          sm: "12px",
                          md: "1vw",
                          lg: "12px",
                        },
                      }}
                    >
                      <Text
                        tag="span"
                        styleSheet={{
                          display: "inline-card",
                          color: "#03C2E0",
                          whiteSpace: "break-spaces",
                        }}
                      >
                        {i18n.content("TSHAPE.DEPTH.LEVEL_NAME")}{" "}
                        {`${index + 1} `}
                      </Text>
                      <Text tag="span">
                        {i18n.content("TSHAPE.DEPTH.LEVEL_SUFIX")}
                      </Text>
                    </Box>
                    <TItemCard
                      main
                      cards={card.cards}
                      categoryName={item.name}
                    />
                  </Box>
                ))
              ) : (
                <TItemCard
                  key={index}
                  cards={item.cards}
                  categoryName={item.name}
                />
              )}
            </Box>
          );
        })}
      </Box>
      <Box
        styleSheet={{
          alignItems: "center",
        }}
      >
        {!isExternalGuide && (
          <Link
            href={`https://github.com/alura/techguide/blob/main/_data/downloadFiles/${locale}/${guide.slug}.md`}
            styleSheet={{
              marginTop: "23px",
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              gap: "6px",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              borderRadius: "8px",
              border: "1px solid #0052FF",
              textDecoration: "none",
              padding: "14px",
              fontSize: "14px",
              backgroundColor: "#0052FF",
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
            {i18n.content("TSHAPE.BUTTON.DOWNLOAD_T_FILE")}
          </Link>
        )}
        <Link
          href="/"
          styleSheet={{
            marginTop: "23px",
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderRadius: "8px",
            border: "1px solid #0052FF",
            textDecoration: "none",
            padding: "14px",
            fontSize: "14px",
            hover: {
              opacity: 1,
              backgroundColor: "#0052FF",
            },
            focus: {
              opacity: 1,
              backgroundColor: "#0052FF",
            },
          }}
        >
          {i18n.content("TSHAPE.BUTTON.BACK_TO_HOME")}
        </Link>
      </Box>
    </Box>
  );
}
