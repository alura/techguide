import { StyleSheet } from "@skynexui/responsive_stylesheet";
import BaseComponent from "@src/theme/BaseComponent";
import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  styleSheet?: StyleSheet;
}
export default function Image({ src, alt, styleSheet, ...props }: ImageProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <BaseComponent
      as="img"
      src={src}
      alt={alt}
      styleSheet={{ ...styleSheet, display: "inline-block" }}
      {...props}
    />
  );
}
