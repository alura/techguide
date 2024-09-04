import { UnnormalizedTypeDefPointer } from '@graphql-tools/load';
import { Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema } from 'graphql';
export declare const defaultSchemaLoadOptions: {
    assumeValidSDL: boolean;
    sort: boolean;
    convertExtensions: boolean;
    includeSources: boolean;
};
export declare const defaultDocumentsLoadOptions: {
    sort: boolean;
    skipGraphQLImport: boolean;
};
export declare function loadSchema(schemaPointers: UnnormalizedTypeDefPointer, config: Types.Config): Promise<GraphQLSchema>;
export declare function loadDocuments(documentPointers: UnnormalizedTypeDefPointer | UnnormalizedTypeDefPointer[], config: Types.Config): Promise<Types.DocumentFile[]>;
