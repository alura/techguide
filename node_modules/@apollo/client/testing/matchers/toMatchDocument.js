import { checkDocument, print } from "../../utilities/index.js";
export var toMatchDocument = function (actual, document) {
    var _this = this;
    var hint = this.utils.matcherHint("toMatchDocument");
    var actualDocument = print(validateDocument(actual, hint +
        "\n\n".concat(this.utils.RECEIVED_COLOR("received"), " document must be a parsed document.")));
    var expectedDocument = print(validateDocument(document, hint +
        "\n\n".concat(this.utils.EXPECTED_COLOR("expected"), " document must be a parsed document.")));
    var pass = actualDocument === expectedDocument;
    return {
        pass: pass,
        message: function () {
            var hint = _this.utils.matcherHint("toMatchDocument", undefined, undefined, { isNot: _this.isNot });
            if (pass) {
                return (hint +
                    "\n\n" +
                    "Received:\n\n" +
                    _this.utils.RECEIVED_COLOR(actualDocument));
            }
            return (hint + "\n\n" + _this.utils.diff(expectedDocument, actualDocument));
        },
    };
};
function validateDocument(document, message) {
    try {
        checkDocument(document);
    }
    catch (e) {
        throw new Error(message);
    }
    return document;
}
//# sourceMappingURL=toMatchDocument.js.map