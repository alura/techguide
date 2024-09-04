import LRUCache from 'lru-cache';
import type { Logger } from '@apollo/utils.logger';
import type { ReferencedFieldsByType } from '@apollo/utils.usagereporting';
export interface OperationDerivedData {
    signature: string;
    referencedFieldsByType: ReferencedFieldsByType;
}
export declare function createOperationDerivedDataCache({ logger, }: {
    logger: Logger;
}): LRUCache<string, OperationDerivedData>;
export declare function operationDerivedDataCacheKey(queryHash: string, operationName: string): string;
//# sourceMappingURL=operationDerivedDataCache.d.ts.map