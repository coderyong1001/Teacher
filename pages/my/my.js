// pages/my/my.js
import {
  getUserInfo
} from '../../service/my-service.js';
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellItem: [
      {
        id: 1,
        itemIcon: '/assets/images/order-icon.png',
        itemName: '我的订单',
        link: '/pages/my/order/order',
        cellType: 'common'
      },
      {
        id: 2,
        itemIcon: '/assets/images/training-icon.png',
        itemName: '我的培训',
        link: '/pages/my/myTraining/myTraining',
        cellType: 'common'
      },
      {
        id: 3,
        itemIcon: '/assets/images/contact-icon.png',
        itemName: '我的同伴',
        link: '/pages/my/myContact/myContact',
        cellType: 'common'
      },
      // {
      //   id: 4,
      //   itemIcon: '/assets/images/question-icon.png',
      //   itemName: '问卷调查',
      //   link: '/pages/my/questionnaire/questionnaire',
      //   cellType: 'common'
      // },
      {
        id: 4,
        itemIcon: '/assets/images/signin-icon.png',
        itemName: '签到',
        link: '/pages/my/signIn/signIn',
        cellType: 'common'
      },
      {
        id: 5,
        itemIcon: '/assets/images/question-icon.png',
        itemName: '电子证书',
        link: '/pages/my/ETC/ETC',
        noBt: true,
        cellType: 'common'
      },
      {
        id: 6,
        cellType: 'space'
      },
      {
        id: 7,
        itemIcon: '/assets/images/aboutus-icon.png',
        itemName: '关于我们',
        link: '/pages/my/aboutUs/aboutUs',
        cellType: 'common'
      },
      {
        id: 8,
        itemIcon: '/assets/images/opinion-icon.png',
        itemName: '意见反馈',
        link: '/pages/my/opinion/opinion',
        cellType: 'common'
      },
      {
        id: 9,
        cellType: 'space'
      },
    ],
    userInfo: {
      name: '',
      pic: '',
      city: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  },
  clickPersonal () {
    wx.navigateTo({
      url: '/pages/my/personalCenter/personalCenter',
    })
  },
  logOut(){
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      confirmColor:"#018389",
      success (res) {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } catch(e) {
            // Do something when catch error
            console.log('退出失败')
          }
        } else if (res.cancel) {
        }
      }
    })
  },
  async getInfo () {
    //优先取storage数据，如果无，则向后台获取并存储到storage
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      await this.getInfoFromServe()
    }
    this.setData({
      userInfo
    })
  },
  async refresh (userInfo) {
    //重新获取个人数据并存储
    if (!userInfo) {
      userInfo = await this.getInfoFromServe()
    }
    wx.setStorageSync('userInfo', userInfo)
    this.setData({
      userInfo
    })
  },

  async getInfoFromServe () {
    let res = await getUserInfo();
    let data = res.data.data
    wx.getUserInfo({
      success: (res) => {
        let userInfo = res.userInfo
        let infoObj = {
          name: data.nickname || userInfo.nickName,
          pic: data.pic || userInfo.avatarUrl,
          city: data.province === data.city ? ( data.city + data.district ) : ( data.province + data.city + data.district )
        }
        this.setData({
          userInfo: infoObj
        })
        wx.setStorageSync('userInfo', infoObj)
      }
    })
  },
  
  goETC () {
    wx.navigateTo({
      url: '/pages/my/ETC/ETC',
    })
  },
  goPersonalCenter () {
    wx.navigateTo({
      url: '/pages/my/personalCenter/personalCenter',
    })
  },
  goMyOrder () {
    wx.navigateTo({
      url: '/pages/my/order/order',
    })
  },
  goMyTraining () {
    wx.navigateTo({
      url: '/pages/my/myTraining/myTraining',
    })
  },
  goMyContact () {
    wx.navigateTo({
      url: '/pages/my/myContact/myContact',
    })
  },
  goQuestionnaire () {
    wx.navigateTo({
      url: '/pages/my/questionnaire/questionnaire',
    })
  },
  goSignIn () {
    wx.navigateTo({
      url: '/pages/my/signIn/signIn',
    })
  },
  goAboutUs () {
    wx.navigateTo({
      url: '/pages/my/aboutUs/aboutUs',
    })
  },
  goOpinion () {
    wx.navigateTo({
      url: '/pages/my/opinion/opinion',
    })
  },
})