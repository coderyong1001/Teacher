export default {
  number: /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/,
  decimal: /(^0\.?\d*$)|(^[1-9]+\.?\d*$)/,
  pinyin: /^([A-Z][a-z]*|[a-z]+|[\u4E00-\u9FA5]+|\d+)$/g,
  english: /^[a-zA-Z]+$/,
  chinese: /^[\u4E00-\u9FA5]+$/,
  percent: /^(0|([1-9]\d{0,1})|100)$/, // 0-100整数
  captcha: /^[0-9A-Za-z]{4}$/,
  code: /^[0-9]{4}$/,
  mobile: /^1[3456789]\d{9}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  idCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
}