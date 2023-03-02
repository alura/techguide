import { Box } from "@src/components";
import React from "react";
import Footer from "../Footer";
import Menu from "../Menu";
import FirstContentSection from "./patterns/FirstContentSection";
import SecondContentSection from "./patterns/SecondContentSection";
import FAQContentSection from "./patterns/FAQContentSection";
import HeroTitle from "./patterns/HeroTitle";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";

interface ScreenHeroContainerProps {
  guide?: PathScreenGetGuideBySlugQuery["guide"];
  children: React.ReactNode;
}
export default function ScreenHeroContainer({
  guide,
  children,
}: ScreenHeroContainerProps) {
  return (
    <>
      <Menu />
      <Box
        tag="main"
        styleSheet={{
          flex: 1,
          justifyContent: "flex-start",
          background: "linear-gradient(180deg, #0f1825 0%, #010a11 62.08%)",
          overflow: "hidden",
        }}
      >
        <Box
          styleSheet={{
            width: "100%",
            margin: "0 auto",
            paddingHorizontal: {
              xs: "1rem",
              md: "2.5rem",
            },
          }}
        >
          <Box
            styleSheet={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              backgroundSize: "cover",
              color: "#FFFFFF",
              padding: {
                xs: "2.8125em 0",
                md: "5em 0",
              },
            }}
          >
            <Box
              styleSheet={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                top: "10rem",
                left: "-20rem",
                width: "45.4375rem",
                height: "65.875rem",
                position: "absolute",
                background:
                  "url(/assets/image/home-illustration-one.svg) no-repeat",
                backgroundPositionY: "-54px",
                zIndex: "1",
                filter: "blur(9px)",
              }}
            />
            <Box
              styleSheet={{
                position: "relative",
                zIndex: "2",
                width: "100%",
              }}
            >
              <HeroTitle />
              {children}
            </Box>
            <Box
              styleSheet={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                top: "12rem",
                right: "-20rem",
                transform: "scaleX(-1)",
                width: "45.4375rem",
                height: "65.875rem",
                position: "absolute",
                background:
                  "url(/assets/image/home-illustration-one.svg) no-repeat",
                backgroundPositionY: "-54px",
                zIndex: "1",
                filter: "blur(9px)",
              }}
            />
          </Box>
        </Box>
      </Box>
      <FirstContentSection />
      <SecondContentSection />
      <FAQContentSection questions={guide?.faq} />
      <Footer />
    </>
  );
}
