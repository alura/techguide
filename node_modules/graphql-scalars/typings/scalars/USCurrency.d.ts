import { GraphQLScalarType } from 'graphql';
/**
 * An Currency Scalar.
 *
 * Input:
 *    This scalar takes a currency string as input and
 *    formats it to currency in cents.
 *
 * Output:
 *    This scalar serializes currency in cents to
 *    currency strings.
 */
export declare const GraphQLUSCurrency: GraphQLScalarType<number, string>;
