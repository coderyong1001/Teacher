/**
 * 获取时间的函数
 * @param {date} String 日期
 * @param {formatType} String 格式的类型
 *  formatType: 按需取
 *  'MM.DD'
 *  'MM月DD日'
 *  'hh:mm'
 */
var getMonthDayHM = function (strDate, formatType) {
  // 解决ios出现NaN问题
  var realDate = strDate ? new Date(strDate.replace(('-', 'g'), '/')) : new Date()
  var year = realDate.getFullYear()
  var month = realDate.getMonth() + 1
  var day = realDate.getDate()
  var hour = realDate.getHours()
  var minute = realDate.getMinutes()
  var second = realDate.getSeconds()
  month < 10 ? month = '0' + month : month
  day < 10 ? day = '0' + day : day
  hour < 10 ? hour = '0' + hour : hour
  minute < 10 ? minute = '0' + minute : minute
  second < 10 ? second = '0' + second : second
  formatType = formatType.replace('YYYY', year)
  formatType = formatType.replace('MM', month)
  formatType = formatType.replace('DD', day)
  formatType = formatType.replace('hh', hour)
  formatType = formatType.replace('mm', minute)
  formatType = formatType.replace('ss', second)
      
  return formatType
}

export { getMonthDayHM }