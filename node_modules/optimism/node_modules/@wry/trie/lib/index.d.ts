export declare class Trie<Data> {
    private weakness;
    private makeData;
    private weak?;
    private strong?;
    private data?;
    constructor(weakness?: boolean, makeData?: (array: any[]) => Data);
    lookup<T extends any[]>(...array: T): Data;
    lookupArray<T extends IArguments | any[]>(array: T): Data;
    peek<T extends any[]>(...array: T): Data | undefined;
    peekArray<T extends IArguments | any[]>(array: T): Data | undefined;
    private getChildTrie;
}
