"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clusterEndpointMapReverse = exports.clusterEndpointMap = exports.cloudApiEndpoint = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
exports.cloudApiEndpoint = process.env['CLOUD_API_ENDPOINT'] || 'https://api.cloud.prisma.sh';
exports.clusterEndpointMap = {
    'prisma-eu1': 'https://eu1.prisma.sh',
    'prisma-us1': 'https://us1.prisma.sh',
};
exports.clusterEndpointMapReverse = lodash_1.default.invert(exports.clusterEndpointMap);
