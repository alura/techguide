"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayIsTooOldError = exports.SchemaManager = void 0;
class SchemaManager {
    constructor(options) {
        this.onSchemaLoadOrUpdateListeners = new Set();
        this.isStopped = false;
        this.logger = options.logger;
        this.schemaDerivedDataProvider = options.schemaDerivedDataProvider;
        if ('gateway' in options) {
            this.modeSpecificState = {
                mode: 'gateway',
                gateway: options.gateway,
                apolloConfig: options.apolloConfig,
            };
        }
        else {
            this.modeSpecificState = {
                mode: 'schema',
                apiSchema: options.apiSchema,
                schemaDerivedData: options.schemaDerivedDataProvider(options.apiSchema),
            };
        }
    }
    async start() {
        if (this.modeSpecificState.mode === 'gateway') {
            const gateway = this.modeSpecificState.gateway;
            if (gateway.onSchemaLoadOrUpdate) {
                this.modeSpecificState.unsubscribeFromGateway =
                    gateway.onSchemaLoadOrUpdate((schemaContext) => {
                        this.processSchemaLoadOrUpdateEvent(schemaContext);
                    });
            }
            else if (gateway.onSchemaChange) {
                this.modeSpecificState.unsubscribeFromGateway = gateway.onSchemaChange((apiSchema) => {
                    this.processSchemaLoadOrUpdateEvent({ apiSchema });
                });
            }
            else {
                throw new Error("Unexpectedly couldn't find onSchemaChange or onSchemaLoadOrUpdate on gateway");
            }
            const config = await this.modeSpecificState.gateway.load({
                apollo: this.modeSpecificState.apolloConfig,
            });
            if (!this.schemaDerivedData) {
                this.processSchemaLoadOrUpdateEvent({ apiSchema: config.schema });
            }
            return config.executor;
        }
        else {
            this.processSchemaLoadOrUpdateEvent({
                apiSchema: this.modeSpecificState.apiSchema,
            }, this.modeSpecificState.schemaDerivedData);
            return null;
        }
    }
    onSchemaLoadOrUpdate(callback) {
        if (this.modeSpecificState.mode === 'gateway' &&
            !this.modeSpecificState.gateway.onSchemaLoadOrUpdate) {
            throw new GatewayIsTooOldError([
                `Your gateway is too old to register a 'onSchemaLoadOrUpdate' listener.`,
                `Please update your version of @apollo/gateway to at least 0.35.0.`,
            ].join(' '));
        }
        else {
            if (!this.schemaContext) {
                throw new Error('You must call start() before onSchemaLoadOrUpdate()');
            }
            if (!this.isStopped) {
                try {
                    callback(this.schemaContext);
                }
                catch (e) {
                    throw new Error(`An error was thrown from an 'onSchemaLoadOrUpdate' listener: ${e.message}`);
                }
            }
            this.onSchemaLoadOrUpdateListeners.add(callback);
        }
        return () => {
            this.onSchemaLoadOrUpdateListeners.delete(callback);
        };
    }
    getSchemaDerivedData() {
        if (!this.schemaDerivedData) {
            throw new Error('You must call start() before getSchemaDerivedData()');
        }
        return this.schemaDerivedData;
    }
    async stop() {
        var _a, _b, _c, _d;
        this.isStopped = true;
        if (this.modeSpecificState.mode === 'gateway') {
            (_b = (_a = this.modeSpecificState).unsubscribeFromGateway) === null || _b === void 0 ? void 0 : _b.call(_a);
            await ((_d = (_c = this.modeSpecificState.gateway).stop) === null || _d === void 0 ? void 0 : _d.call(_c));
        }
    }
    processSchemaLoadOrUpdateEvent(schemaContext, schemaDerivedData) {
        if (!this.isStopped) {
            this.schemaDerivedData =
                schemaDerivedData !== null && schemaDerivedData !== void 0 ? schemaDerivedData : this.schemaDerivedDataProvider(schemaContext.apiSchema);
            this.schemaContext = schemaContext;
            this.onSchemaLoadOrUpdateListeners.forEach((listener) => {
                try {
                    listener(schemaContext);
                }
                catch (e) {
                    this.logger.error("An error was thrown from an 'onSchemaLoadOrUpdate' listener");
                    this.logger.error(e);
                }
            });
        }
    }
}
exports.SchemaManager = SchemaManager;
class GatewayIsTooOldError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.GatewayIsTooOldError = GatewayIsTooOldError;
//# sourceMappingURL=schemaManager.js.map