"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginUsageReportingDisabled = exports.makeHTTPRequestHeaders = exports.ApolloServerPluginUsageReporting = void 0;
const os_1 = __importDefault(require("os"));
const util_1 = require("util");
const zlib_1 = require("zlib");
const async_retry_1 = __importDefault(require("async-retry"));
const apollo_reporting_protobuf_1 = require("apollo-reporting-protobuf");
const apollo_server_env_1 = require("apollo-server-env");
const node_abort_controller_1 = require("node-abort-controller");
const apollo_server_types_1 = require("apollo-server-types");
const operationDerivedDataCache_1 = require("./operationDerivedDataCache");
const utils_usagereporting_1 = require("@apollo/utils.usagereporting");
const traceTreeBuilder_1 = require("../traceTreeBuilder");
const traceDetails_1 = require("./traceDetails");
const graphql_1 = require("graphql");
const schemaReporting_1 = require("../schemaReporting");
const stats_1 = require("./stats");
const defaultSendOperationsAsTrace_1 = require("./defaultSendOperationsAsTrace");
const utils_usagereporting_2 = require("@apollo/utils.usagereporting");
const gzipPromise = (0, util_1.promisify)(zlib_1.gzip);
const reportHeaderDefaults = {
    hostname: os_1.default.hostname(),
    agentVersion: `apollo-server-core@${require('../../../package.json').version}`,
    runtimeVersion: `node ${process.version}`,
    uname: `${os_1.default.platform()}, ${os_1.default.type()}, ${os_1.default.release()}, ${os_1.default.arch()})`,
};
function ApolloServerPluginUsageReporting(options = Object.create(null)) {
    const fieldLevelInstrumentationOption = options.fieldLevelInstrumentation;
    const fieldLevelInstrumentation = typeof fieldLevelInstrumentationOption === 'number'
        ? async () => Math.random() < fieldLevelInstrumentationOption
            ? 1 / fieldLevelInstrumentationOption
            : 0
        : fieldLevelInstrumentationOption
            ? fieldLevelInstrumentationOption
            : async () => true;
    let requestDidStartHandler;
    return {
        __internal_plugin_id__() {
            return 'UsageReporting';
        },
        async requestDidStart(requestContext) {
            if (!requestDidStartHandler) {
                throw Error('The usage reporting plugin has been asked to handle a request before the ' +
                    'server has started. See https://github.com/apollographql/apollo-server/issues/4588 ' +
                    'for more details.');
            }
            return requestDidStartHandler(requestContext);
        },
        async serverWillStart({ logger: serverLogger, apollo, serverlessFramework, }) {
            var _a, _b, _c, _d;
            const logger = (_a = options.logger) !== null && _a !== void 0 ? _a : serverLogger;
            const { key, graphRef } = apollo;
            if (!(key && graphRef)) {
                throw new Error("You've enabled usage reporting via ApolloServerPluginUsageReporting, " +
                    'but you also need to provide your Apollo API key and graph ref, via ' +
                    'the APOLLO_KEY/APOLLO_GRAPH_REF environment ' +
                    'variables or via `new ApolloServer({apollo: {key, graphRef})`.');
            }
            logger.info('Apollo usage reporting starting! See your graph at ' +
                `https://studio.apollographql.com/graph/${encodeURI(graphRef)}/`);
            const sendReportsImmediately = (_b = options.sendReportsImmediately) !== null && _b !== void 0 ? _b : serverlessFramework;
            let operationDerivedDataCache = null;
            const reportByExecutableSchemaId = new Map();
            const getReportWhichMustBeUsedImmediately = (executableSchemaId) => {
                const existing = reportByExecutableSchemaId.get(executableSchemaId);
                if (existing) {
                    return existing;
                }
                const report = new stats_1.OurReport(new apollo_reporting_protobuf_1.ReportHeader({
                    ...reportHeaderDefaults,
                    executableSchemaId,
                    graphRef,
                }));
                reportByExecutableSchemaId.set(executableSchemaId, report);
                return report;
            };
            const getAndDeleteReport = (executableSchemaId) => {
                const report = reportByExecutableSchemaId.get(executableSchemaId);
                if (report) {
                    reportByExecutableSchemaId.delete(executableSchemaId);
                    return report;
                }
                return null;
            };
            const overriddenExecutableSchemaId = options.overrideReportedSchema
                ? (0, schemaReporting_1.computeCoreSchemaHash)(options.overrideReportedSchema)
                : undefined;
            let lastSeenExecutableSchemaToId;
            let reportTimer;
            if (!sendReportsImmediately) {
                reportTimer = setInterval(() => sendAllReportsAndReportErrors(), options.reportIntervalMs || 10 * 1000);
            }
            let graphMightSupportTraces = true;
            const sendOperationAsTrace = (_c = options.experimental_sendOperationAsTrace) !== null && _c !== void 0 ? _c : (0, defaultSendOperationsAsTrace_1.defaultSendOperationsAsTrace)();
            const includeTracesContributingToStats = (_d = options.internal_includeTracesContributingToStats) !== null && _d !== void 0 ? _d : false;
            let stopped = false;
            function executableSchemaIdForSchema(schema) {
                if ((lastSeenExecutableSchemaToId === null || lastSeenExecutableSchemaToId === void 0 ? void 0 : lastSeenExecutableSchemaToId.executableSchema) === schema) {
                    return lastSeenExecutableSchemaToId.executableSchemaId;
                }
                const id = (0, schemaReporting_1.computeCoreSchemaHash)((0, graphql_1.printSchema)(schema));
                lastSeenExecutableSchemaToId = {
                    executableSchema: schema,
                    executableSchemaId: id,
                };
                return id;
            }
            async function sendAllReportsAndReportErrors() {
                await Promise.all([...reportByExecutableSchemaId.keys()].map((executableSchemaId) => sendReportAndReportErrors(executableSchemaId)));
            }
            async function sendReportAndReportErrors(executableSchemaId) {
                return sendReport(executableSchemaId).catch((err) => {
                    if (options.reportErrorFunction) {
                        options.reportErrorFunction(err);
                    }
                    else {
                        logger.error(err.message);
                    }
                });
            }
            const sendReport = async (executableSchemaId) => {
                var _a, _b;
                let report = getAndDeleteReport(executableSchemaId);
                if (!report ||
                    (Object.keys(report.tracesPerQuery).length === 0 &&
                        report.operationCount === 0)) {
                    return;
                }
                report.endTime = (0, traceTreeBuilder_1.dateToProtoTimestamp)(new Date());
                report.ensureCountsAreIntegers();
                const protobufError = apollo_reporting_protobuf_1.Report.verify(report);
                if (protobufError) {
                    throw new Error(`Error verifying report: ${protobufError}`);
                }
                let message = apollo_reporting_protobuf_1.Report.encode(report).finish();
                report = null;
                if (options.debugPrintReports) {
                    const decodedReport = apollo_reporting_protobuf_1.Report.decode(message);
                    logger.warn(`Apollo usage report: ${JSON.stringify(decodedReport.toJSON())}`);
                }
                const compressed = await gzipPromise(message);
                message = null;
                const fetcher = (_a = options.fetcher) !== null && _a !== void 0 ? _a : apollo_server_env_1.fetch;
                const response = await (0, async_retry_1.default)(async () => {
                    var _a;
                    const controller = new node_abort_controller_1.AbortController();
                    const abortTimeout = setTimeout(() => {
                        controller.abort();
                    }, (_a = options.requestTimeoutMs) !== null && _a !== void 0 ? _a : 30000);
                    let curResponse;
                    try {
                        const requestInit = {
                            method: 'POST',
                            headers: {
                                'user-agent': 'ApolloServerPluginUsageReporting',
                                'x-api-key': key,
                                'content-encoding': 'gzip',
                                accept: 'application/json',
                            },
                            body: compressed,
                            agent: options.requestAgent,
                        };
                        requestInit.signal = controller.signal;
                        curResponse = await fetcher((options.endpointUrl ||
                            'https://usage-reporting.api.apollographql.com') +
                            '/api/ingress/traces', requestInit);
                    }
                    finally {
                        clearTimeout(abortTimeout);
                    }
                    if (curResponse.status >= 500 && curResponse.status < 600) {
                        throw new Error(`HTTP status ${curResponse.status}, ${(await curResponse.text()) || '(no body)'}`);
                    }
                    else {
                        return curResponse;
                    }
                }, {
                    retries: (options.maxAttempts || 5) - 1,
                    minTimeout: options.minimumRetryDelayMs || 100,
                    factor: 2,
                }).catch((err) => {
                    throw new Error(`Error sending report to Apollo servers: ${err.message}`);
                });
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`Error sending report to Apollo servers: HTTP status ${response.status}, ${(await response.text()) || '(no body)'}`);
                }
                if (graphMightSupportTraces &&
                    response.status === 200 &&
                    ((_b = response.headers
                        .get('content-type')) === null || _b === void 0 ? void 0 : _b.match(/^\s*application\/json\s*(?:;|$)/i))) {
                    const body = await response.text();
                    let parsedBody;
                    try {
                        parsedBody = JSON.parse(body);
                    }
                    catch (e) {
                        throw new Error(`Error parsing response from Apollo servers: ${e}`);
                    }
                    if (parsedBody.tracesIgnored === true) {
                        logger.debug("This graph's organization does not have access to traces; sending all " +
                            'subsequent operations as traces.');
                        graphMightSupportTraces = false;
                    }
                }
                if (options.debugPrintReports) {
                    logger.warn(`Apollo usage report: status ${response.status}`);
                }
            };
            requestDidStartHandler = ({ logger: requestLogger, metrics, schema, request: { http, variables }, }) => {
                var _a;
                const logger = (_a = requestLogger !== null && requestLogger !== void 0 ? requestLogger : options.logger) !== null && _a !== void 0 ? _a : serverLogger;
                const treeBuilder = new traceTreeBuilder_1.TraceTreeBuilder({
                    rewriteError: options.rewriteError,
                    logger,
                });
                treeBuilder.startTiming();
                metrics.startHrTime = treeBuilder.startHrTime;
                let graphqlValidationFailure = false;
                let graphqlUnknownOperationName = false;
                let includeOperationInUsageReporting = null;
                if (http) {
                    treeBuilder.trace.http = new apollo_reporting_protobuf_1.Trace.HTTP({
                        method: apollo_reporting_protobuf_1.Trace.HTTP.Method[http.method] || apollo_reporting_protobuf_1.Trace.HTTP.Method.UNKNOWN,
                    });
                    if (options.sendHeaders) {
                        makeHTTPRequestHeaders(treeBuilder.trace.http, http.headers, options.sendHeaders);
                    }
                }
                async function maybeCallIncludeRequestHook(requestContext) {
                    if (includeOperationInUsageReporting !== null)
                        return;
                    if (typeof options.includeRequest !== 'function') {
                        includeOperationInUsageReporting = true;
                        return;
                    }
                    includeOperationInUsageReporting = await options.includeRequest(requestContext);
                    if (typeof includeOperationInUsageReporting !== 'boolean') {
                        logger.warn("The 'includeRequest' async predicate function must return a boolean value.");
                        includeOperationInUsageReporting = true;
                    }
                }
                let didResolveSource = false;
                return {
                    async didResolveSource(requestContext) {
                        didResolveSource = true;
                        if (metrics.persistedQueryHit) {
                            treeBuilder.trace.persistedQueryHit = true;
                        }
                        if (metrics.persistedQueryRegister) {
                            treeBuilder.trace.persistedQueryRegister = true;
                        }
                        if (variables) {
                            treeBuilder.trace.details = (0, traceDetails_1.makeTraceDetails)(variables, options.sendVariableValues, requestContext.source);
                        }
                        const clientInfo = (options.generateClientInfo || defaultGenerateClientInfo)(requestContext);
                        if (clientInfo) {
                            const { clientName, clientVersion } = clientInfo;
                            treeBuilder.trace.clientVersion = clientVersion || '';
                            treeBuilder.trace.clientName = clientName || '';
                        }
                    },
                    async validationDidStart() {
                        return async (validationErrors) => {
                            graphqlValidationFailure = validationErrors
                                ? validationErrors.length !== 0
                                : false;
                        };
                    },
                    async didResolveOperation(requestContext) {
                        graphqlUnknownOperationName =
                            requestContext.operation === undefined;
                        await maybeCallIncludeRequestHook(requestContext);
                        if (includeOperationInUsageReporting &&
                            !graphqlUnknownOperationName) {
                            if (metrics.captureTraces === undefined) {
                                const rawWeight = await fieldLevelInstrumentation(requestContext);
                                treeBuilder.trace.fieldExecutionWeight =
                                    typeof rawWeight === 'number' ? rawWeight : rawWeight ? 1 : 0;
                                metrics.captureTraces =
                                    !!treeBuilder.trace.fieldExecutionWeight;
                            }
                        }
                    },
                    async executionDidStart() {
                        if (!metrics.captureTraces)
                            return;
                        return {
                            willResolveField({ info }) {
                                return treeBuilder.willResolveField(info);
                            },
                        };
                    },
                    async willSendResponse(requestContext) {
                        if (!didResolveSource)
                            return;
                        if (requestContext.errors) {
                            treeBuilder.didEncounterErrors(requestContext.errors);
                        }
                        const resolvedOperation = !!requestContext.operation;
                        await maybeCallIncludeRequestHook(requestContext);
                        treeBuilder.stopTiming();
                        const executableSchemaId = overriddenExecutableSchemaId !== null && overriddenExecutableSchemaId !== void 0 ? overriddenExecutableSchemaId : executableSchemaIdForSchema(schema);
                        if (includeOperationInUsageReporting === false) {
                            if (resolvedOperation)
                                getReportWhichMustBeUsedImmediately(executableSchemaId)
                                    .operationCount++;
                            return;
                        }
                        treeBuilder.trace.fullQueryCacheHit = !!metrics.responseCacheHit;
                        treeBuilder.trace.forbiddenOperation = !!metrics.forbiddenOperation;
                        treeBuilder.trace.registeredOperation =
                            !!metrics.registeredOperation;
                        const policyIfCacheable = requestContext.overallCachePolicy.policyIfCacheable();
                        if (policyIfCacheable) {
                            treeBuilder.trace.cachePolicy = new apollo_reporting_protobuf_1.Trace.CachePolicy({
                                scope: policyIfCacheable.scope === apollo_server_types_1.CacheScope.Private
                                    ? apollo_reporting_protobuf_1.Trace.CachePolicy.Scope.PRIVATE
                                    : policyIfCacheable.scope === apollo_server_types_1.CacheScope.Public
                                        ? apollo_reporting_protobuf_1.Trace.CachePolicy.Scope.PUBLIC
                                        : apollo_reporting_protobuf_1.Trace.CachePolicy.Scope.UNKNOWN,
                                maxAgeNs: policyIfCacheable.maxAge * 1e9,
                            });
                        }
                        if (metrics.queryPlanTrace) {
                            treeBuilder.trace.queryPlan = metrics.queryPlanTrace;
                        }
                        addTrace().catch(logger.error);
                        async function addTrace() {
                            if (stopped) {
                                return;
                            }
                            await new Promise((res) => setImmediate(res));
                            const executableSchemaId = overriddenExecutableSchemaId !== null && overriddenExecutableSchemaId !== void 0 ? overriddenExecutableSchemaId : executableSchemaIdForSchema(schema);
                            const { trace } = treeBuilder;
                            let statsReportKey = undefined;
                            let referencedFieldsByType;
                            if (!requestContext.document) {
                                statsReportKey = `## GraphQLParseFailure\n`;
                            }
                            else if (graphqlValidationFailure) {
                                statsReportKey = `## GraphQLValidationFailure\n`;
                            }
                            else if (graphqlUnknownOperationName) {
                                statsReportKey = `## GraphQLUnknownOperationName\n`;
                            }
                            const isExecutable = statsReportKey === undefined;
                            if (statsReportKey) {
                                if (options.sendUnexecutableOperationDocuments) {
                                    trace.unexecutedOperationBody = requestContext.source;
                                    trace.unexecutedOperationName =
                                        requestContext.request.operationName || '';
                                }
                                referencedFieldsByType = Object.create(null);
                            }
                            else {
                                const operationDerivedData = getOperationDerivedData();
                                statsReportKey = `# ${requestContext.operationName || '-'}\n${operationDerivedData.signature}`;
                                referencedFieldsByType =
                                    operationDerivedData.referencedFieldsByType;
                            }
                            const protobufError = apollo_reporting_protobuf_1.Trace.verify(trace);
                            if (protobufError) {
                                throw new Error(`Error encoding trace: ${protobufError}`);
                            }
                            if (resolvedOperation) {
                                getReportWhichMustBeUsedImmediately(executableSchemaId)
                                    .operationCount++;
                            }
                            getReportWhichMustBeUsedImmediately(executableSchemaId).addTrace({
                                statsReportKey,
                                trace,
                                asTrace: graphMightSupportTraces &&
                                    (!isExecutable || !!metrics.captureTraces) &&
                                    sendOperationAsTrace(trace, statsReportKey),
                                includeTracesContributingToStats,
                                referencedFieldsByType,
                            });
                            if (sendReportsImmediately ||
                                getReportWhichMustBeUsedImmediately(executableSchemaId)
                                    .sizeEstimator.bytes >=
                                    (options.maxUncompressedReportSize || 4 * 1024 * 1024)) {
                                await sendReportAndReportErrors(executableSchemaId);
                            }
                        }
                        function getOperationDerivedData() {
                            var _a;
                            if (!requestContext.document) {
                                throw new Error('No document?');
                            }
                            const cacheKey = (0, operationDerivedDataCache_1.operationDerivedDataCacheKey)(requestContext.queryHash, requestContext.operationName || '');
                            if (!operationDerivedDataCache ||
                                operationDerivedDataCache.forSchema !== schema) {
                                operationDerivedDataCache = {
                                    forSchema: schema,
                                    cache: (0, operationDerivedDataCache_1.createOperationDerivedDataCache)({ logger }),
                                };
                            }
                            const cachedOperationDerivedData = operationDerivedDataCache.cache.get(cacheKey);
                            if (cachedOperationDerivedData) {
                                return cachedOperationDerivedData;
                            }
                            const generatedSignature = (options.calculateSignature || utils_usagereporting_1.usageReportingSignature)(requestContext.document, requestContext.operationName || '');
                            const generatedOperationDerivedData = {
                                signature: generatedSignature,
                                referencedFieldsByType: (0, utils_usagereporting_2.calculateReferencedFieldsByType)({
                                    document: requestContext.document,
                                    schema,
                                    resolvedOperationName: (_a = requestContext.operationName) !== null && _a !== void 0 ? _a : null,
                                }),
                            };
                            operationDerivedDataCache.cache.set(cacheKey, generatedOperationDerivedData);
                            return generatedOperationDerivedData;
                        }
                    },
                };
            };
            return {
                async serverWillStop() {
                    if (reportTimer) {
                        clearInterval(reportTimer);
                        reportTimer = undefined;
                    }
                    stopped = true;
                    await sendAllReportsAndReportErrors();
                },
            };
        },
    };
}
exports.ApolloServerPluginUsageReporting = ApolloServerPluginUsageReporting;
function makeHTTPRequestHeaders(http, headers, sendHeaders) {
    if (!sendHeaders ||
        ('none' in sendHeaders && sendHeaders.none) ||
        ('all' in sendHeaders && !sendHeaders.all)) {
        return;
    }
    for (const [key, value] of headers) {
        const lowerCaseKey = key.toLowerCase();
        if (('exceptNames' in sendHeaders &&
            sendHeaders.exceptNames.some((exceptHeader) => {
                return exceptHeader.toLowerCase() === lowerCaseKey;
            })) ||
            ('onlyNames' in sendHeaders &&
                !sendHeaders.onlyNames.some((header) => {
                    return header.toLowerCase() === lowerCaseKey;
                }))) {
            continue;
        }
        switch (key) {
            case 'authorization':
            case 'cookie':
            case 'set-cookie':
                break;
            default:
                http.requestHeaders[key] = new apollo_reporting_protobuf_1.Trace.HTTP.Values({
                    value: [value],
                });
        }
    }
}
exports.makeHTTPRequestHeaders = makeHTTPRequestHeaders;
function defaultGenerateClientInfo({ request }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const clientNameHeaderKey = 'apollographql-client-name';
    const clientVersionHeaderKey = 'apollographql-client-version';
    if (((_b = (_a = request.http) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.get(clientNameHeaderKey)) ||
        ((_d = (_c = request.http) === null || _c === void 0 ? void 0 : _c.headers) === null || _d === void 0 ? void 0 : _d.get(clientVersionHeaderKey))) {
        return {
            clientName: (_f = (_e = request.http) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f.get(clientNameHeaderKey),
            clientVersion: (_h = (_g = request.http) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h.get(clientVersionHeaderKey),
        };
    }
    else if ((_j = request.extensions) === null || _j === void 0 ? void 0 : _j.clientInfo) {
        return request.extensions.clientInfo;
    }
    else {
        return {};
    }
}
function ApolloServerPluginUsageReportingDisabled() {
    return {
        __internal_plugin_id__() {
            return 'UsageReporting';
        },
    };
}
exports.ApolloServerPluginUsageReportingDisabled = ApolloServerPluginUsageReportingDisabled;
//# sourceMappingURL=plugin.js.map