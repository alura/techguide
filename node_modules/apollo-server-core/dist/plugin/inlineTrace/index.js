"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginInlineTraceDisabled = exports.ApolloServerPluginInlineTrace = void 0;
const apollo_reporting_protobuf_1 = require("apollo-reporting-protobuf");
const traceTreeBuilder_1 = require("../traceTreeBuilder");
const schemaIsFederated_1 = require("../schemaIsFederated");
function ApolloServerPluginInlineTrace(options = Object.create(null)) {
    let enabled = options.__onlyIfSchemaIsFederated ? null : true;
    return {
        __internal_plugin_id__() {
            return 'InlineTrace';
        },
        async serverWillStart({ schema, logger }) {
            if (enabled === null) {
                enabled = (0, schemaIsFederated_1.schemaIsFederated)(schema);
                if (enabled) {
                    logger.info('Enabling inline tracing for this federated service. To disable, use ' +
                        'ApolloServerPluginInlineTraceDisabled.');
                }
            }
        },
        async requestDidStart({ request: { http }, metrics }) {
            if (!enabled) {
                return;
            }
            const treeBuilder = new traceTreeBuilder_1.TraceTreeBuilder({
                rewriteError: options.rewriteError,
            });
            if ((http === null || http === void 0 ? void 0 : http.headers.get('apollo-federation-include-trace')) !== 'ftv1') {
                return;
            }
            if (metrics.captureTraces === false) {
                return;
            }
            metrics.captureTraces = true;
            treeBuilder.startTiming();
            return {
                async executionDidStart() {
                    return {
                        willResolveField({ info }) {
                            return treeBuilder.willResolveField(info);
                        },
                    };
                },
                async didEncounterErrors({ errors }) {
                    treeBuilder.didEncounterErrors(errors);
                },
                async willSendResponse({ response }) {
                    treeBuilder.stopTiming();
                    if (metrics.queryPlanTrace) {
                        treeBuilder.trace.queryPlan = metrics.queryPlanTrace;
                    }
                    const encodedUint8Array = apollo_reporting_protobuf_1.Trace.encode(treeBuilder.trace).finish();
                    const encodedBuffer = Buffer.from(encodedUint8Array, encodedUint8Array.byteOffset, encodedUint8Array.byteLength);
                    const extensions = response.extensions || (response.extensions = Object.create(null));
                    if (typeof extensions.ftv1 !== 'undefined') {
                        throw new Error('The `ftv1` extension was already present.');
                    }
                    extensions.ftv1 = encodedBuffer.toString('base64');
                },
            };
        },
    };
}
exports.ApolloServerPluginInlineTrace = ApolloServerPluginInlineTrace;
function ApolloServerPluginInlineTraceDisabled() {
    return {
        __internal_plugin_id__() {
            return 'InlineTrace';
        },
    };
}
exports.ApolloServerPluginInlineTraceDisabled = ApolloServerPluginInlineTraceDisabled;
//# sourceMappingURL=index.js.map