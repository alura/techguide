'use strict';

module.exports = function (toReversed, t) {
	var three = [1, 2, 3];
	var result = toReversed(three);
	t.deepEqual(
		result,
		[3, 2, 1],
		'array is reversed'
	);
	t.notEqual(three, result, 'original array is not returned');
	t.deepEqual(three, [1, 2, 3], 'original array is unchanged');

	three.reverse();
	t.deepEqual(three, result, 'mutated original matches result');

	t.deepEqual(toReversed({ length: '2', 0: 1, 1: 2, 2: 3 }), [2, 1]);

	var arrayLikeLengthValueOf = {
		length: {
			valueOf: function () { return 2; }
		},
		0: 1,
		1: 2,
		2: 3
	};
	t.deepEqual(toReversed(arrayLikeLengthValueOf), [2, 1]);

	t.test('not positive integer lengths', function (st) {
		st.deepEqual(toReversed({ length: -2 }), []);
		st.deepEqual(toReversed({ length: 'dog' }), []);
		st.deepEqual(toReversed({ length: NaN }), []);

		st.end();
	});

	t.test('too-large lengths', function (st) {
		var arrayLike = {
			0: 0,
			4294967295: 4294967295,
			4294967296: 4294967296,
			length: Math.pow(2, 32)
		};

		st['throws'](
			function () { toReversed(arrayLike); },
			RangeError
		);

		st.end();
	});

	t.deepEqual(toReversed(true), [], 'true yields empty array');
	t.deepEqual(toReversed(false), [], 'false yields empty array');

	t.test('getters', { skip: !Object.defineProperty }, function (st) {
		var called = [];
		var o = [0, 1, 2];
		Object.defineProperty(o, '0', {
			enumerable: true,
			get: function () {
				called.push(0);
				return 'a';
			}
		});
		Object.defineProperty(o, '1', {
			enumerable: true,
			get: function () {
				called.push(1);
				return 'b';
			}
		});
		Object.defineProperty(o, '2', {
			enumerable: true,
			get: function () {
				called.push(2);
				return 'c';
			}
		});

		st.deepEqual(
			toReversed(o),
			['c', 'b', 'a'],
			'array with getters is reversed as expected'
		);
		st.deepEqual(
			called,
			[2, 1, 0],
			'indexes are retrieved in reverse order'
		);

		var arr1 = [0, 1, 2];
		Object.defineProperty(arr1, '0', {
			get: function () {
				arr1.push(4);
				return 0;
			}
		});

		st.deepEqual(toReversed(arr1), [2, 1, 0]);

		var arr = [0, 1, 2, 3, 4];

		Array.prototype[1] = 5; // eslint-disable-line no-extend-native
		st.teardown(function () {
			delete Array.prototype[1];
		});

		Object.defineProperty(arr, '3', {
			get: function () {
				arr.length = 1;
				return 3;
			}
		});

		st.deepEqual(toReversed(arr), [4, 3, undefined, 5, 0]);

		st.end();
	});

	t.deepEqual(
		toReversed('abc'),
		['c', 'b', 'a'],
		'string reverses to array'
	);
	var halfPoo = '\uD83D';
	var endPoo = '\uDCA9';
	var poo = halfPoo + endPoo;
	t.deepEqual(
		toReversed('a' + poo + 'c'),
		['c', endPoo, halfPoo, 'a'],
		'code point is split as expected'
	);
};
