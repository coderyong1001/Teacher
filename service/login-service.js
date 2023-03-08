import baseUrl from './baseUrl.js'
import http from './service.js'
// 获取短信验证码
export const getSmsCode = params => {
  return http.post(baseUrl + '/send_sms_code', params)
}
// 登录
export const smsCodeLogin = params => {
  return http.post(baseUrl + '/login', params)
}
//首次填写个人信息
export const setMyInfo = params => {
  return http.post(baseUrl + '/user_info', params)
}
