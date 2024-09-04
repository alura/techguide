'use strict';

const Header = require('./header');
const Media = require('./media');


const internals = {
    options: {
        charset: {
            type: 'accept-charset'
        },
        encoding: {
            type: 'accept-encoding',
            default: 'identity',
            equivalents: new Map([
                ['x-compress', 'compress'],
                ['x-gzip', 'gzip']
            ])
        },
        language: {
            type: 'accept-language',
            prefixMatch: true
        }
    }
};


for (const type in internals.options) {
    exports[type] = (header, preferences) => Header.selection(header, preferences, internals.options[type]);

    exports[`${type}s`] = (header, preferences) => Header.selections(header, preferences, internals.options[type]);
}


exports.mediaType = (header, preferences) => Media.selection(header, preferences);

exports.mediaTypes = (header, preferences) => Media.selections(header, preferences);


exports.parseAll = function (requestHeaders) {

    return {
        charsets: exports.charsets(requestHeaders['accept-charset']),
        encodings: exports.encodings(requestHeaders['accept-encoding']),
        languages: exports.languages(requestHeaders['accept-language']),
        mediaTypes: exports.mediaTypes(requestHeaders.accept)
    };
};
