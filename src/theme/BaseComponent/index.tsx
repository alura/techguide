import React from "react";
import styled from "styled-components";
import { parseStyleSheet, StyleSheet } from "@skynexui/responsive_stylesheet";

const StyledBaseComponent = styled.div<any>`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  flex-shrink: 0;
  ${({ styleSheet, $uniqueId }) => parseStyleSheet(styleSheet, $uniqueId)}
`;

interface BaseComponentProps {
  styleSheet?: StyleSheet;
  [key: string]: any;
}
const BaseComponent = React.forwardRef<any, BaseComponentProps>(
  (props, ref) => {
    const id = React.useId().replaceAll(":", "");

    return (
      <StyledBaseComponent ref={ref} $uniqueId={id} className={id} {...props} />
    );
  }
);
BaseComponent.defaultProps = {
  styleSheet: {},
};

BaseComponent.displayName = "StyledBaseComponent";

export default BaseComponent;
