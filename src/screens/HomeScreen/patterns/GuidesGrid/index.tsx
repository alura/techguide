import React from "react";
import { Box, Link } from "@src/components";
import { HomeGetAllGuidesQuery } from "@src/gql_types";

interface GuidesGridProps {
  guides: HomeGetAllGuidesQuery["guides"];
}
export default function GuidesGrid({ guides }: GuidesGridProps) {
  return (
    <ListOfGuides>
      {[...guides].map((guide) => (
        <Guide key={guide.slug}>
          <Link
            href={`/path/${guide.slug}`}
            styleSheet={{
              display: "flex",
              textDecoration: "none",
              flex: "1",
              width: "100%",
              justifyContent: "center",
              hover: { opacity: "1 !important" },
            }}
          >
            {guide.name}
          </Link>
        </Guide>
      ))}
    </ListOfGuides>
  );
}

function ListOfGuides({ children }: { children: React.ReactNode }) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        gridTemplateColumns: {
          xs: "initial",
          md: "repeat(4,1fr)",
        },
        gridColumnGap: {
          xs: "initial",
          md: "16px",
        },
        gridRowGap: {
          xs: "initial",
          md: "16px",
        },
        color: "#FFFFFF",
        marginTop: "3.125em",
        marginHorizontal: "auto",
        borderRadius: "0.875rem",
        position: "relative",
        padding: {
          xs: "1.375em",
          md: "1.5625em 1.5em",
        },
        maxWidth: {
          xs: "275px",
          md: "800px",
        },
        width: "100%",
        zIndex: "2",
        border: "1px solid #6affff",
      }}
    >
      {children}
    </Box>
  );
}

function Guide({ children }: { children: React.ReactNode }) {
  return (
    <Box
      tag="li"
      styleSheet={{
        display: "flex",
        flex: {
          xs: "0 0 calc(100% - 16px)",
          md: "0 0 calc(25% - 16px)",
        },
        alignItems: "center",
        height: "7.9706rem",
        fontWeight: "600",
        borderRadius: "14px",
        boxShadow: "inset 0 0 0 1px #FFFFFF",
        transition: "0.2s",
        textAlign: "center",
        marginBottom: "0.5em",
        fontSize: "0.875rem",
        background:
          "linear-gradient(145.25deg, transparent 4.09%, transparent 81.45%)",
        hover: {
          background:
            "linear-gradient(145.25deg, #6affff 4.09%, #00aec9 81.45%)",
          boxShadow: "0px 11px 51px #127797",
          borderRadius: "14px",
          cursor: "pointer",
        },
      }}
    >
      {children}
    </Box>
  );
}
