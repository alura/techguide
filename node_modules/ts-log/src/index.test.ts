import { dummyLogger, Logger } from "./index";

class Calculator {
  // accept the logger in the constructor, defaulting to dummy logger
  public constructor(private readonly log: Logger = dummyLogger) {}

  public sum(a: number, b: number) {
    const result = a + b;

    // call all methods of the logger
    this.log.trace(`trace summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.debug(`debug summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.info(`info summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.warn(`warn summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.error(`error summing ${a} + ${b} = ${result}`, a, b, result);

    return result;
  }
}

describe("ts-log", () => {
  it("should work with default dummy logger", async () => {
    const calculator = new Calculator();

    calculator.sum(1, 2);
  });

  it("should work with console as logger", async () => {
    const calculator = new Calculator(console);

    calculator.sum(1, 2);
  });

  it("should work with custom logger", async () => {
    const customLogger: Logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const calculator = new Calculator(customLogger);

    calculator.sum(1, 2);

    expect((customLogger.trace as jest.Mock).mock.calls).toMatchSnapshot();
    expect((customLogger.debug as jest.Mock).mock.calls).toMatchSnapshot();
    expect((customLogger.info as jest.Mock).mock.calls).toMatchSnapshot();
    expect((customLogger.warn as jest.Mock).mock.calls).toMatchSnapshot();
    expect((customLogger.error as jest.Mock).mock.calls).toMatchSnapshot();
  });
});
