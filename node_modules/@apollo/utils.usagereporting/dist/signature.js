"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageReportingSignature = void 0;
const utils_dropunuseddefinitions_1 = require("@apollo/utils.dropunuseddefinitions");
const utils_stripsensitiveliterals_1 = require("@apollo/utils.stripsensitiveliterals");
const utils_printwithreducedwhitespace_1 = require("@apollo/utils.printwithreducedwhitespace");
const utils_removealiases_1 = require("@apollo/utils.removealiases");
const utils_sortast_1 = require("@apollo/utils.sortast");
function usageReportingSignature(ast, operationName) {
    return (0, utils_printwithreducedwhitespace_1.printWithReducedWhitespace)((0, utils_sortast_1.sortAST)((0, utils_removealiases_1.removeAliases)((0, utils_stripsensitiveliterals_1.stripSensitiveLiterals)((0, utils_dropunuseddefinitions_1.dropUnusedDefinitions)(ast, operationName), {
        hideListAndObjectLiterals: true,
    }))));
}
exports.usageReportingSignature = usageReportingSignature;
//# sourceMappingURL=signature.js.map