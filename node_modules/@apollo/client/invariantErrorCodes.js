export const errorCodes = // This file is used by the error message display website and the
// @apollo/client/includeErrors entry point.
// This file is not meant to be imported manually.
{
  1: {
    file: "@apollo/client/cache/inmemory/entityStore.js",
    condition: "typeof dataId === \"string\"",
    message: "store.merge expects a string ID"
  },

  4: {
    file: "@apollo/client/cache/inmemory/key-extractor.js",
    condition: "extracted !== void 0",
    message: "Missing field '%s' while extracting keyFields from %s"
  },

  5: {
    file: "@apollo/client/cache/inmemory/policies.js",
    condition: "!old || old === which",
    message: "Cannot change root %s __typename more than once"
  },

  8: {
    file: "@apollo/client/cache/inmemory/policies.js",
    message: "Cannot automatically merge arrays"
  },

  9: {
    file: "@apollo/client/cache/inmemory/readFromStore.js",
    message: "No fragment named %s"
  },

  10: {
    file: "@apollo/client/cache/inmemory/readFromStore.js",
    condition: "!isReference(value)",
    message: "Missing selection set for object of type %s returned for query field %s"
  },

  11: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: "Could not identify object %s"
  },

  13: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: "No fragment named %s"
  },

  15: {
    file: "@apollo/client/core/ApolloClient.js",

    message: "To initialize Apollo Client, you must specify a 'cache' property " +
        "in the options object. \n" +
        "For more information, please visit: https://go.apollo.dev/c/docs"
  },

  16: {
    file: "@apollo/client/core/ApolloClient.js",
    condition: "options.fetchPolicy !== \"cache-and-network\"",

    message: "The cache-and-network fetchPolicy does not work with client.query, because " +
        "client.query can only return a single result. Please use client.watchQuery " +
        "to receive multiple results from the cache and the network, or consider " +
        "using a different fetchPolicy, such as cache-first or network-only."
  },

  18: {
    file: "@apollo/client/core/LocalState.js",
    condition: "fragment",
    message: "No fragment named %s"
  },

  19: {
    file: "@apollo/client/core/LocalState.js",
    condition: "fragment",
    message: "No fragment named %s"
  },

  22: {
    file: "@apollo/client/core/ObservableQuery.js",
    condition: "pollInterval",
    message: "Attempted to start a polling query without a polling interval."
  },

  25: {
    file: "@apollo/client/core/QueryManager.js",
    message: "QueryManager stopped while query was in flight"
  },

  26: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "mutation",
    message: "mutation option is required. You must specify your GraphQL document in the mutation option."
  },

  27: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "fetchPolicy === \"network-only\" || fetchPolicy === \"no-cache\"",
    message: "Mutations support only 'network-only' or 'no-cache' fetchPolicy strings. The default `network-only` behavior automatically writes mutation results to the cache. Passing `no-cache` skips the cache write."
  },

  28: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "options.query",

    message: "query option is required. You must specify your GraphQL document " +
        "in the query option."
  },

  29: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "options.query.kind === \"Document\"",
    message: 'You must wrap the query string in a "gql" tag.'
  },

  30: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "!options.returnPartialData",
    message: "returnPartialData option only supported on watchQuery."
  },

  31: {
    file: "@apollo/client/core/QueryManager.js",
    condition: "!options.pollInterval",
    message: "pollInterval option only supported on watchQuery."
  },

  32: {
    file: "@apollo/client/core/QueryManager.js",
    message: "Store reset while query was in flight (not completed in link chain)"
  },

  36: {
    file: "@apollo/client/link/core/ApolloLink.js",
    message: "request is not implemented"
  },

  37: {
    file: "@apollo/client/link/http/checkFetcher.js",
    message: "\n\"fetch\" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:\n\nimport fetch from 'cross-fetch';\nimport { ApolloClient, HttpLink } from '@apollo/client';\nconst client = new ApolloClient({\n  link: new HttpLink({ uri: '/graphql', fetch })\n});\n    "
  },

  39: {
    file: "@apollo/client/link/http/serializeFetchParameter.js",
    message: "Network request failed. %s is not serializable: %s"
  },

  40: {
    file: "@apollo/client/link/persisted-queries/index.js",
    condition: "options &&\n    (typeof options.sha256 === \"function\" ||\n        typeof options.generateHash === \"function\")",

    message: 'Missing/invalid "sha256" or "generateHash" function. Please ' +
        'configure one using the "createPersistedQueryLink(options)" options ' +
        "parameter."
  },

  41: {
    file: "@apollo/client/link/persisted-queries/index.js",
    condition: "forward",
    message: "PersistedQueryLink cannot be the last link in the chain."
  },

  43: {
    file: "@apollo/client/link/utils/validateOperation.js",
    message: "illegal argument: %s"
  },

  44: {
    file: "@apollo/client/react/context/ApolloConsumer.js",
    condition: "context && context.client",

    message: 'Could not find "client" in the context of ApolloConsumer. ' +
        "Wrap the root component in an <ApolloProvider>."
  },

  45: {
    file: "@apollo/client/react/context/ApolloContext.js",
    condition: "\"createContext\" in React",

    message: "Invoking `getApolloContext` in an environment where `React.createContext` is not available.\n" +
        "The Apollo Client functionality you are trying to use is only available in React Client Components.\n" +
        'Please make sure to add "use client" at the top of your file.\n' +
        // TODO: change to React documentation once React documentation contains information about Client Components
        "For more information, see https://nextjs.org/docs/getting-started/react-essentials#client-components"
  },

  46: {
    file: "@apollo/client/react/context/ApolloProvider.js",
    condition: "context.client",

    message: "ApolloProvider was not passed a client instance. Make " +
        'sure you pass in your client via the "client" prop.'
  },

  47: {
    file: "@apollo/client/react/hoc/hoc-utils.js",
    condition: "this.withRef",

    message: "To access the wrapped instance, you need to specify " +
        "{ withRef: true } in the options"
  },

  48: {
    file: "@apollo/client/react/hoc/withApollo.js",
    condition: "operationOptions.withRef",

    message: "To access the wrapped instance, you need to specify " +
        "{ withRef: true } in the options"
  },

  49: {
    file: "@apollo/client/react/hooks/useApolloClient.js",
    condition: "!!client",

    message: 'Could not find "client" in the context or passed in as an option. ' +
        "Wrap the root component in an <ApolloProvider>, or pass an ApolloClient " +
        "instance in via options."
  },

  50: {
    file: "@apollo/client/react/hooks/useLoadableQuery.js",
    condition: "!calledDuringRender()",
    message: "useLoadableQuery: 'loadQuery' should not be called during render. To start a query during render, use the 'useBackgroundQuery' hook."
  },

  56: {
    file: "@apollo/client/react/hooks/useSuspenseQuery.js",
    condition: "supportedFetchPolicies.includes(fetchPolicy)",
    message: "The fetch policy `%s` is not supported with suspense."
  },

  59: {
    file: "@apollo/client/react/internal/cache/QueryReference.js",
    condition: "!queryRef || QUERY_REFERENCE_SYMBOL in queryRef",
    message: "Expected a QueryRef object, but got something else instead."
  },

  60: {
    file: "@apollo/client/react/parser/index.js",
    condition: "!!document && !!document.kind",

    message: "Argument of %s passed to parser was not a valid GraphQL " +
        "DocumentNode. You may need to use 'graphql-tag' or another method " +
        "to convert your operation into a document"
  },

  61: {
    file: "@apollo/client/react/parser/index.js",
    condition: "!fragments.length ||\n    queries.length ||\n    mutations.length ||\n    subscriptions.length",

    message: "Passing only a fragment to 'graphql' is not yet supported. " +
        "You must include a query, subscription or mutation as well"
  },

  62: {
    file: "@apollo/client/react/parser/index.js",
    condition: "queries.length + mutations.length + subscriptions.length <= 1",

    message: "react-apollo only supports a query, subscription, or a mutation per HOC. " +
        "%s had %s queries, %s " +
        "subscriptions and %s mutations. " +
        "You can use 'compose' to join multiple operation types to a component"
  },

  63: {
    file: "@apollo/client/react/parser/index.js",
    condition: "definitions.length === 1",

    message: "react-apollo only supports one definition per HOC. %s had " +
        "%s definitions. " +
        "You can use 'compose' to join multiple operation types to a component"
  },

  64: {
    file: "@apollo/client/react/parser/index.js",
    condition: "operation.type === type",
    message: "Running a %s requires a graphql " + "%s, but a %s was used instead."
  },

  65: {
    file: "@apollo/client/testing/core/mocking/mockLink.js",
    condition: "queryWithoutClientOnlyDirectives",
    message: "query is required"
  },

  66: {
    file: "@apollo/client/testing/core/mocking/mockLink.js",
    condition: "mockedResponse.maxUsageCount > 0",
    message: "Mock response maxUsageCount must be greater than 0, %s given"
  },

  67: {
    file: "@apollo/client/utilities/graphql/DocumentTransform.js",
    condition: "Array.isArray(cacheKeys)",
    message: "`getCacheKey` must return an array or undefined"
  },

  68: {
    file: "@apollo/client/utilities/graphql/directives.js",
    condition: "evaledValue !== void 0",
    message: "Invalid variable referenced in @%s directive."
  },

  69: {
    file: "@apollo/client/utilities/graphql/directives.js",
    condition: "directiveArguments && directiveArguments.length === 1",
    message: "Incorrect number of arguments for the @%s directive."
  },

  70: {
    file: "@apollo/client/utilities/graphql/directives.js",
    condition: "ifArgument.name && ifArgument.name.value === \"if\"",
    message: "Invalid argument for the @%s directive."
  },

  71: {
    file: "@apollo/client/utilities/graphql/directives.js",
    condition: "ifValue &&\n    (ifValue.kind === \"Variable\" || ifValue.kind === \"BooleanValue\")",
    message: "Argument for the @%s directive must be a variable or a boolean value."
  },

  72: {
    file: "@apollo/client/utilities/graphql/fragments.js",

    message: "Found a %s operation%s. " +
        "No operations are allowed when using a fragment as a query. Only fragments are allowed."
  },

  73: {
    file: "@apollo/client/utilities/graphql/fragments.js",
    condition: "fragments.length === 1",
    message: "Found %s fragments. `fragmentName` must be provided when there is not exactly 1 fragment."
  },

  74: {
    file: "@apollo/client/utilities/graphql/fragments.js",
    condition: "fragment",
    message: "No fragment named %s"
  },

  75: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    condition: "doc && doc.kind === \"Document\"",
    message: "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql"
  },

  76: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    message: "Schema type definitions not allowed in queries. Found: \"%s\""
  },

  77: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    condition: "operations.length <= 1",
    message: "Ambiguous GraphQL document: contains %s operations"
  },

  78: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    condition: "queryDef && queryDef.operation === \"query\"",
    message: "Must contain a query definition."
  },

  79: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    condition: "doc.kind === \"Document\"",
    message: "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql"
  },

  80: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    condition: "doc.definitions.length <= 1",
    message: "Fragment must have exactly one definition."
  },

  81: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    condition: "fragmentDef.kind === \"FragmentDefinition\"",
    message: "Must be a fragment definition."
  },

  82: {
    file: "@apollo/client/utilities/graphql/getFromAST.js",
    message: "Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment."
  },

  83: {
    file: "@apollo/client/utilities/graphql/storeUtils.js",

    message: "The inline argument \"%s\" of kind \"%s\"" +
        "is not supported. Use variables instead of inline arguments to " +
        "overcome this limitation."
  }
};

