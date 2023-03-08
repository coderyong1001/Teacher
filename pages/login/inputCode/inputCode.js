// pages/login/inputCode/inputCode.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  getSmsCode,
  smsCodeLogin
} from '../../../service/login-service'
import { ShowToast } from '../../../utils/show_toast_loading_modal';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeLength: 6,
    type: 'number',
    isFocus: true,
    code: '',
    msgTime: 60,
    active: false,
    isHidden: true,
    tel: '',
    timestamp: '' // 保存获取短信验证码时的时间戳
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tel: options.tel,
      timestamp: Date.parse(new Date())
    })
    this.timeCut()
  },
  focusBox() {
    this.setData({
      isFocus: true
    })
  },
  inputCode(e) {
    this.setData({
      code: e.detail.value
    }, () => {
      if (this.data.code.length === 6) {
        this.submitCode()
      }
    })
  },
  // 登录
  async submitCode() {
    const {
      tel,
      code
    } = this.data
    if (code.length === 6) {
      wx.login({
        success: async (res) => {
          if (res.code) {
            let params = {
              tel,
              sms_code: code,
              js_code: res.code
            }
            let smsCodeLoginRes = await smsCodeLogin(params)
            if (smsCodeLoginRes.data.code === 10003) {
              this.setData({
                code: ''
              })
              ShowToast('验证码错误')
              return
            }
            wx.hideKeyboard()
            wx.setStorageSync('token', smsCodeLoginRes.data.data.token)
            wx.setStorageSync('openId', smsCodeLoginRes.data.data.openid)
            wx.setStorageSync('user_id', smsCodeLoginRes.data.data.user_id)
            wx.setStorageSync('isRegister', smsCodeLoginRes.data.data.user_info)
            if (!smsCodeLoginRes.data.data.user_info) {
              wx.redirectTo({
                url: '/pages/login/fillInfo/fillInfo'
              })
              return
            }
            let redirectUrl = wx.getStorageSync('redirectUrl')
            if (redirectUrl) {
              wx.redirectTo({
                url: `/${redirectUrl}`
              })
              wx.removeStorageSync('redirectUrl')
            } else {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
            
          }
        }
      })
      
    }
  },
  // 短信验证码倒计时
  timeCut() {
    let promise = new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.data.msgTime <= 0) {
          this.setData({
            msgTime: 60,
            active: true
          })
          clearInterval(timer)
          return
        }
        let currentTime = 60 - (Date.parse(new Date()) - this.data.timestamp) / 1000
        this.setData({
          msgTime: currentTime
        })
      }, 1000)
    })
    promise.then((timer) => {
      clearInterval(timer)
    })
  },
  // 重新获取短信验证码
  async regainCode() {
    const {
      tel
    } = this.data
    let params = {
      tel
    }
    await getSmsCode(params)
    this.setData({
      active: false,
      timestamp: Date.parse(new Date())
    }, () => {
      this.timeCut()      
    })

  }
})