import { compareNodes, isSome } from '@graphql-tools/utils';
export function mergeArguments(args1, args2, config) {
    const result = deduplicateArguments([...args2, ...args1].filter(isSome));
    if (config && config.sort) {
        result.sort(compareNodes);
    }
    return result;
}
function deduplicateArguments(args) {
    return args.reduce((acc, current) => {
        const dup = acc.find(arg => arg.name.value === current.name.value);
        if (!dup) {
            return acc.concat([current]);
        }
        return acc;
    }, []);
}