export const devDebug = {
  17: {
    file: "@apollo/client/core/ApolloClient.js",
    message: "In client.refetchQueries, Promise.all promise rejected with error %o"
  },

  24: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: "Missing cache result fields: %o"
  }
};

export const devLog = {};

export const devWarn = {
  2: {
    file: "@apollo/client/cache/inmemory/entityStore.js",

    message: "cache.modify: You are trying to write a Reference that is not part of the store: %o\n" +
        "Please make sure to set the `mergeIntoStore` parameter to `true` when creating a Reference that is not part of the store yet:\n" +
        "`toReference(object, true)`"
  },

  3: {
    file: "@apollo/client/cache/inmemory/entityStore.js",

    message: "cache.modify: Writing an array with a mix of both References and Objects will not result in the Objects being normalized correctly.\n" +
        "Please convert the object instance %o to a Reference before writing it to the cache by calling `toReference(object, true)`."
  },

  6: {
    file: "@apollo/client/cache/inmemory/policies.js",
    message: "Inferring subtype %s of supertype %s"
  },

  7: {
    file: "@apollo/client/cache/inmemory/policies.js",
    message: "Undefined 'from' passed to readField with arguments %s"
  },

  14: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: "Cache data may be lost when replacing the %s field of a %s object.\n\nThis could cause additional (usually avoidable) network requests to fetch data that were otherwise cached.\n\nTo address this problem (which is not a bug in Apollo Client), %sdefine a custom merge function for the %s field, so InMemoryCache can safely merge these objects:\n\n  existing: %o\n  incoming: %o\n\nFor more information about these options, please refer to the documentation:\n\n  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers\n  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects\n"
  },

  20: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: "Called refetch(%o) for query %o, which does not declare a $variables variable.\nDid you mean to call refetch(variables) instead of refetch({ variables })?"
  },

  33: {
    file: "@apollo/client/core/QueryManager.js",
    message: "Unknown query named \"%s\" requested in refetchQueries options.include array"
  },

  34: {
    file: "@apollo/client/core/QueryManager.js",
    message: "Unknown query %o requested in refetchQueries options.include array"
  },

  35: {
    file: "@apollo/client/link/core/ApolloLink.js",
    message: "You are calling concat on a terminating link, which will have no effect %o"
  },

  38: {
    file: "@apollo/client/link/http/createHttpLink.js",
    message: "Multipart-subscriptions do not support @defer"
  },

  42: {
    file: "@apollo/client/link/utils/toPromise.js",
    message: "Promise Wrapper does not support multiple results from Observable"
  },

  51: {
    file: "@apollo/client/react/hooks/useQuery.js",
    message: "Calling default no-op implementation of InternalState#forceUpdate"
  },

  52: {
    file: "@apollo/client/react/hooks/useSubscription.js",
    message: "'useSubscription' supports only the 'onSubscriptionData' or 'onData' option, but not both. Only the 'onData' option will be used."
  },

  53: {
    file: "@apollo/client/react/hooks/useSubscription.js",
    message: "'onSubscriptionData' is deprecated and will be removed in a future major version. Please use the 'onData' option instead."
  },

  54: {
    file: "@apollo/client/react/hooks/useSubscription.js",
    message: "'useSubscription' supports only the 'onSubscriptionComplete' or 'onComplete' option, but not both. Only the 'onComplete' option will be used."
  },

  55: {
    file: "@apollo/client/react/hooks/useSubscription.js",
    message: "'onSubscriptionComplete' is deprecated and will be removed in a future major version. Please use the 'onComplete' option instead."
  },

  57: {
    file: "@apollo/client/react/hooks/useSuspenseQuery.js",
    message: "Using `returnPartialData` with a `no-cache` fetch policy has no effect. To read partial data from the cache, consider using an alternate fetch policy."
  },

  85: {
    file: "@apollo/client/utilities/graphql/transform.js",

    message: "Removing an @connection directive even though it does not have a key. " +
        "You may want to use the key parameter to specify a store key."
  }
};

export const devError = {
  12: {
    file: "@apollo/client/cache/inmemory/writeToStore.js",
    message: "Missing field '%s' while writing result %o"
  },

  21: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: "Unhandled GraphQL subscription error"
  },

  23: {
    file: "@apollo/client/core/ObservableQuery.js",
    message: "Unhandled error"
  },

  58: {
    file: "@apollo/client/react/hooks/useSyncExternalStore.js",
    message: "The result of getSnapshot should be cached to avoid an infinite loop"
  },

  84: {
    file: "@apollo/client/utilities/graphql/transform.js",
    message: "Could not find operation or fragment"
  }
};
