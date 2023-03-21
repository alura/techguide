import React from "react";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { pageHOC } from "@src/wrappers/pageHOC";
import { useI18n } from "@src/infra/i18n";
import { Container } from "./patterns/Container";
import { Box, Image, Text } from "@src/components";
import { parseContent } from "@src/infra/i18n/parseContent";
import { Guide } from "./patterns/Guide";

function CompaniesScreen() {
  const i18n = useI18n();
  const companies = i18n.contentRaw("COMPANIES");

  return (
    <ScreenHeroContainer>
      {companies?.map((company) => {
        return (
          <Container
            key={company.name}
            styleSheet={{
              marginTop: "111px",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.03) -30.29%, rgba(255, 255, 255, 0) 144.92%)",
              border: "1px solid #242A2E",
              backdropFilter: "blur(22.8691px)",
              borderRadius: "14px",
              padding: "0 30px 40px 30px",
            }}
          >
            <Box
              styleSheet={{
                width: "226px",
                height: "90px",
                padding: "12px",
                borderRadius: "14px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 11.9189px 51.2514px #8AA2AA",
                transform: "translate(0, -50%)",
                margin: "0 auto",
              }}
            >
              <Image
                src={company.logo}
                alt={`Logo ${company.name}`}
                styleSheet={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Text
              tag="p"
              styleSheet={{
                fontWeight: "400",
                fontSize: "18px",
                color: "#8992A1",
                textAlign: "center",
                maxWidth: "520px",
                alignSelf: "center",
              }}
            >
              {parseContent(company.description)}
            </Text>
            <Box
              tag="ul"
              styleSheet={{
                marginTop: "36px",
                display: "grid",
                gridAutoRows: {
                  xs: "85px",
                  md: "128px",
                },
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(4, 1fr)",
                },
                gap: "16px",
              }}
            >
              {company.guides?.map((guide) => {
                return (
                  <Guide
                    link={guide.link}
                    title={guide.title}
                    key={guide.name}
                  />
                );
              })}
            </Box>
          </Container>
        );
      })}
    </ScreenHeroContainer>
  );
}

export default pageHOC(CompaniesScreen);
