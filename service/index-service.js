import baseUrl from './baseUrl.js'
import http from './service.js'

// 获取课程列表
export const getCourseList = params => {
  return http.get(baseUrl + '/course', params)
}
// 获取课程详情
export const getCourseDetail = (id) => {
  return http.get(baseUrl + `/course_detail/${id}`)
}
// 获取用户和酒店信息
export const getUserHotelInfo = params => {
  return http.get(baseUrl + '/sign_up', params)
}
// 获取用户和酒店信息
export const getContact = params => {
  return http.get(baseUrl + '/contact', params)
}
// 提交订单
export const submitOrder = params => {
  return http.post(baseUrl + '/order', params)
}
// 支付订单
export const payOrder = params => {
  return http.post(baseUrl + '/order/pay', params)
}

// 更新住宿信息(获取酒店信息)
export const getHotelInfos = params => {
  return http.get(`${baseUrl}/order/hotels`, params)
}
// 更新住宿信息
export const updateHtotelInfo = params => {
  return http.post(`${baseUrl}/order/accommodation`, params)
}