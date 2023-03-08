Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgTime: 5,
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timeCut()
  },
  onHide() {
    let timer = this.data.timer
    clearInterval(timer)
  },
  onUnload() {
    let timer = this.data.timer
    clearInterval(timer)
  },
  // 短信验证码倒计时
  timeCut () {
    let promise = new Promise((resolve) => {
      let currentTime = this.data.msgTime
      let timer = this.data.timer          
      timer = setInterval(() => {       
        if (this.data.msgTime <= 0) {
          this.goMyOrder()
          this.setData({
            msgTime: 0,
            active: true
          })
          clearInterval(timer)
          return
        }
        let currentTIme = this.data.msgTime
        currentTIme --
        this.setData({
          msgTime: currentTIme
        })
      }, 1000)
      this.setData({
        timer
      })
    })
    promise.then((timer) => {
      clearInterval(timer)
    })
    
  },
  // 去我的订单
  goMyOrder() {
    wx.navigateTo({
      url: '/pages/my/order/order'
    })
  }
})