"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaIsFederated = void 0;
const graphql_1 = require("graphql");
function schemaIsFederated(schema) {
    const serviceType = schema.getType('_Service');
    if (!(0, graphql_1.isObjectType)(serviceType)) {
        return false;
    }
    const sdlField = serviceType.getFields().sdl;
    if (!sdlField) {
        return false;
    }
    const sdlFieldType = sdlField.type;
    if (!(0, graphql_1.isScalarType)(sdlFieldType)) {
        return false;
    }
    return sdlFieldType.name == 'String';
}
exports.schemaIsFederated = schemaIsFederated;
//# sourceMappingURL=schemaIsFederated.js.map