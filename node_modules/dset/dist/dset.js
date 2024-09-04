module.exports = function (obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, l=keys.length, t=obj, x, k;
	for (; i < l;) {
		k = keys[i++];
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
		t = t[k] = (i === l ? val : ((x=t[k]) != null ? x : (keys[i]*0 !== 0 || !!~keys[i].indexOf('.')) ? {} : []));
	}
}
