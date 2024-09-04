import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import { cosmiconfig, cosmiconfigSync, defaultLoaders } from 'cosmiconfig';
import { env } from 'string-env-interpolation';
import jiti from 'jiti';
const legacySearchPlaces = [
    '.graphqlconfig',
    '.graphqlconfig.json',
    '.graphqlconfig.yaml',
    '.graphqlconfig.yml',
];
export function isLegacyConfig(filePath) {
    filePath = filePath.toLowerCase();
    return legacySearchPlaces.some((name) => filePath.endsWith(name));
}
function transformContent(content) {
    return env(content);
}
function createCustomLoader(loader) {
    return (filePath, content) => loader(filePath, transformContent(content));
}
export function createCosmiConfig(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return cosmiconfig(moduleName, options);
}
export function createCosmiConfigSync(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return cosmiconfigSync(moduleName, options);
}
const loadTypeScript = (filepath) => {
    const jitiLoader = jiti(__filename, {
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
    const loadYaml = createCustomLoader(defaultLoaders['.yaml']);
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
            '.js': defaultLoaders['.js'],
            '.json': createCustomLoader(defaultLoaders['.json']),
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.toml': loadToml,
            noExt: loadYaml,
        },
    };
}
