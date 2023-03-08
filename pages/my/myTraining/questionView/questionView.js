// pages/my/myTraining/questionView/questionView.js
const app = getApp()
Page({
  data:{
    websrc: app.globalData.websrc
  },
  onLoad: function(options) {
    this.setData({
      websrc: app.globalData.websrc
    })
  }
})