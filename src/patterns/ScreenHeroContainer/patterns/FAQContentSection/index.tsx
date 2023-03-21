import React from "react";
import { Box, Text } from "@src/components";
import Arrows from "./Arrows";
import { parseContent } from "@src/infra/i18n/parseContent";
import { useI18n } from "@src/infra/i18n";

interface FAQQuestionProps {
  questions?: {
    title?: string;
    answer?: string;
  }[];
}
export default function FAQContentSection(props: FAQQuestionProps) {
  const i18n = useI18n();
  const questions = props?.questions?.length
    ? props.questions
    : i18n.contentRaw("FAQ.GLOBAL");

  return (
    <Box
      styleSheet={{
        display: questions?.length <= 1 ? "none" : "block",
        background: "#101926",
        justifyContent: "center",
      }}
    >
      <Box
        styleSheet={{
          maxWidth: "80rem",
          width: "100%",
          paddingTop: {
            xs: "85px",
            md: "166px",
          },
          paddingBottom: {
            xs: "85px",
            md: "166px",
          },
          paddingHorizontal: "1.875rem",
          marginHorizontal: "auto",
          alignItems: "flex-start",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          gap: {
            xs: "50px",
            md: "90px",
          },
          justifyContent: "space-between",
        }}
      >
        <Box
          styleSheet={{
            alignSelf: {
              xs: "center",
              sm: "center",
              md: "flex-start",
            },
            maxWidth: {
              xs: "300px",
              sm: "374px",
              md: "474px",
            },
            position: "relative",
            width: "100%",
            justifyContent: {
              xs: "center",
              sm: "center",
              md: "flex-start",
            },
          }}
        >
          <Text
            styleSheet={{
              background: "#101926",
              fontWeight: 600,
              textAlign: { xs: "center", sm: "center", md: "left" },
              fontSize: { xs: "24px", sm: "38px", md: "48px" },
              letterSpacing: "-0.01em",
              color: "#F2F0FF",
              marginBottom: {
                xs: "0",
                sm: "0",
                md: "30px",
              },
            }}
          >
            {i18n.content("FAQ.GLOBAL.TITLE")}
          </Text>
          <Box styleSheet={{ display: { xs: "none", md: "flex" } }}>
            <Arrows />
          </Box>
          <Box
            styleSheet={{
              content: "",
              display: { xs: "none", md: "block" },
              width: "29.75rem",
              height: "28.75rem",
              position: "absolute",
              pointerEvents: "none",
              background:
                "url('/assets/image/home-illustration-two-illustration.svg') center / cover",
              bottom: "-10rem",
              left: "-17rem",
            }}
          />
        </Box>
        <Box
          styleSheet={{
            flex: "1",
            width: "100%",
          }}
        >
          {questions?.map(({ title, answer }) => (
            <FAQQuestion key={title} title={title} answer={answer} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function FAQQuestion({ title, answer }: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box
      styleSheet={{
        borderBottom: "1px solid #1B2431",
      }}
    >
      <Box
        tag="button"
        styleSheet={{
          cursor: "pointer",
          background: "transparent",
          color: "#FFFFFF",
          fontWeight: 600,
          fontSize: {
            xs: "16px",
            md: "24px",
          },
          lineHeight: "26px",
          border: "none",
          marginTop: "32px",
          paddingBottom: "24px",
          justifyContent: "flex-start",
          textAlign: "left",
          position: "relative",
          paddingRight: "30px",
          transition: ".3s",
          hover: {
            opacity: ".5",
          },
          focus: {
            opacity: ".5",
          },
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-controls={title}
        aria-expanded={isOpen ? "true" : "false"}
      >
        <Text>
          {title}
          <Box
            tag="svg"
            viewBox="0 0 18 11"
            xmlns="http://www.w3.org/2000/svg"
            styleSheet={{
              fill: "none",
              position: "absolute",
              top: 0,
              right: 0,
              width: "18px",
              height: "11px",
              transform: `rotate(${isOpen ? "0deg" : "180deg"})`,
              transition: "transform .4s ease-out",
            }}
          >
            <path
              d="M17 10L9 2L1 10"
              stroke="#03C2E0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Box>
        </Text>
      </Box>
      <Box
        id={title}
        styleSheet={{
          display: "flex",
          flex: 1,
          width: "100%",
          marginBottom: "24px",
          transition: `max-height 0.5s ${
            isOpen ? "ease-in-out" : "cubic-bezier(0, 1, 0, 1)"
          }`,
          maxHeight: isOpen ? "1000px" : 0,
          overflow: "hidden",
        }}
        aria-hidden={isOpen ? "false" : "true"}
        onFocus={() => setIsOpen(true)}
      >
        <Text
          styleSheet={{
            fontWeight: 400,
            fontSize: {
              xs: "14px",
              md: "18px",
            },
            lineHeight: "21px",
            color: "#8992A1",
          }}
        >
          {parseContent(answer)}
        </Text>
      </Box>
    </Box>
  );
}
