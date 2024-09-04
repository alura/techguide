"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestOutput = exports.Output = void 0;
class Output {
    log(...args) {
        console.log(args);
    }
    warn(...args) {
        console.warn(args);
    }
    getErrorPrefix(fileName, type = 'error') {
        return `[${type.toUpperCase()}] in ${fileName}: `;
    }
}
exports.Output = Output;
class TestOutput {
    constructor() {
        this.output = [];
    }
    log(...args) {
        this.output = this.output.concat(args);
    }
    warn(...args) {
        this.output = this.output.concat(args);
    }
    getErrorPrefix(fileName, type = 'error') {
        return `[${type.toUpperCase()}] in ${fileName}: `;
    }
}
exports.TestOutput = TestOutput;
