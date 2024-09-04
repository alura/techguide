import { __extends } from "tslib";
import { validate, execute } from "graphql";
import { ApolloLink } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
var SchemaLink = /** @class */ (function (_super) {
    __extends(SchemaLink, _super);
    function SchemaLink(options) {
        var _this = _super.call(this) || this;
        _this.schema = options.schema;
        _this.rootValue = options.rootValue;
        _this.context = options.context;
        _this.validate = !!options.validate;
        return _this;
    }
    SchemaLink.prototype.request = function (operation) {
        var _this = this;
        return new Observable(function (observer) {
            new Promise(function (resolve) {
                return resolve(typeof _this.context === "function" ?
                    _this.context(operation)
                    : _this.context);
            })
                .then(function (context) {
                if (_this.validate) {
                    var validationErrors = validate(_this.schema, operation.query);
                    if (validationErrors.length > 0) {
                        return { errors: validationErrors };
                    }
                }
                return execute({
                    schema: _this.schema,
                    document: operation.query,
                    rootValue: _this.rootValue,
                    contextValue: context,
                    variableValues: operation.variables,
                    operationName: operation.operationName,
                });
            })
                .then(function (data) {
                if (!observer.closed) {
                    observer.next(data);
                    observer.complete();
                }
            })
                .catch(function (error) {
                if (!observer.closed) {
                    observer.error(error);
                }
            });
        });
    };
    return SchemaLink;
}(ApolloLink));
export { SchemaLink };
//# sourceMappingURL=index.js.map