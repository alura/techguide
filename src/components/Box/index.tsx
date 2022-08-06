import React from "react";
import BaseComponent from "@src/theme/BaseComponent";
import { StyleSheet } from "@skynexui/responsive_stylesheet";

interface BoxProps {
  tag?: "main" | "div" | "article" | "section" | "ul" | string;
  children?: React.ReactNode;
  styleSheet?: StyleSheet;
  [key: string]: string | any;
}
const Box = React.forwardRef(
  ({ styleSheet, children, tag, ...props }: BoxProps, ref) => {
    const Tag = tag || "div";
    return (
      <BaseComponent ref={ref} as={Tag} styleSheet={styleSheet} {...props}>
        {children}
      </BaseComponent>
    );
  }
);

Box.displayName = "Box";

export default Box;
