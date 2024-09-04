import React, { ComponentType, ExoticComponent } from 'react';
export declare type TProps = {
    allowUnknownElements?: boolean;
    autoCloseVoidElements?: boolean;
    bindings?: {
        [key: string]: unknown;
    };
    blacklistedAttrs?: Array<string | RegExp>;
    blacklistedTags?: string[];
    className?: string;
    components?: Record<string, ComponentType | ExoticComponent>;
    componentsOnly?: boolean;
    disableFragments?: boolean;
    disableKeyGeneration?: boolean;
    jsx?: string;
    onError?: (error: Error) => void;
    showWarnings?: boolean;
    renderError?: (props: {
        error: string;
    }) => JSX.Element | null;
    renderInWrapper?: boolean;
    renderUnrecognized?: (tagName: string) => JSX.Element | null;
};
export default class JsxParser extends React.Component<TProps> {
    #private;
    static displayName: string;
    static defaultProps: TProps;
    private ParsedChildren;
    render: () => JSX.Element;
}
