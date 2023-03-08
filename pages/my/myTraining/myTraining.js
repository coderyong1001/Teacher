// pages/my/myTraining/myTraining.js
import {
  myTraning
} from '../../../service/my-service'
import {
  ShowToast
} from '../../../utils/show_toast_loading_modal'
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainings: [],
    featchAll: false,
    params: {
      page_num: 1,
      page_size: 20
    },
    showNoData: false,
    statusObj: {
      1: '未开始',
      2: '进行中',
      3: '已结束'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTranings()
  },
  onPullDownRefresh: function() {
    this.data.trainings = []
    this.data.params.page_num = 1
    this.data.showNoData = false
    let pro = this.getTranings()
    pro.then((res) => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ( !this.data.featchAll ) {
      let params = this.data.params
      params.page_num += 1
      this.setData({
        params
      })
      this.getTranings()
    }
  },
  /**
   * 获取单页的我的培训信息
   */
  async getTranings () {
    //注意边界问题，由于接口没有分页参数，所以是否获取完的判断可能出错
    let res = await myTraning(this.data.params)
    let trainings = this.data.trainings.slice()
    let showNoData = false
    if ( res.data.data.pager.count <= res.data.data.pager.page_num * res.data.data.pager.page_size) {
      this.setData({
        featchAll: true
      })
    }
    if (!res.data.data.list) return 
    //小程序对concat方法支持是有问题？已经有两个地方使用concat都合并不了数组
    res.data.data.list.forEach(item => {
      let startTime = new Date(item.range_start.replace(/-/g, '/')).getTime()
      let endTime = new Date(item.range_end.replace(/-/g, '/')).getTime()
      let nowTime = new Date().getTime()
      item.range_start = item.range_start.replace(/-/g, '.')
      item.range_end = item.range_end.replace(/-/g, '.')
      if (nowTime - startTime < 3600000 *24) {
        item.showLink = false
      } else if (nowTime - endTime > 3600000 *24*7) {
        item.showLink = false
      } else {
        item.showLink = true
      }
      trainings.push( item )
    })
    showNoData = trainings.length === 0
    this.setData({
      trainings,
      showNoData
    })
  },
  toQeustionnaire (e) {
    wx.navigateToMiniProgram({
      appId: 'wxd947200f82267e58',
      path: 'pages/wjxqList/wjxqList?activityId=' + e.target.dataset.url,
    })
  },
  async showDetail (e) {
    console.log(e)
    if ( e.currentTarget.dataset.hidden ) {
      ShowToast( '暂未有活动详情' )
      return 
    }
    wx.navigateTo({
      url: '/pages/index/activityDetail/activityDetail?id=' + e.currentTarget.dataset.id
    })
  }
})