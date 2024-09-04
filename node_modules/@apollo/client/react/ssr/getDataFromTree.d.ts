import type * as ReactTypes from "react";
export declare function getDataFromTree(tree: ReactTypes.ReactNode, context?: {
    [key: string]: any;
}): Promise<string>;
export type GetMarkupFromTreeOptions = {
    tree: ReactTypes.ReactNode;
    context?: {
        [key: string]: any;
    };
    renderFunction?: (tree: ReactTypes.ReactElement<any>) => string | PromiseLike<string>;
};
export declare function getMarkupFromTree({ tree, context, renderFunction, }: GetMarkupFromTreeOptions): Promise<string>;
//# sourceMappingURL=getDataFromTree.d.ts.map