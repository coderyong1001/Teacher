// pages/login/login.js
import pattern from '../../utils/pattern'
import {getSmsCode} from '../../service/login-service'
import { ShowToast } from '../../utils/show_toast_loading_modal';
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: null,
    isHidden: true,
    name: '张三'
  },
  // 监听input事件
  inputPhone(e){
    let val = e.detail.value
    this.setData({
      tel: val
    }, () => {
      if (!this.data.tel) {
        this.setData({
          isHidden: true
        })
      }
    })
  },
  // 发送短信验证码
  handleClick () {
    const { tel } = this.data
    if (!tel) {
      ShowToast('请输入手机号码')
      return
    }
    let regTel = pattern.mobile.test(tel)
    this.setData({
      isHidden: regTel
    }, async () => {
      if (!this.data.isHidden) {
        ShowToast('请输入正确的手机号码')
        return
      }
      let params = {
        tel
      }
      await getSmsCode(params)
      wx.navigateTo({
        url: `/pages/login/inputCode/inputCode?tel=${tel}`,
      })
    })
    
  }
})