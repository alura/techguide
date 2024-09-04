import { __assign } from "tslib";
import * as React from "rehackt";
import { mergeOptions } from "../../utilities/index.js";
import { equal } from "@wry/equality";
import { DocumentType, verifyDocumentType } from "../parser/index.js";
import { ApolloError } from "../../errors/index.js";
import { useApolloClient } from "./useApolloClient.js";
import { useIsomorphicLayoutEffect } from "./internal/useIsomorphicLayoutEffect.js";
/**
 *
 *
 * > Refer to the [Mutations](https://www.apollographql.com/docs/react/data/mutations/) section for a more in-depth overview of `useMutation`.
 *
 * @example
 * ```jsx
 * import { gql, useMutation } from '@apollo/client';
 *
 * const ADD_TODO = gql`
 *   mutation AddTodo($type: String!) {
 *     addTodo(type: $type) {
 *       id
 *       type
 *     }
 *   }
 * `;
 *
 * function AddTodo() {
 *   let input;
 *   const [addTodo, { data }] = useMutation(ADD_TODO);
 *
 *   return (
 *     <div>
 *       <form
 *         onSubmit={e => {
 *           e.preventDefault();
 *           addTodo({ variables: { type: input.value } });
 *           input.value = '';
 *         }}
 *       >
 *         <input
 *           ref={node => {
 *             input = node;
 *           }}
 *         />
 *         <button type="submit">Add Todo</button>
 *       </form>
 *     </div>
 *   );
 * }
 * ```
 * @since 3.0.0
 * @param mutation - A GraphQL mutation document parsed into an AST by `gql`.
 * @param options - Options to control how the mutation is executed.
 * @returns A tuple in the form of `[mutate, result]`
 */
export function useMutation(mutation, options) {
    var client = useApolloClient(options === null || options === void 0 ? void 0 : options.client);
    verifyDocumentType(mutation, DocumentType.Mutation);
    var _a = React.useState({
        called: false,
        loading: false,
        client: client,
    }), result = _a[0], setResult = _a[1];
    var ref = React.useRef({
        result: result,
        mutationId: 0,
        isMounted: true,
        client: client,
        mutation: mutation,
        options: options,
    });
    useIsomorphicLayoutEffect(function () {
        Object.assign(ref.current, { client: client, options: options, mutation: mutation });
    });
    var execute = React.useCallback(function (executeOptions) {
        if (executeOptions === void 0) { executeOptions = {}; }
        var _a = ref.current, options = _a.options, mutation = _a.mutation;
        var baseOptions = __assign(__assign({}, options), { mutation: mutation });
        var client = executeOptions.client || ref.current.client;
        if (!ref.current.result.loading &&
            !baseOptions.ignoreResults &&
            ref.current.isMounted) {
            setResult((ref.current.result = {
                loading: true,
                error: void 0,
                data: void 0,
                called: true,
                client: client,
            }));
        }
        var mutationId = ++ref.current.mutationId;
        var clientOptions = mergeOptions(baseOptions, executeOptions);
        return client
            .mutate(clientOptions)
            .then(function (response) {
            var _a, _b;
            var data = response.data, errors = response.errors;
            var error = errors && errors.length > 0 ?
                new ApolloError({ graphQLErrors: errors })
                : void 0;
            var onError = executeOptions.onError || ((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onError);
            if (error && onError) {
                onError(error, clientOptions);
            }
            if (mutationId === ref.current.mutationId &&
                !clientOptions.ignoreResults) {
                var result_1 = {
                    called: true,
                    loading: false,
                    data: data,
                    error: error,
                    client: client,
                };
                if (ref.current.isMounted && !equal(ref.current.result, result_1)) {
                    setResult((ref.current.result = result_1));
                }
            }
            var onCompleted = executeOptions.onCompleted || ((_b = ref.current.options) === null || _b === void 0 ? void 0 : _b.onCompleted);
            if (!error) {
                onCompleted === null || onCompleted === void 0 ? void 0 : onCompleted(response.data, clientOptions);
            }
            return response;
        })
            .catch(function (error) {
            var _a;
            if (mutationId === ref.current.mutationId && ref.current.isMounted) {
                var result_2 = {
                    loading: false,
                    error: error,
                    data: void 0,
                    called: true,
                    client: client,
                };
                if (!equal(ref.current.result, result_2)) {
                    setResult((ref.current.result = result_2));
                }
            }
            var onError = executeOptions.onError || ((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onError);
            if (onError) {
                onError(error, clientOptions);
                // TODO(brian): why are we returning this here???
                return { data: void 0, errors: error };
            }
            throw error;
        });
    }, []);
    var reset = React.useCallback(function () {
        if (ref.current.isMounted) {
            var result_3 = {
                called: false,
                loading: false,
                client: ref.current.client,
            };
            Object.assign(ref.current, { mutationId: 0, result: result_3 });
            setResult(result_3);
        }
    }, []);
    React.useEffect(function () {
        var current = ref.current;
        current.isMounted = true;
        return function () {
            current.isMounted = false;
        };
    }, []);
    return [execute, __assign({ reset: reset }, result)];
}
//# sourceMappingURL=useMutation.js.map