import { withCleanup } from "./withCleanup.js";
var noOp = function () { };
var restore = function (spy) { return spy.mockRestore(); };
/** @internal */
export function spyOnConsole() {
    var spyOn = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        spyOn[_i] = arguments[_i];
    }
    var spies = {};
    for (var _a = 0, spyOn_1 = spyOn; _a < spyOn_1.length; _a++) {
        var key = spyOn_1[_a];
        // @ts-ignore
        spies[key] = jest.spyOn(console, key).mockImplementation(noOp);
    }
    return withCleanup(spies, function (spies) {
        for (var _i = 0, _a = Object.values(spies); _i < _a.length; _i++) {
            var spy = _a[_i];
            restore(spy);
        }
    });
}
spyOnConsole.takeSnapshots = function () {
    var spyOn = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        spyOn[_i] = arguments[_i];
    }
    return withCleanup(spyOnConsole.apply(void 0, spyOn), function (spies) {
        for (var _i = 0, _a = Object.values(spies); _i < _a.length; _i++) {
            var spy = _a[_i];
            expect(spy).toMatchSnapshot();
        }
    });
};
//# sourceMappingURL=spyOnConsole.js.map