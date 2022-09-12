import { StyleSheet } from "@skynexui/responsive_stylesheet";
import React from "react";
import Box from "../Box";
import * as icons from "./icons/_index";

interface IconName {
  name: keyof typeof icons;
  styleSheet?: StyleSheet;
}
export default function Icon({ name, styleSheet }: IconName) {
  const CurrentIcon = icons[name] || icons.icon_default;
  return (
    <Box
      tag="svg"
      styleSheet={{
        width: "1.6ch",
        height: "1.6ch",
        ...styleSheet,
      }}
      {...{
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
      }}
    >
      <title>{name}</title>
      <CurrentIcon />
    </Box>
  );
}
