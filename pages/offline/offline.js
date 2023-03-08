// pages/offline/offline.js
Page({
  refreshPage() {
    let redirectUrl = wx.getStorageSync('redirectUrl')
    wx.redirectTo({
      url: `/${redirectUrl}`
    })
  }
})