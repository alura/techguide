"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIsInternal = void 0;
function pluginIsInternal(plugin) {
    return '__internal_plugin_id__' in plugin;
}
exports.pluginIsInternal = pluginIsInternal;
//# sourceMappingURL=internalPlugin.js.map