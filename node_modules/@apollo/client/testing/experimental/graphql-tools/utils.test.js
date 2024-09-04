// Originally from @graphql-tools/mock
// https://github.com/ardatan/graphql-tools/blob/4b56b04d69b02919f6c5fa4f97d33da63f36e8c8/packages/mock/tests/addMocksToSchema.spec.ts
import { __awaiter, __generator } from "tslib";
import { buildSchema, graphql } from "graphql";
import { createMockSchema } from "./utils.js";
var mockDate = new Date().toJSON().split("T")[0];
var mocks = {
    Int: function () { return 6; },
    Float: function () { return 22.1; },
    String: function () { return "string"; },
    ID: function () { return "id"; },
    Date: function () { return mockDate; },
};
var typeDefs = /* GraphQL */ "\n  type User {\n    id: ID!\n    age: Int!\n    name: String!\n    image: UserImage!\n    book: Book!\n  }\n\n  type Author {\n    _id: ID!\n    name: String!\n    book: Book!\n  }\n\n  union UserImage = UserImageSolidColor | UserImageURL\n\n  type UserImageSolidColor {\n    color: String!\n  }\n\n  type UserImageURL {\n    url: String!\n  }\n\n  scalar Date\n\n  interface Book {\n    id: ID!\n    title: String\n    publishedAt: Date\n  }\n\n  type TextBook implements Book {\n    id: ID!\n    title: String\n    publishedAt: Date\n    text: String\n  }\n\n  type ColoringBook implements Book {\n    id: ID!\n    title: String\n    publishedAt: Date\n    colors: [String]\n  }\n\n  type Query {\n    viewer: User!\n    userById(id: ID!): User!\n    author: Author!\n  }\n\n  type Mutation {\n    changeViewerName(newName: String!): User!\n  }\n";
var schema = buildSchema(typeDefs);
describe("addMocksToSchema", function () {
    it("basic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, mockedSchema, _a, data, errors, viewerData, data2, viewerData2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "\n      query {\n        viewer {\n          id\n          name\n          age\n        }\n      }\n    ";
                    mockedSchema = createMockSchema(schema, mocks);
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, errors = _a.errors;
                    expect(errors).not.toBeDefined();
                    expect(data).toBeDefined();
                    viewerData = data === null || data === void 0 ? void 0 : data["viewer"];
                    expect(typeof viewerData["id"]).toBe("string");
                    expect(typeof viewerData["name"]).toBe("string");
                    expect(typeof viewerData["age"]).toBe("number");
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 2:
                    data2 = (_b.sent()).data;
                    viewerData2 = data2 === null || data2 === void 0 ? void 0 : data2["viewer"];
                    expect(viewerData2["id"]).toEqual(viewerData["id"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("handle _id key field", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, mockedSchema, _a, data, errors, viewerData, data2, viewerData2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "\n      query {\n        author {\n          _id\n          name\n        }\n      }\n    ";
                    mockedSchema = createMockSchema(schema, mocks);
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, errors = _a.errors;
                    expect(errors).not.toBeDefined();
                    expect(data).toBeDefined();
                    viewerData = data === null || data === void 0 ? void 0 : data["author"];
                    expect(typeof viewerData["_id"]).toBe("string");
                    expect(typeof viewerData["name"]).toBe("string");
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 2:
                    data2 = (_b.sent()).data;
                    viewerData2 = data2 === null || data2 === void 0 ? void 0 : data2["author"];
                    expect(viewerData2["_id"]).toEqual(viewerData["_id"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle union type", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, mockedSchema, _a, data, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "\n      query {\n        viewer {\n          image {\n            __typename\n            ... on UserImageURL {\n              url\n            }\n            ... on UserImageSolidColor {\n              color\n            }\n          }\n        }\n      }\n    ";
                    mockedSchema = createMockSchema(schema, mocks);
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, errors = _a.errors;
                    expect(errors).not.toBeDefined();
                    expect(data).toBeDefined();
                    expect(data["viewer"]["image"]["__typename"]).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle interface type", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, mockedSchema, _a, data, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "\n      query {\n        viewer {\n          book {\n            title\n            __typename\n            ... on TextBook {\n              text\n            }\n            ... on ColoringBook {\n              colors\n            }\n          }\n        }\n      }\n    ";
                    mockedSchema = createMockSchema(schema, mocks);
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, errors = _a.errors;
                    expect(errors).not.toBeDefined();
                    expect(data).toBeDefined();
                    expect(data["viewer"]["book"]["__typename"]).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle custom scalars", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, mockedSchema, _a, data, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "\n      query {\n        viewer {\n          book {\n            title\n            publishedAt\n          }\n        }\n      }\n    ";
                    mockedSchema = createMockSchema(schema, mocks);
                    return [4 /*yield*/, graphql({
                            schema: mockedSchema,
                            source: query,
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, errors = _a.errors;
                    expect(errors).not.toBeDefined();
                    expect(data).toBeDefined();
                    expect(data["viewer"]["book"]["publishedAt"]).toBe(mockDate);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=utils.test.js.map