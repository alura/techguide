import { DefinitionNode, DocumentNode } from 'graphql';
export type VisitedFilesMap = Map<string, Map<string, Set<DefinitionNode>>>;
/**
 * Loads the GraphQL document and recursively resolves all the imports
 * and copies them into the final document.
 * processImport does not merge the typeDefs as designed ( https://github.com/ardatan/graphql-tools/issues/2980#issuecomment-1003692728 )
 */
export declare function processImport(filePath: string, cwd?: string, predefinedImports?: Record<string, string>, visitedFiles?: VisitedFilesMap): DocumentNode;
export declare function extractDependencies(filePath: string, fileContents: string): {
    definitionsByName: Map<string, Set<DefinitionNode>>;
    dependenciesByDefinitionName: Map<string, Set<string>>;
};
export declare function processImports(importLines: string[], filePath: string, visitedFiles: VisitedFilesMap, predefinedImports: Record<string, string>): {
    allImportedDefinitionsMap: Map<string, Set<DefinitionNode>>;
    potentialTransitiveDefinitionsMap: Map<string, Set<DefinitionNode>>;
};
/**
 * Splits the contents of a GraphQL file into lines that are imports
 * and other lines which define the actual GraphQL document.
 */
export declare function extractImportLines(fileContent: string): {
    importLines: string[];
    otherLines: string;
};
/**
 * Parses an import line, returning a list of entities imported and the file
 * from which they are imported.
 *
 * Throws if the import line does not have a correct format.
 */
export declare function parseImportLine(importLine: string): {
    imports: string[];
    from: string;
};
