export class Output {
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
export class TestOutput {
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
