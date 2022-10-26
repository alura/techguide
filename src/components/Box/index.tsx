import React from "react";
import BaseComponent from "@src/theme/BaseComponent";
import { StyleSheet } from "@skynexui/responsive_stylesheet";

interface BoxProps {
  tag?: "main" | "div" | "article" | "section" | "ul" | string;
  children?: React.ReactNode;
  className?: string;
  styleSheet?: StyleSheet;
  viewBox?: string;
  xmlns?: string;
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: any) => void;
  id?: string;
  role?: string;
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
