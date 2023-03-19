import React from "react";
import { Box } from "@src/components";
import { StyleSheet } from "@skynexui/responsive_stylesheet";

interface ContainerProps {
  children: React.ReactNode;
  styleSheet: StyleSheet;
}
export function Container({ children, styleSheet }: ContainerProps) {
  return (
    <Box
      styleSheet={{
        width: "100%",
        maxWidth: "968px",
        margin: "0 auto",
        padding: "0 16px",
        ...styleSheet,
      }}
    >
      {children}
    </Box>
  );
}
