import React from "react";
import { Box } from "@src/components";

export default function TShape({
  leftBlock,
  expertiseFirst,
  expertiseSecond,
  expertiseThird,
  rightBlock,
}: any) {
  return (
    <Box
      styleSheet={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      {/* First Line */}
      <Box
        styleSheet={{
          aspectRatio: "1/1",
          alignItems: "center",
        }}
      >
        <h2>{leftBlock.name}</h2>
        <Box
          tag="svg"
          styleSheet={{ flex: 1, width: "100%" }}
          viewBox="0 0 445 445"
          ref={leftBlock.svg}
        />
      </Box>
      <Box
        styleSheet={{
          aspectRatio: "1/1",
          alignItems: "center",
        }}
      >
        <h2>{expertiseFirst.name}</h2>
        <Box
          tag="svg"
          styleSheet={{ flex: 1, width: "100%" }}
          viewBox="0 0 445 445"
          ref={expertiseFirst.svg}
        />
      </Box>

      <Box
        styleSheet={{
          aspectRatio: "1/1",
          alignItems: "center",
        }}
      >
        <h2>{rightBlock.name}</h2>

        <Box
          tag="svg"
          styleSheet={{ flex: 1, width: "100%" }}
          viewBox="0 0 445 445"
          ref={rightBlock.svg}
        />
      </Box>
      {/* Second Line */}
      <Box styleSheet={{ aspectRatio: "1/1" }} />
      <Box
        styleSheet={{
          aspectRatio: "1/1",
          alignItems: "center",
        }}
      >
        <h2>{expertiseSecond.name}</h2>
        <Box
          tag="svg"
          styleSheet={{ flex: 1, width: "100%" }}
          viewBox="0 0 445 445"
          ref={expertiseSecond.svg}
        />
      </Box>
      <Box styleSheet={{ aspectRatio: "1/1" }} />
      {/* Third Line */}
      <Box styleSheet={{ aspectRatio: "1/1" }} />
      <Box
        styleSheet={{
          aspectRatio: "1/1",
          alignItems: "center",
        }}
      >
        <h2>{expertiseThird.name}</h2>
        <Box
          tag="svg"
          styleSheet={{ flex: 1, width: "100%" }}
          viewBox="0 0 445 445"
          ref={expertiseThird.svg}
        />
      </Box>
      <Box styleSheet={{ aspectRatio: "1/1" }} />
    </Box>
  );
}
