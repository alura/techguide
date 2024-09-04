import { fetch } from 'apollo-server-env';
import type { Logger } from '@apollo/utils.logger';
import type { SchemaReport, ReportSchemaResponse } from './generated/operations';
export declare const schemaReportGql: string;
export declare class SchemaReporter {
    private readonly schemaReport;
    private readonly coreSchema;
    private readonly endpointUrl;
    private readonly logger;
    private readonly initialReportingDelayInMs;
    private readonly fallbackReportingDelayInMs;
    private readonly fetcher;
    private isStopped;
    private pollTimer?;
    private readonly headers;
    constructor(options: {
        schemaReport: SchemaReport;
        coreSchema: string;
        apiKey: string;
        endpointUrl: string | undefined;
        logger: Logger;
        initialReportingDelayInMs: number;
        fallbackReportingDelayInMs: number;
        fetcher?: typeof fetch;
    });
    stopped(): Boolean;
    start(): void;
    stop(): void;
    private sendOneReportAndScheduleNext;
    reportSchema(withCoreSchema: boolean): Promise<ReportSchemaResponse | null>;
    private apolloQuery;
}
//# sourceMappingURL=schemaReporter.d.ts.map