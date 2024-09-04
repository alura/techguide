"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCoreSchemaHash = exports.ApolloServerPluginSchemaReporting = void 0;
const os_1 = __importDefault(require("os"));
const uuid_1 = require("uuid");
const graphql_1 = require("graphql");
const schemaReporter_1 = require("./schemaReporter");
const createSHA_1 = __importDefault(require("../../utils/createSHA"));
const schemaIsFederated_1 = require("../schemaIsFederated");
function ApolloServerPluginSchemaReporting({ initialDelayMaxMs, overrideReportedSchema, endpointUrl, fetcher, } = Object.create(null)) {
    const bootId = (0, uuid_1.v4)();
    return {
        __internal_plugin_id__() {
            return 'SchemaReporting';
        },
        async serverWillStart({ apollo, schema, logger }) {
            const { key, graphRef } = apollo;
            if (!key) {
                throw Error('To use ApolloServerPluginSchemaReporting, you must provide an Apollo API ' +
                    'key, via the APOLLO_KEY environment variable or via `new ApolloServer({apollo: {key})`');
            }
            if (!graphRef) {
                throw Error('To use ApolloServerPluginSchemaReporting, you must provide your graph ref (eg, ' +
                    "'my-graph-id@my-graph-variant'). Try setting the APOLLO_GRAPH_REF environment " +
                    'variable or passing `new ApolloServer({apollo: {graphRef}})`.');
            }
            if (overrideReportedSchema) {
                try {
                    const validationErrors = (0, graphql_1.validateSchema)((0, graphql_1.buildSchema)(overrideReportedSchema, { noLocation: true }));
                    if (validationErrors.length) {
                        throw new Error(validationErrors.map((error) => error.message).join('\n'));
                    }
                }
                catch (err) {
                    throw new Error('The schema provided to overrideReportedSchema failed to parse or ' +
                        `validate: ${err.message}`);
                }
            }
            if ((0, schemaIsFederated_1.schemaIsFederated)(schema)) {
                throw Error([
                    'Schema reporting is not yet compatible with federated services.',
                    "If you're interested in using schema reporting with federated",
                    'services, please contact Apollo support. To set up managed federation, see',
                    'https://go.apollo.dev/s/managed-federation',
                ].join(' '));
            }
            if (endpointUrl !== undefined) {
                logger.info(`Apollo schema reporting: schema reporting URL override: ${endpointUrl}`);
            }
            const baseSchemaReport = {
                bootId,
                graphRef,
                platform: process.env.APOLLO_SERVER_PLATFORM || 'local',
                runtimeVersion: `node ${process.version}`,
                userVersion: process.env.APOLLO_SERVER_USER_VERSION,
                serverId: process.env.APOLLO_SERVER_ID || process.env.HOSTNAME || os_1.default.hostname(),
                libraryVersion: `apollo-server-core@${require('../../../package.json').version}`,
            };
            let currentSchemaReporter;
            return {
                schemaDidLoadOrUpdate({ apiSchema, coreSupergraphSdl }) {
                    var _a;
                    if (overrideReportedSchema !== undefined) {
                        if (currentSchemaReporter) {
                            return;
                        }
                        else {
                            logger.info('Apollo schema reporting: schema to report has been overridden');
                        }
                    }
                    const coreSchema = (_a = overrideReportedSchema !== null && overrideReportedSchema !== void 0 ? overrideReportedSchema : coreSupergraphSdl) !== null && _a !== void 0 ? _a : (0, graphql_1.printSchema)(apiSchema);
                    const coreSchemaHash = computeCoreSchemaHash(coreSchema);
                    const schemaReport = {
                        ...baseSchemaReport,
                        coreSchemaHash,
                    };
                    currentSchemaReporter === null || currentSchemaReporter === void 0 ? void 0 : currentSchemaReporter.stop();
                    currentSchemaReporter = new schemaReporter_1.SchemaReporter({
                        schemaReport,
                        coreSchema,
                        apiKey: key,
                        endpointUrl,
                        logger,
                        initialReportingDelayInMs: Math.floor(Math.random() * (initialDelayMaxMs !== null && initialDelayMaxMs !== void 0 ? initialDelayMaxMs : 10000)),
                        fallbackReportingDelayInMs: 20000,
                        fetcher,
                    });
                    currentSchemaReporter.start();
                    logger.info('Apollo schema reporting: reporting a new schema to Studio! See your graph at ' +
                        `https://studio.apollographql.com/graph/${encodeURI(graphRef)}/ with server info ${JSON.stringify(schemaReport)}`);
                },
                async serverWillStop() {
                    currentSchemaReporter === null || currentSchemaReporter === void 0 ? void 0 : currentSchemaReporter.stop();
                },
            };
        },
    };
}
exports.ApolloServerPluginSchemaReporting = ApolloServerPluginSchemaReporting;
function computeCoreSchemaHash(schema) {
    return (0, createSHA_1.default)('sha256').update(schema).digest('hex');
}
exports.computeCoreSchemaHash = computeCoreSchemaHash;
//# sourceMappingURL=index.js.map