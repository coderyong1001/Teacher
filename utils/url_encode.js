const urlEncode = (data) => {
  var _result = []
  for (var key in data) {
    var value = data[key]
    if (value.constructor === Array) {
      value.forEach(function (_value) {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}
export default urlEncode