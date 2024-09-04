"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaReporter = exports.schemaReportGql = void 0;
const gql_1 = require("../../gql");
const apollo_server_env_1 = require("apollo-server-env");
const graphql_1 = require("graphql");
exports.schemaReportGql = (0, graphql_1.print)((0, gql_1.gql) `
  mutation SchemaReport($report: SchemaReport!, $coreSchema: String) {
    reportSchema(report: $report, coreSchema: $coreSchema) {
      __typename
      ... on ReportSchemaError {
        message
        code
      }
      ... on ReportSchemaResponse {
        inSeconds
        withCoreSchema
      }
    }
  }
`);
class SchemaReporter {
    constructor(options) {
        var _a;
        this.headers = new apollo_server_env_1.Headers();
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('x-api-key', options.apiKey);
        this.headers.set('apollographql-client-name', 'ApolloServerPluginSchemaReporting');
        this.headers.set('apollographql-client-version', require('../../../package.json').version);
        this.endpointUrl =
            options.endpointUrl ||
                'https://schema-reporting.api.apollographql.com/api/graphql';
        this.schemaReport = options.schemaReport;
        this.coreSchema = options.coreSchema;
        this.isStopped = false;
        this.logger = options.logger;
        this.initialReportingDelayInMs = options.initialReportingDelayInMs;
        this.fallbackReportingDelayInMs = options.fallbackReportingDelayInMs;
        this.fetcher = (_a = options.fetcher) !== null && _a !== void 0 ? _a : apollo_server_env_1.fetch;
    }
    stopped() {
        return this.isStopped;
    }
    start() {
        this.pollTimer = setTimeout(() => this.sendOneReportAndScheduleNext(false), this.initialReportingDelayInMs);
    }
    stop() {
        this.isStopped = true;
        if (this.pollTimer) {
            clearTimeout(this.pollTimer);
            this.pollTimer = undefined;
        }
    }
    async sendOneReportAndScheduleNext(sendNextWithCoreSchema) {
        this.pollTimer = undefined;
        if (this.stopped())
            return;
        try {
            const result = await this.reportSchema(sendNextWithCoreSchema);
            if (!result) {
                return;
            }
            if (!this.stopped()) {
                this.pollTimer = setTimeout(() => this.sendOneReportAndScheduleNext(result.withCoreSchema), result.inSeconds * 1000);
            }
            return;
        }
        catch (error) {
            this.logger.error(`Error reporting server info to Apollo during schema reporting: ${error}`);
            if (!this.stopped()) {
                this.pollTimer = setTimeout(() => this.sendOneReportAndScheduleNext(false), this.fallbackReportingDelayInMs);
            }
        }
    }
    async reportSchema(withCoreSchema) {
        const { data, errors } = await this.apolloQuery({
            report: this.schemaReport,
            coreSchema: withCoreSchema ? this.coreSchema : null,
        });
        if (errors) {
            throw new Error(errors.map((x) => x.message).join('\n'));
        }
        function msgForUnexpectedResponse(data) {
            return [
                'Unexpected response shape from Apollo when',
                'reporting schema. If this continues, please reach',
                'out to support@apollographql.com.',
                'Received response:',
                JSON.stringify(data),
            ].join(' ');
        }
        if (!data || !data.reportSchema) {
            throw new Error(msgForUnexpectedResponse(data));
        }
        if (data.reportSchema.__typename === 'ReportSchemaResponse') {
            return data.reportSchema;
        }
        else if (data.reportSchema.__typename === 'ReportSchemaError') {
            this.logger.error([
                'Received input validation error from Apollo:',
                data.reportSchema.message,
                'Stopping reporting. Please fix the input errors.',
            ].join(' '));
            this.stop();
            return null;
        }
        throw new Error(msgForUnexpectedResponse(data));
    }
    async apolloQuery(variables) {
        const request = {
            query: exports.schemaReportGql,
            variables,
        };
        const httpRequest = new apollo_server_env_1.Request(this.endpointUrl, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(request),
        });
        const httpResponse = await this.fetcher(httpRequest);
        if (!httpResponse.ok) {
            throw new Error([
                `An unexpected HTTP status code (${httpResponse.status}) was`,
                'encountered during schema reporting.',
            ].join(' '));
        }
        try {
            return await httpResponse.json();
        }
        catch (error) {
            throw new Error([
                "Couldn't report schema to Apollo.",
                'Parsing response as JSON failed.',
                'If this continues please reach out to support@apollographql.com',
                error,
            ].join(' '));
        }
    }
}
exports.SchemaReporter = SchemaReporter;
//# sourceMappingURL=schemaReporter.js.map