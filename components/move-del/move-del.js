// components/move-del/move-del.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      disable: {
          type: Boolean,
          value: false,
      },
    },
  
    /**
     * 组件的初始数据
     */
    data: {
        start: 0,
        startY: 0,
        intervalId: null,
        animation: 0
    },
  
    /**
     * 组件的方法列表
     */
    methods: {
        moveLeft (e) {
            let diff = this.data.start - e.changedTouches[0].pageX;
            let diff2 = this.data.startY - e.changedTouches[0].pageY;
            diff2 = diff2 < 0 ? -diff2 : diff2
            if (diff > 20 && diff2 < 50) {
                this.setData({
                    animation: 1
                })
            } else if( diff < -20 && diff2 < 50) {
                this.setData({
                    animation: 0
                })
            }
        },
        start (e) {
            this.setData({
                start: e.changedTouches[0].pageX,
                startY: e.changedTouches[0].pageY
            });
        },
        del () {
          wx.showModal({
            title: '提示',
              content: '是否确定要删除同伴？',
              confirmColor: '#018389',
              success: (res) => {
                if (res.confirm) {
                  this.triggerEvent('del');
                  this.setData({
                      animation: 0
                  })
                }
              }
          })
            
        }
    }
  })
  