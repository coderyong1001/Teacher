Component({
  properties: {
    header: {
      type: Object,
      value: {
        title: '默认标题',
        isindex: false
      }
    },
    /**
     * 自定义返回事件处理
     * customBackReturn="{{true}}" bind:customBackReturn="customBackReturn"
     */
    customBackReturn: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    backClick() {
      if (this.data.customBackReturn) {
        this.triggerEvent("customBackReturn")
      } else {
        if (getCurrentPages().length == 1) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    },
    homeClick() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  attached() {
    var self = this;
    wx.getSystemInfo({
      success(res) {
        var isIos = res.system.indexOf('iOS') > -1;
        self.setData({
          statusHeight: res.statusBarHeight,
          navHeight: isIos ? 44 : 48
        })
      }
    })
  }
})