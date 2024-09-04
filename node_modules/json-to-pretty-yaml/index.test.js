const YAML = require('./index.js');

let title;
let input;
let expected;
const runTest = (title, input, expected) => {
    test(title, () => {
        expect(YAML.stringify(input)).toBe(expected);
    });
};

runTest('basic conversion',
    {
        a: 1,
        b: 'yes',
        c: true
    },
    (
        'a: 1'     + '\n' +
        'b: "yes"' + '\n' +
        'c: true'  + '\n'
    )
);

runTest('basic arrays',
    {
        a: [ 1, 2, 3 ],
        b: [ 'yes', 'no' ],
        c: [ true, false ]
    },
    (
        'a:'        + '\n' +
        '  - 1'     + '\n' +
        '  - 2'     + '\n' +
        '  - 3'     + '\n' +
        'b:'        + '\n' +
        '  - "yes"' + '\n' +
        '  - "no"'  + '\n' +
        'c:'        + '\n' +
        '  - true'  + '\n' +
        '  - false' + '\n'
    )
);

runTest('nested objects',
    {
        a: {
            b: {
                c: {
                    d: 1
                }
            }
        }
    },
    (
        'a:'         + '\n' +
        '  b:'       + '\n' +
        '    c:'     + '\n' +
        '      d: 1' + '\n'
    )
);

runTest('arrays of objects',
    {
        a: [
            {
                b: {
                    c: [ 1, 2, 3 ]
                }
            },
            {
                d: {
                    e: 'yee'
                },
                f: {
                    g: 'ok'
                },
                h: 12
            }
        ]
    },
    (
        'a:'              + '\n' +
        '  - b:'          + '\n' +
        '      c:'        + '\n' +
        '        - 1'     + '\n' +
        '        - 2'     + '\n' +
        '        - 3'     + '\n' +
        '  - d:'          + '\n' +
        '      e: "yee"'  + '\n' +
        '    f:'          + '\n' +
        '      g: "ok"' + '\n' +
        '    h: 12'       + '\n'
    )
);