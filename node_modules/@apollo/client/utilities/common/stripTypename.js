import { omitDeep } from "./omitDeep.js";
export function stripTypename(value) {
    return omitDeep(value, "__typename");
}
//# sourceMappingURL=stripTypename.js.map