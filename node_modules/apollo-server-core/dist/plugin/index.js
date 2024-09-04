"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginLandingPageGraphQLPlayground = exports.ApolloServerPluginLandingPageProductionDefault = exports.ApolloServerPluginLandingPageLocalDefault = exports.ApolloServerPluginLandingPageDisabled = exports.ApolloServerPluginDrainHttpServer = exports.ApolloServerPluginCacheControlDisabled = exports.ApolloServerPluginCacheControl = exports.ApolloServerPluginInlineTraceDisabled = exports.ApolloServerPluginInlineTrace = exports.ApolloServerPluginSchemaReporting = exports.ApolloServerPluginUsageReportingDisabled = exports.ApolloServerPluginUsageReporting = void 0;
function ApolloServerPluginUsageReporting(options = Object.create(null)) {
    return require('./usageReporting').ApolloServerPluginUsageReporting(options);
}
exports.ApolloServerPluginUsageReporting = ApolloServerPluginUsageReporting;
function ApolloServerPluginUsageReportingDisabled() {
    return require('./usageReporting').ApolloServerPluginUsageReportingDisabled();
}
exports.ApolloServerPluginUsageReportingDisabled = ApolloServerPluginUsageReportingDisabled;
function ApolloServerPluginSchemaReporting(options = Object.create(null)) {
    return require('./schemaReporting').ApolloServerPluginSchemaReporting(options);
}
exports.ApolloServerPluginSchemaReporting = ApolloServerPluginSchemaReporting;
function ApolloServerPluginInlineTrace(options = Object.create(null)) {
    return require('./inlineTrace').ApolloServerPluginInlineTrace(options);
}
exports.ApolloServerPluginInlineTrace = ApolloServerPluginInlineTrace;
function ApolloServerPluginInlineTraceDisabled() {
    return require('./inlineTrace').ApolloServerPluginInlineTraceDisabled();
}
exports.ApolloServerPluginInlineTraceDisabled = ApolloServerPluginInlineTraceDisabled;
function ApolloServerPluginCacheControl(options = Object.create(null)) {
    return require('./cacheControl').ApolloServerPluginCacheControl(options);
}
exports.ApolloServerPluginCacheControl = ApolloServerPluginCacheControl;
function ApolloServerPluginCacheControlDisabled() {
    return require('./cacheControl').ApolloServerPluginCacheControlDisabled();
}
exports.ApolloServerPluginCacheControlDisabled = ApolloServerPluginCacheControlDisabled;
function ApolloServerPluginDrainHttpServer(options) {
    return require('./drainHttpServer').ApolloServerPluginDrainHttpServer(options);
}
exports.ApolloServerPluginDrainHttpServer = ApolloServerPluginDrainHttpServer;
function ApolloServerPluginLandingPageDisabled() {
    const plugin = {
        __internal_plugin_id__() {
            return 'LandingPageDisabled';
        },
    };
    return plugin;
}
exports.ApolloServerPluginLandingPageDisabled = ApolloServerPluginLandingPageDisabled;
function ApolloServerPluginLandingPageLocalDefault(options) {
    return require('./landingPage/default').ApolloServerPluginLandingPageLocalDefault(options);
}
exports.ApolloServerPluginLandingPageLocalDefault = ApolloServerPluginLandingPageLocalDefault;
function ApolloServerPluginLandingPageProductionDefault(options) {
    return require('./landingPage/default').ApolloServerPluginLandingPageProductionDefault(options);
}
exports.ApolloServerPluginLandingPageProductionDefault = ApolloServerPluginLandingPageProductionDefault;
function ApolloServerPluginLandingPageGraphQLPlayground(options = Object.create(null)) {
    return require('./landingPage/graphqlPlayground').ApolloServerPluginLandingPageGraphQLPlayground(options);
}
exports.ApolloServerPluginLandingPageGraphQLPlayground = ApolloServerPluginLandingPageGraphQLPlayground;
//# sourceMappingURL=index.js.map