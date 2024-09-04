import { newInvariantError } from "../../utilities/globals/index.js";
export var serializeFetchParameter = function (p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    }
    catch (e) {
        var parseError = newInvariantError(39, label, e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};
//# sourceMappingURL=serializeFetchParameter.js.map