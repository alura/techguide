import React from "react";
import { HomeGetAllGuidesQuery } from "@src/gql_types";
import { pageHOC } from "@src/wrappers/pageHOC";
import GuidesGrid from "./patterns/GuidesGrid";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { Box, Text } from "@src/components";
import { useI18n } from "@src/infra/i18n";

interface HomeScreenProps {
  guides: HomeGetAllGuidesQuery["guides"];
}

function HomeScreen({ guides }: HomeScreenProps) {
  const i18n = useI18n();
  const [filter, setFilter] = React.useState("all");

  return (
    <ScreenHeroContainer>
      <Box
        styleSheet={{
          marginTop: {
            xs: "40px",
            md: "64px",
          },
          maxWidth: {
            xs: "300px",
            md: "900px",
          },
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: {
            xs: "12px",
            md: "16px",
          },
        }}
      >
        {i18n.contentRaw("GUIDE.FILTERS").map(({ label, value }) => (
          <Text
            tag="label"
            key={value}
            tabIndex={0}
            htmlFor={`filterradio_${value}`}
            onKeyPress={(event) => {
              if (event.key === "Enter" || event.key === " ")
                event.target.click();
            }}
            styleSheet={{
              cursor: "pointer",
              fontSize: {
                xs: "14px",
                md: "16px",
              },
              borderRadius: "10px",
              padding: "14px",
              border: "1px solid #3D454B",
              fontWeight: "600",
              color: filter === value ? "#07101A" : "#FFFFFF",
              backgroundColor: filter === value ? "#34D5E3" : "transparent",
              transition: "all 0.2s ease-in-out",
              hover: {
                color: "#07101A",
                backgroundColor: "#34D5E3",
              },
            }}
          >
            <Box
              id={`filterradio_${value}`}
              tag="input"
              type="radio"
              name="guide-filter"
              checked={filter === value}
              value={value}
              onChange={(event) => setFilter(event.target.value)}
              styleSheet={{
                display: "none",
              }}
            />
            <span>{label}</span>
          </Text>
        ))}
      </Box>
      <GuidesGrid guides={guides} />
    </ScreenHeroContainer>
  );
}

export default pageHOC(HomeScreen);
