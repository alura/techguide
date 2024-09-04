function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.indexOf(n) >= 0) continue;
    t[n] = r[n];
  }
  return t;
}
export { _objectWithoutPropertiesLoose as default };