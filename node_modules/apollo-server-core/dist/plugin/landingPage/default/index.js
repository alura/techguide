"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbeddedSandboxHTML = exports.getEmbeddedExplorerHTML = exports.ApolloServerPluginLandingPageProductionDefault = exports.ApolloServerPluginLandingPageLocalDefault = void 0;
function ApolloServerPluginLandingPageLocalDefault(options = {}) {
    const { version, __internal_apolloStudioEnv__, ...rest } = options;
    return ApolloServerPluginLandingPageDefault(version, {
        isProd: false,
        apolloStudioEnv: __internal_apolloStudioEnv__,
        ...rest,
    });
}
exports.ApolloServerPluginLandingPageLocalDefault = ApolloServerPluginLandingPageLocalDefault;
function ApolloServerPluginLandingPageProductionDefault(options = {}) {
    const { version, __internal_apolloStudioEnv__, ...rest } = options;
    return ApolloServerPluginLandingPageDefault(version, {
        isProd: true,
        apolloStudioEnv: __internal_apolloStudioEnv__,
        ...rest,
    });
}
exports.ApolloServerPluginLandingPageProductionDefault = ApolloServerPluginLandingPageProductionDefault;
function encodeConfig(config) {
    return JSON.stringify(encodeURIComponent(JSON.stringify(config)));
}
function getConfigStringForHtml(config) {
    return JSON.stringify(config)
        .replace('<', '\\u003c')
        .replace('>', '\\u003e')
        .replace('&', '\\u0026')
        .replace("'", '\\u0027');
}
const getEmbeddedExplorerHTML = (version, config) => {
    const productionLandingPageConfigOrDefault = {
        displayOptions: {},
        persistExplorerState: false,
        ...(typeof config.embed === 'boolean' ? {} : config.embed),
    };
    const embeddedExplorerParams = {
        ...config,
        target: '#embeddableExplorer',
        initialState: {
            ...config,
            displayOptions: {
                ...productionLandingPageConfigOrDefault.displayOptions,
            },
        },
        persistExplorerState: productionLandingPageConfigOrDefault.persistExplorerState,
    };
    return `
<div class="fallback">
  <h1>Welcome to Apollo Server</h1>
  <p>Apollo Explorer cannot be loaded; it appears that you might be offline.</p>
</div>
<style>
  iframe {
    background-color: white;
  }
</style>
<div
style="width: 100vw; height: 100vh; position: absolute; top: 0;"
id="embeddableExplorer"
></div>
<script src="https://embeddable-explorer.cdn.apollographql.com/${version}/embeddable-explorer.umd.production.min.js"></script>
<script>
  var endpointUrl = window.location.href;
  var embeddedExplorerConfig = ${getConfigStringForHtml(embeddedExplorerParams)};
  new window.EmbeddedExplorer({
    ...embeddedExplorerConfig,
    endpointUrl,
  });
</script>
`;
};
exports.getEmbeddedExplorerHTML = getEmbeddedExplorerHTML;
const getEmbeddedSandboxHTML = (version, config) => {
    var _a, _b, _c, _d;
    return `
<div class="fallback">
  <h1>Welcome to Apollo Server</h1>
  <p>Apollo Sandbox cannot be loaded; it appears that you might be offline.</p>
</div>
<style>
  iframe {
    background-color: white;
  }
</style>
<div
style="width: 100vw; height: 100vh; position: absolute; top: 0;"
id="embeddableSandbox"
></div>
<script src="https://embeddable-sandbox.cdn.apollographql.com/${version}/embeddable-sandbox.umd.production.min.js"></script>
<script>
  var initialEndpoint = window.location.href;
  new window.EmbeddedSandbox({
    target: '#embeddableSandbox',
    initialEndpoint,
    includeCookies: ${(_a = config.includeCookies) !== null && _a !== void 0 ? _a : 'false'},
    initialState: ${getConfigStringForHtml({
        document: (_b = config.document) !== null && _b !== void 0 ? _b : undefined,
        variables: (_c = config.variables) !== null && _c !== void 0 ? _c : undefined,
        headers: (_d = config.headers) !== null && _d !== void 0 ? _d : undefined,
    })},
  });
</script>
`;
};
exports.getEmbeddedSandboxHTML = getEmbeddedSandboxHTML;
const getNonEmbeddedLandingPageHTML = (version, config) => {
    const encodedConfig = encodeConfig(config);
    return `
 <div class="fallback">
  <h1>Welcome to Apollo Server</h1>
  <p>The full landing page cannot be loaded; it appears that you might be offline.</p>
</div>
<script>window.landingPage = ${encodedConfig};</script>
<script src="https://apollo-server-landing-page.cdn.apollographql.com/${version}/static/js/main.js"></script>`;
};
function ApolloServerPluginLandingPageDefault(maybeVersion, config) {
    const version = maybeVersion !== null && maybeVersion !== void 0 ? maybeVersion : '_latest';
    return {
        __internal_installed_implicitly__: false,
        async serverWillStart() {
            return {
                async renderLandingPage() {
                    const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link
      rel="icon"
      href="https://apollo-server-landing-page.cdn.apollographql.com/${version}/assets/favicon.png"
    />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
      rel="stylesheet"
    />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Apollo server landing page" />
    <link
      rel="apple-touch-icon"
      href="https://apollo-server-landing-page.cdn.apollographql.com/${version}/assets/favicon.png"
    />
    <link
      rel="manifest"
      href="https://apollo-server-landing-page.cdn.apollographql.com/${version}/manifest.json"
    />
    <title>Apollo Server</title>
  </head>
  <body style="margin: 0; overflow-x: hidden; overflow-y: hidden">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="react-root">
      <style>
        .fallback {
          opacity: 0;
          animation: fadeIn 1s 1s;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          padding: 1em;
        }
        @keyframes fadeIn {
          0% {opacity:0;}
          100% {opacity:1; }
        }
      </style>
    ${config.embed
                        ? 'graphRef' in config && config.graphRef
                            ? (0, exports.getEmbeddedExplorerHTML)(version, config)
                            : (0, exports.getEmbeddedSandboxHTML)(version, config)
                        : getNonEmbeddedLandingPageHTML(version, config)}
    </div>
  </body>
</html>
          `;
                    return { html };
                },
            };
        },
    };
}
//# sourceMappingURL=index.js.map