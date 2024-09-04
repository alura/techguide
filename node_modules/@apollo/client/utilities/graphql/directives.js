import { invariant } from "../globals/index.js";
import { visit, BREAK } from "graphql";
export function shouldInclude(_a, variables) {
    var directives = _a.directives;
    if (!directives || !directives.length) {
        return true;
    }
    return getInclusionDirectives(directives).every(function (_a) {
        var directive = _a.directive, ifArgument = _a.ifArgument;
        var evaledValue = false;
        if (ifArgument.value.kind === "Variable") {
            evaledValue =
                variables && variables[ifArgument.value.name.value];
            invariant(evaledValue !== void 0, 68, directive.name.value);
        }
        else {
            evaledValue = ifArgument.value.value;
        }
        return directive.name.value === "skip" ? !evaledValue : evaledValue;
    });
}
export function getDirectiveNames(root) {
    var names = [];
    visit(root, {
        Directive: function (node) {
            names.push(node.name.value);
        },
    });
    return names;
}
export var hasAnyDirectives = function (names, root) {
    return hasDirectives(names, root, false);
};
export var hasAllDirectives = function (names, root) {
    return hasDirectives(names, root, true);
};
export function hasDirectives(names, root, all) {
    var nameSet = new Set(names);
    var uniqueCount = nameSet.size;
    visit(root, {
        Directive: function (node) {
            if (nameSet.delete(node.name.value) && (!all || !nameSet.size)) {
                return BREAK;
            }
        },
    });
    // If we found all the names, nameSet will be empty. If we only care about
    // finding some of them, the < condition is sufficient.
    return all ? !nameSet.size : nameSet.size < uniqueCount;
}
export function hasClientExports(document) {
    return document && hasDirectives(["client", "export"], document, true);
}
function isInclusionDirective(_a) {
    var value = _a.name.value;
    return value === "skip" || value === "include";
}
export function getInclusionDirectives(directives) {
    var result = [];
    if (directives && directives.length) {
        directives.forEach(function (directive) {
            if (!isInclusionDirective(directive))
                return;
            var directiveArguments = directive.arguments;
            var directiveName = directive.name.value;
            invariant(directiveArguments && directiveArguments.length === 1, 69, directiveName);
            var ifArgument = directiveArguments[0];
            invariant(ifArgument.name && ifArgument.name.value === "if", 70, directiveName);
            var ifValue = ifArgument.value;
            // means it has to be a variable value if this is a valid @skip or @include directive
            invariant(ifValue &&
                (ifValue.kind === "Variable" || ifValue.kind === "BooleanValue"), 71, directiveName);
            result.push({ directive: directive, ifArgument: ifArgument });
        });
    }
    return result;
}
//# sourceMappingURL=directives.js.map