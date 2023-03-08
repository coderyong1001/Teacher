import baseUrl from './baseUrl.js'
import http from './service.js'
export const login = params => {
  return http.post(baseUrl + '/login', params)
}
//获取个人信息
export const getUserInfo = params => {
  return http.get(baseUrl + '/user_info/get_userinfo', params);
}

//修改个人信息
export const putUserInfo = params => {
  return http.put(baseUrl + '/user_info/update_userinfo', params);
}

//获取联系人列表和获取单个联系人
export const getMyConcat = params => {
  if (typeof params !== 'object' && params) {
    return http.get(baseUrl + `/contact/${params}`);
  } else {
    return http.get(baseUrl + '/contact', params);
  }
}

//删除联系人
export const delMyContact = id => {
  return http.del(baseUrl + `/contact/${id}`);
}

//添加新的联系人和修改联系人
export const addConcat = (params, id) => {
  if (id) {
    return http.put(baseUrl + `/contact/${id}`, params);
  } else {
    return http.post(baseUrl + '/contact', params);
  }
}

//上传头像
export const upHead = (filePath, name) => {
  return http.upFile(baseUrl + '/file_upload', filePath, name)
}

//获取问卷调查问题1

export const getquestion = params => {
  return http.get(baseUrl + '/questionare/course', params)
}

//提交问卷
export const commitQuestionare = params => {
  return http.post(baseUrl + '/questionare', params);
}

//意见反馈
export const feedback = params => {
  return http.post(baseUrl + '/feedback', params);
}

//我的培训
 export const myTraning = params => {
   return http.get( baseUrl + '/user_course', params )
 }

// 订单列表
export const getOrders = params => {
  return http.get(baseUrl + '/order', params);
}
// 取消订单
export const cancelOrder = params => {
  return http.post(baseUrl + '/order/cancel', params);
}
// 删除订单
export const deleteOrder = params => {
  return http.post(baseUrl + '/order/delete', params);
}
// 订单详情
export const orderDetail = orderId => {
  return http.get(`${baseUrl}/order/${orderId}`)
}

// 申请退款
export const refund = params => {
  return http.post(baseUrl + '/order/refund', params);
}
// 取消退款
export const cancelRefund = params => {
  return http.post(`${baseUrl}/order/cancel_refund`, params)
}
// 开发票订单列表
export const getInvoiceOrders = params => {
  return http.get(baseUrl + '/invoice_order', params);
}


//获取签到列表
export const getSignList = params => {
  return http.get(baseUrl + '/checkin', params)
}

//获取签到详情
export const getSignDetail = id => {
  return http.get(baseUrl + `/checkin/${id}`)
}

//签到
export const sign = (params) => {
  return http.post(baseUrl + '/checkin/check', params)
}
// 开发票的课程列表
export const getInvoiceCourse = params => {
  return http.get(baseUrl + '/invoice_order/course', params);
}
// 开发票下一步
export const invoiceNext = params => {
  return http.post(baseUrl + '/invoice_order', params);
}
// 新建发票
export const makeInvoice = params => {
  return http.post(baseUrl + '/invoice', params);
}
// 开票历史列表
export const getInvoiceHistory = params => {
  return http.get(baseUrl + '/invoice', params);
}
// 开票历史详情
export const getInvoiceDetail = id => {
  return http.get(baseUrl + `/invoice/${id}`);
}
// 收集订单活动列表
export const getCollectionOrder = params => {
  return http.get(baseUrl + '/collection', params);
}
// 去收集
export const goCollection = params => {
  return http.post(baseUrl + '/collection', params);
}
// 分享订单获取列表
export const getShareOrder = params => {
  return http.get(baseUrl + '/share', params);
}
// 分享订单获取列表
export const share = params => {
  return http.post(baseUrl + '/share', params);
}

// 订单列表上传支付凭证
export const voucher = params => {
  return http.post(baseUrl + '/order/voucher', params);
}

// 发票信息(报名)
export const getInvoiceInfo = params => {
  return http.post(`${baseUrl}/order/invoice_info`, params);
}

// 发票模板
export const getInvoiceTemp = params => {
  return http.get(baseUrl + '/invoice/template', params);
}

// 发票信息(修改)
export const getInvoiceInfoUpdate = params => {
  return http.get(`${baseUrl}/invoice/info`, params)
}
// 开发票(修改)
export const updateInvoiceInfo = params => {
  return http.post(`${baseUrl}/invoice/update_info`, params)
}
// 电子证书列表
export const getETCList = params => {
  return http.get(`${baseUrl}/certs`, params)
}