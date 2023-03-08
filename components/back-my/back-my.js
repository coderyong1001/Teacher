// components/back-my/back-my.js
var app = getApp()
import { ShowToast } from '../../utils/show_toast_loading_modal'
import forceNavigate from '../../utils/force_navigate'
Component({
  /**
   * 组件的属性列表
   * 返回个人中心的组件
   */
  properties: {
    pagePay: { // 使用在支付页面
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(res) {
      if (!res.detail.userInfo) {
        ShowToast('需要授权才能支付！')
        return
      }
      let token = wx.getStorageSync('token')
      if (token) {
        wx.navigateTo({
          url: '/pages/my/my',
        })
      } else {
        app.globalData.userInfo = res.detail.userInfo
        forceNavigate('请登录', '/pages/login/login')
      }
    }
  }
})