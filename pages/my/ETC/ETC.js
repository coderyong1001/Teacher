// pages/my/myTraining/myTraining.js
import { getETCList } from '../../../service/my-service'
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
Page({
  data: {
    params: {
      page_num: 1,
      page_size: 10,
    },
    //证书数据
    ETCList: [],
    featchAll: false,
  },
  goDetails(value) {
    const that = this.data
    wx.downloadFile({
      url: that.ETCList[value.currentTarget.dataset.value].cert_url,
      // url: 'https://static-i.autochessmoba.com/official_website/2558654f29/166745658989736.pdf',
      success: function (res) {
        wx.openDocument({
          fileType: 'pdf',
          filePath: res.tempFilePath,
          showMenu: true,
          success: (res) => {
            console.log('读取成功', res)
          },
          fail: (err) => {
            console.log('读取失败', err)
          },
        })

        // 通过 eventChannel 向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.ETCList[value.currentTarget.dataset.value] })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyETCList()
  },
  onPullDownRefresh: function () {
    this.data.trainings = []
    this.data.params.page_num = 1
    this.data.showNoData = false
    let pro = this.getMyETCList()
    pro.then((res) => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.featchAll) {
      let params = this.data.params
      params.page_num += 1
      this.setData({
        params,
      })
      this.getMyETCList()
    }
  },
  /**
   * 获取单页的我的培训信息
   */
  async getMyETCList() {
    let res = await getETCList(this.data.params)
    let featchAll = this.data.featchAll
    let pager = res.data.data.pager
    let ETCList = this.data.ETCList
    let newList = res.data.data.list
    let d = new Date()
    newList.map((item) => {
      item.create_time = item.create_time.split('.')[0].replace(/T/,', ')
    })
    newList.forEach((e) => {
      ETCList.push(e)
    })
    if (pager.page_num * pager.page_size >= pager.count) {
      featchAll = true
    }
    this.setData({
      ETCList,
      featchAll,
    })
  },
})
