import { promises as fs } from "fs";

const globals = {
  __proto__: null,
  assert: "assert",
  invariant: "reactInvariant",
  tslib: "tslib",
  "@ungap/global-this": "globalThisPolyfill",
};

function external(id) {
  return id in globals;
}

function copyPlugin() {
  return {
    name: "copy *.cjs to *.cjs.native.js",
    async writeBundle({ file }) {
      const buffer = await fs.readFile(file);
      await fs.writeFile(
        file + ".native.js",
        buffer,
      );
    },
  };
}

const jobs = [];
export default jobs;

jobs.push({
  input: "lib/invariant.js",
  external,
  output: {
    file: "lib/invariant.cjs",
    format: "cjs",
    exports: "named",
    sourcemap: true,
    name: "ts-invariant",
    globals,
  },
  plugins: [
    copyPlugin(),
  ],
});

jobs.push({
  input: "lib/tests.js",
  external,
  output: {
    file: "lib/tests.bundle.cjs",
    format: "cjs",
    exports: "named",
    sourcemap: true,
    name: "ts-invariant-tests-cjs-bundle",
    globals,
  },
});

jobs.push({
  input: "process/index.js",
  external,
  output: {
    file: "process/main.cjs",
    format: "cjs",
    exports: "named",
    sourcemap: true,
    name: "ts-invariant/process",
    globals,
  },
  plugins: [
    copyPlugin(),
  ],
});
