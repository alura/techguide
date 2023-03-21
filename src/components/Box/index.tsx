import React from "react";
import BaseComponent from "@src/theme/BaseComponent";
import { StyleSheet } from "@skynexui/responsive_stylesheet";

interface BoxProps {
  id?: string;
  tag?: "main" | "div" | "article" | "section" | "ul" | string;
  children?: React.ReactNode;
  className?: string;
  styleSheet?: StyleSheet;
  viewBox?: string;
  xmlns?: string;
  type?: string;
  value?: string;
  name?: string;
  checked?: boolean;
  // eslint-disable-next-line no-unused-vars
  onKeyPress?: (event: any) => void;
  // eslint-disable-next-line no-unused-vars
  onChange?: (event: any) => void;
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: any) => void;
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: any) => void;
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
