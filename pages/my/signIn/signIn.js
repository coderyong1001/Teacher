// pages/my/signIn/signIn.js
import {
  getSignList
} from '../../../service/my-service'
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signList: [],
    showNoData: false
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  onPullDownRefresh: function(){
    this.getList().then(res => {
      wx.stopPullDownRefresh()
    })
  },
  async getList () {
    let res = await getSignList()
    let signList = res.data.data
    signList.map( item => {
      item.range_start = item.range_start.split('-').join('.')
      item.range_end = item.range_end.split('-').join('.')
      item.range = item.range_start + '-' + item.range_end
    })
    this.setData({
      signList,
      showNoData: signList.length > 0 ? false : true
    })
  },
  toDetail:function(e){
    console.log(e)
    wx.navigateTo({
      url:"signInDetail/signInDetail?id=" + e.currentTarget.dataset.id
    })
  },

 
})