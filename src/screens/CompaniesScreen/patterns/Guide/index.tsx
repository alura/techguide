import React from "react";
import { Link } from "@src/components";
import { StyledBox } from "./styles";

interface GuideProps {
  link: string;
  title: string;
}
export function Guide({ link, title }: GuideProps) {
  return (
    <StyledBox tag="li">
      <Link
        href={link}
        styleSheet={{
          textDecoration: "none",
          fontSize: {
            xs: "14px",
            md: "18px",
          },
          height: "100%",
          width: "100%",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {title}
      </Link>
    </StyledBox>
  );
}
