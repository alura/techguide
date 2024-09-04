import { GraphQLScalarType } from 'graphql';
import { GraphQLDateTimeConfig } from './DateTime.js';
export const GraphQLDateTimeISOConfig = /*#__PURE__*/ {
    ...GraphQLDateTimeConfig,
    name: 'DateTimeISO',
    description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z, ' +
        'compliant with the `date-time` format outlined in section 5.6 of ' +
        'the RFC 3339 profile of the ISO 8601 standard for representation ' +
        'of dates and times using the Gregorian calendar.' +
        'This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format.',
    serialize(value) {
        const date = GraphQLDateTimeConfig.serialize(value);
        return date.toISOString();
    },
};
export const GraphQLDateTimeISO = /*#__PURE__*/ new GraphQLScalarType(GraphQLDateTimeISOConfig);
