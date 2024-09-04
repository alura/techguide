import { DocumentNode } from 'graphql';
export declare const collectTypesFromResponse: (response: object) => string[];
export declare const formatDocument: <T extends DocumentNode>(node: T) => T;
