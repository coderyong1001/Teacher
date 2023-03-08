/**
 * 小程序请求拦截器
 */

// 封装网络请求
/**
 * 
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @param {string} method 请求方式
 */
import {
  ShowToast
} from '../utils/show_toast_loading_modal'
import urlEncode from '../utils/url_encode'
import forceNavigate from '../utils/force_navigate'
let Ajax = (url, data, method) => {
  // 请求拦截
  return new Promise((resolve, reject) => {
      if (url.indexOf('/invoice/template') === -1) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
      }
      
      // 请求封装
      wx.request({
        url: url + '/',
        data: data,
        method: method,
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bear ' + wx.getStorageSync('token'),
        },
        success: (res) => {
          // 成功状态码判断
          if (res.statusCode === 200) {
            if (url.indexOf('/invoice/template') === -1) {
              wx.hideLoading()
            }
            //204是删除成功, 10044开发票时查询不到相关单位
            if (res.data.code === 200 || res.data.code === 204 || res.data.code === 10003 || res.data.code === 1111 || res.data.code === 10044) {
              return resolve(res)
            } else if (res.statusCode === 400) {
              ShowToast('参数错误')
            } else if (res.statusCode === 404) {
              ShowToast('资源未找到')
            } else if (res.data.code === 401) {
              forceNavigate('登录过期，请重新登录', '/pages/login/login')
            } else if (res.data.code === 33333) {
              forceNavigate('请完善个人信息', '/pages/login/fillInfo/fillInfo')
            } else {
              ShowToast(res.data.msg)
            }         
          } else if(res.statusCode === 401) {
            forceNavigate('登录过期，请重新登录', '/pages/login/login')
          }
        },
        fail: (failres) => {
          wx.hideLoading()
          wx.getNetworkType({
            success: resNetwork => {
              if (resNetwork.networkType === 'none') {
                forceNavigate('网络不给力', '/pages/offline/offline')
              }
            }
          })

          reject(failres)
        },
        complete: function (res) {
          if (res.statusCode !== 200 && res.statusCode !== 401) {
            if (url.indexOf('/invoice/template') === -1) {
              wx.hideLoading()
            }
            ShowToast(res.data.msg)            
          }
          if (res.errMsg && res.errMsg === 'request:fail ') {
            ShowToast('资源获取失败')                        
          }              
        }
      })
    })
    .catch(
      err => {
        return Promise.reject(err)
      }
    )
}

let upFile = (url, filePath, name) => {
  // 请求拦截
  return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      // 请求封装
      wx.uploadFile({
        url: url + '/',
        filePath: filePath,
        name: name,
        header: {
          'authorization': 'Bear ' + wx.getStorageSync('token'),
        },
        success: (res) => {
           // 成功状态码判断
           if (res.statusCode === 200) {
            wx.hideLoading()
            res.data = JSON.parse(res.data)
            //204是删除成功
            if (res.data.code === 200 || res.data.code === 204) {
              return resolve(res)
            } else if (res.statusCode === 400) {
              ShowToast('参数错误')
            } else if (res.statusCode === 404) {
              ShowToast('资源未找到')
            } else if (res.data.code === 401) {
              forceNavigate('登录过期，请重新登录', '/pages/login/login')
            } else {
              ShowToast(res.data.msg)
              // 登录时重复新增个人信息错误处理
              if (res.data.code === 10110) {
                let redirectUrl = wx.getStorageSync('redirectUrl')
                wx.setStorageSync('isRegister', true)
                if (redirectUrl) {
                  wx.reLaunch({
                    url: `/${redirectUrl}`
                  })
                  wx.removeStorageSync('redirectUrl')
                } else {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            }         
          }
        },
        fail: (error) => {
          console.log('failError:', error)
          wx.getNetworkType({
            success: resNetwork => {
              if (resNetwork.networkType === 'none') {
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                let route = currentPage.route
                let redirectUrl = ''
                for (let key in currentPage.options) {
                  if (key === '__key_') {
                    delete currentPage.options[key]
                  }
                }
                if (JSON.stringify(currentPage.options) === '{}') {
                  redirectUrl = route
                } else {
                  let params = urlEncode(currentPage.options)
                  redirectUrl = `${route}?${params}`
                }
                wx.setStorageSync('redirectUrl', redirectUrl)
                wx.navigateTo({
                  url: '/pages/offline/offline',
                })
              }

            }
          })
          reject(error)
        },
        complete: function () {
          wx.hideLoading()
        }
      })
      // .catch(
      //   err => console.log('requestErr:', err)
      // )
    })
    .catch(
      err => {
        return Promise.reject(err)
      }
    )
}

// get请求
let get = (url, data) => {
  return Ajax(url, data, 'GET')
}

// post请求
let post = (url, data) => {
  return Ajax(url, data, 'POST')
}

// put请求
let put = (url, data) => {
  return Ajax(url, data, 'PUT')
}

let del = (url, data) => {
  return Ajax(url, data, 'DELETE')
}
export default { 
  get, 
  post, 
  put, 
  del,
  upFile 
}

