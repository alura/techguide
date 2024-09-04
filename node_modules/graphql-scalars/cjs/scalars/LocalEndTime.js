"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLocalEndTime = void 0;
const graphql_1 = require("graphql");
const error_js_1 = require("../error.js");
const LocalTime_js_1 = require("./LocalTime.js");
const LOCAL_END_TIMES = ['24:00', '24:00:00', '24:00:00.000'];
function validateLocalEndTime(value) {
    // first check if it's any of the special "end time" values
    if (LOCAL_END_TIMES.indexOf(value) >= 0) {
        return value;
    }
    // otherwise, fall back on the standard LocalTime validation
    return (0, LocalTime_js_1.validateLocalTime)(value);
}
exports.GraphQLLocalEndTime = new graphql_1.GraphQLScalarType({
    name: 'LocalEndTime',
    description: 'A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.  This scalar is very similar to the `LocalTime`, with the only difference being that `LocalEndTime` also allows `24:00` as a valid value to indicate midnight of the following day.  This is useful when using the scalar to represent the exclusive upper bound of a time block.',
    serialize(value) {
        // value sent to client as string
        return validateLocalEndTime(value);
    },
    parseValue(value) {
        // value from client as json
        return validateLocalEndTime(value);
    },
    parseLiteral(ast) {
        // value from client in ast
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw (0, error_js_1.createGraphQLError)(`Can only validate strings as local times but got a: ${ast.kind}`, {
                nodes: ast,
            });
        }
        return validateLocalEndTime(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
        jsonSchema: {
            title: 'LocalEndTime',
            type: 'string',
            oneOf: [
                {
                    type: 'string',
                    pattern: LocalTime_js_1.LOCAL_TIME_FORMAT.source,
                },
                {
                    type: 'string',
                    enum: LOCAL_END_TIMES,
                },
            ],
        },
    },
});
