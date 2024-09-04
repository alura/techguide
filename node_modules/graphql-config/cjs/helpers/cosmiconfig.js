"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCosmiConfigSync = exports.createCosmiConfig = exports.isLegacyConfig = void 0;
const tslib_1 = require("tslib");
const cosmiconfig_1 = require("cosmiconfig");
const string_env_interpolation_1 = require("string-env-interpolation");
const jiti_1 = tslib_1.__importDefault(require("jiti"));
const legacySearchPlaces = [
    '.graphqlconfig',
    '.graphqlconfig.json',
    '.graphqlconfig.yaml',
    '.graphqlconfig.yml',
];
function isLegacyConfig(filePath) {
    filePath = filePath.toLowerCase();
    return legacySearchPlaces.some((name) => filePath.endsWith(name));
}
exports.isLegacyConfig = isLegacyConfig;
function transformContent(content) {
    return (0, string_env_interpolation_1.env)(content);
}
function createCustomLoader(loader) {
    return (filePath, content) => loader(filePath, transformContent(content));
}
function createCosmiConfig(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return (0, cosmiconfig_1.cosmiconfig)(moduleName, options);
}
exports.createCosmiConfig = createCosmiConfig;
function createCosmiConfigSync(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return (0, cosmiconfig_1.cosmiconfigSync)(moduleName, options);
}
exports.createCosmiConfigSync = createCosmiConfigSync;
const loadTypeScript = (filepath) => {
    const jitiLoader = (0, jiti_1.default)(__filename, {
        interopDefault: true,
    });
    return jitiLoader(filepath);
};
const loadToml = (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { loadToml } = require('cosmiconfig-toml-loader');
    return createCustomLoader(loadToml)(...args);
};
function prepareCosmiconfig(moduleName, legacy) {
    const loadYaml = createCustomLoader(cosmiconfig_1.defaultLoaders['.yaml']);
    const searchPlaces = [
        '#.config.ts',
        '#.config.cts',
        '#.config.mts',
        '#.config.js',
        '#.config.cjs',
        '#.config.json',
        '#.config.yaml',
        '#.config.yml',
        '#.config.toml',
        '.#rc',
        '.#rc.ts',
        '.#rc.cts',
        '.#rc.mts',
        '.#rc.js',
        '.#rc.cjs',
        '.#rc.json',
        '.#rc.yml',
        '.#rc.yaml',
        '.#rc.toml',
        'package.json',
    ];
    if (legacy) {
        searchPlaces.push(...legacySearchPlaces);
    }
    // We need to wrap loaders in order to access and transform file content (as string)
    // Cosmiconfig has transform option but at this point config is not a string but an object
    return {
        searchPlaces: searchPlaces.map((place) => place.replace('#', moduleName)),
        loaders: {
            '.ts': loadTypeScript,
            '.mts': loadTypeScript,
            '.cts': loadTypeScript,
            '.js': cosmiconfig_1.defaultLoaders['.js'],
            '.json': createCustomLoader(cosmiconfig_1.defaultLoaders['.json']),
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.toml': loadToml,
            noExt: loadYaml,
        },
    };
}
