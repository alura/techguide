'use strict';

const Hoek = require('@hapi/hoek');
const Boom = require('@hapi/boom');


const internals = {};


exports.selection = function (header, preferences) {

    const selections = exports.selections(header, preferences);
    return selections.length ? selections[0] : '';
};


exports.selections = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    return internals.parse(header, preferences);
};


//      RFC 7231 Section 5.3.2 (https://tools.ietf.org/html/rfc7231#section-5.3.2)
//
//      Accept          = [ ( "," / ( media-range [ accept-params ] ) ) *( OWS "," [ OWS ( media-range [ accept-params ] ) ] ) ]
//      media-range     = ( "*/*" / ( type "/*" ) / ( type "/" subtype ) ) *( OWS ";" OWS parameter )
//      accept-params   = weight *accept-ext
//      accept-ext      = OWS ";" OWS token [ "=" ( token / quoted-string ) ]
//      type            = token
//      subtype         = token
//      parameter       = token "=" ( token / quoted-string )
//
//      quoted-string   = DQUOTE *( qdtext / quoted-pair ) DQUOTE
//      qdtext          = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
//      obs-text        = %x80-FF
//      quoted-pair     = "\" ( HTAB / SP / VCHAR / obs-text )
//      VCHAR           = %x21-7E                                ; visible (printing) characters
//      token           = 1*tchar
//      tchar           = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
//      OWS             = *( SP / HTAB )
//
//      Accept: audio/*; q=0.2, audio/basic
//      Accept: text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c
//      Accept: text/plain, application/json;q=0.5, text/html, */*; q = 0.1
//      Accept: text/plain, application/json;q=0.5, text/html, text/drop;q=0
//      Accept: text/*, text/plain, text/plain;format=flowed, */*
//      Accept: text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5


//      RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)
//
//      The weight is normalized to a real number in the range 0 through 1,
//      where 0.001 is the least preferred and 1 is the most preferred; a
//      value of 0 means "not acceptable".  If no "q" parameter is present,
//      the default weight is 1.
//
//       weight = OWS ";" OWS "q=" qvalue
//       qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )


//                         */*        type/*                              type/subtype
internals.validMediaRx = /^(?:\*\/\*)|(?:[\w\!#\$%&'\*\+\-\.\^`\|~]+\/\*)|(?:[\w\!#\$%&'\*\+\-\.\^`\|~]+\/[\w\!#\$%&'\*\+\-\.\^`\|~]+)$/;


internals.parse = function (raw, preferences) {

    // Normalize header (remove spaces and temporary remove quoted strings)

    const { header, quoted } = internals.normalize(raw);

    // Parse selections

    const parts = header.split(',');
    const selections = [];
    const map = {};

    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        if (!part) {                                    // Ignore empty parts or leading commas
            continue;
        }

        // Parse parameters

        const pairs = part.split(';');
        const token = pairs.shift().toLowerCase();

        if (!internals.validMediaRx.test(token)) {       // Ignore invalid types
            continue;
        }

        const selection = {
            token,
            params: {},
            exts: {},
            pos: i
        };

        // Parse key=value

        let target = 'params';
        for (const pair of pairs) {
            const kv = pair.split('=');
            if (kv.length !== 2 ||
                !kv[1]) {

                throw Boom.badRequest(`Invalid accept header`);
            }

            const key = kv[0];
            let value = kv[1];

            if (key === 'q' ||
                key === 'Q') {

                target = 'exts';

                value = parseFloat(value);
                if (!Number.isFinite(value) ||
                    value > 1 ||
                    (value < 0.001 && value !== 0)) {

                    value = 1;
                }

                selection.q = value;
            }
            else {
                if (value[0] === '"') {
                    value = `"${quoted[value]}"`;
                }

                selection[target][kv[0]] = value;
            }
        }

        const params = Object.keys(selection.params);
        selection.original = [''].concat(params.map((key) => `${key}=${selection.params[key]}`)).join(';');
        selection.specificity = params.length;

        if (selection.q === undefined) {     // Default no preference to q=1 (top preference)
            selection.q = 1;
        }

        const tparts = selection.token.split('/');
        selection.type = tparts[0];
        selection.subtype = tparts[1];

        map[selection.token] = selection;

        if (selection.q) {                   // Skip denied selections (q=0)
            selections.push(selection);
        }
    }

    // Sort selection based on q and then position in header

    selections.sort(internals.sort);

    return internals.preferences(map, selections, preferences);
};


internals.normalize = function (raw) {

    raw = raw || '*/*';

    const normalized = {
        header: raw,
        quoted: {}
    };

    if (raw.includes('"')) {
        let i = 0;
        normalized.header = raw.replace(/="([^"]*)"/g, ($0, $1) => {

            const key = '"' + ++i;
            normalized.quoted[key] = $1;
            return '=' + key;
        });
    }

    normalized.header = normalized.header.replace(/[ \t]/g, '');
    return normalized;
};


internals.sort = function (a, b) {

    // Sort by quality score

    if (b.q !== a.q) {
        return b.q - a.q;
    }

    // Sort by type

    if (a.type !== b.type) {
        return internals.innerSort(a, b, 'type');
    }

    // Sort by subtype

    if (a.subtype !== b.subtype) {
        return internals.innerSort(a, b, 'subtype');
    }

    // Sort by specificity

    if (a.specificity !== b.specificity) {
        return b.specificity - a.specificity;
    }

    return a.pos - b.pos;
};


internals.innerSort = function (a, b, key) {

    const aFirst = -1;
    const bFirst = 1;

    if (a[key] === '*') {
        return bFirst;
    }

    if (b[key] === '*') {
        return aFirst;
    }

    return a[key] < b[key] ? aFirst : bFirst;       // Group alphabetically
};


internals.preferences = function (map, selections, preferences) {

    // Return selections if no preferences

    if (!preferences ||
        !preferences.length) {

        return selections.map((selection) => selection.token + selection.original);
    }

    // Map wildcards and filter selections to preferences

    const lowers = Object.create(null);
    const flat = Object.create(null);
    let any = false;

    for (const preference of preferences) {
        const lower = preference.toLowerCase();
        flat[lower] = preference;
        const parts = lower.split('/');
        const type = parts[0];
        const subtype = parts[1];

        if (type === '*') {
            Hoek.assert(subtype === '*', 'Invalid media type preference contains wildcard type with a subtype');
            any = true;
            continue;
        }

        lowers[type] = lowers[type] || Object.create(null);
        lowers[type][subtype] = preference;
    }

    const preferred = [];
    for (const selection of selections) {
        const token = selection.token;
        const { type, subtype } = map[token];
        const subtypes = lowers[type];

        // */*

        if (type === '*') {
            for (const preference of Object.keys(flat)) {
                if (!map[preference]) {
                    preferred.push(flat[preference]);
                }
            }

            if (any) {
                preferred.push('*/*');
            }

            continue;
        }

        // any

        if (any) {
            preferred.push((flat[token] || token) + selection.original);
            continue;
        }

        // type/subtype

        if (subtype !== '*') {
            const pref = flat[token];
            if (pref ||
                (subtypes && subtypes['*'])) {

                preferred.push((pref || token) + selection.original);
            }

            continue;
        }

        // type/*

        if (subtypes) {
            for (const psub of Object.keys(subtypes)) {
                if (!map[`${type}/${psub}`]) {
                    preferred.push(subtypes[psub]);
                }
            }
        }
    }

    return preferred;
};
