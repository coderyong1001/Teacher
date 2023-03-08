// pages/my/order/collectInvoice/collectInvoice.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import { getCollectionOrder, goCollection } from '../../../../service/my-service'
import { ShowToast } from '../../../../utils/show_toast_loading_modal';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityList: [], // 活动列表
    selectedList: {}, // 选择的状态
    selectedArray:[], // 选中的订单
    search: '', // 搜索内容
    showNoData: false,
    showNoMore: false,
    page_num: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectOrderList()
  },
  // 获取收集订单的活动列表
  async getCollectOrderList() {
    const { search, page_num } = this.data
    let params = {
      search,
      page_num,
      page_size: 20
    }
    let getCollectionOrderRes = await getCollectionOrder(params)
    let pager = getCollectionOrderRes.data.data.pager
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        activityList: [],
        page_num: 1
      })
    } else {
      this.setData({
        activityList: [...this.data.activityList, ...getCollectionOrderRes.data.data.list],
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false
      }, () => {
        if (this.data.activityList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
  },
  // 滑动触底
  bindscrolltolower() {
    const {
      showNoData,
      showNoMore
    } = this.data
    if (showNoData || showNoMore) {
      return
    }
    this.getCollectOrderList()
  },
  // 单选
  singleChoose(e) {
    var index = e.currentTarget.dataset.index // 获取选中的radio索引
    let selectedList = this.data.selectedList
    let selectedArray = this.data.selectedArray
    let slected = true
    selectedList[index+'']=!selectedList[index+'']
    selectedArray.forEach((element,idx) => {
      if(element.id==index){
        selectedArray.splice(idx,1)
        slected = false
      }
    });
    if(slected){
      this.data.activityList.forEach(element=>{
        if(element.id == index){
          selectedArray.push(element);
        }
      })
    }
    this.setData({
      selectedList,
      selectedArray
    })
  },
  searchInput(e) {
    this.setData({
      search: e.detail.value,
      activityList: [],
      page_num: 1
    }, async () => {
      await this.getCollectOrderList()
      this.setData({
        search: ''
      })
    })
  },
  onShareAppMessage: function() {
    const { selectedArray } = this.data
    let user_id = wx.getStorageSync('user_id')
    let courses = []
    let title = ''
    selectedArray.map(item => {
      courses.push(item.id)
      title += item.name + '、'
    })
    let newTitle = title.substring(0, title.lastIndexOf('、'))
    courses = JSON.stringify(courses)        
    return {
      title: '我正在师资培训部小程序中发起收集' + title + '请点此链接分享发票给我',
      path: `/pages/my/order/shareOrder/shareOrder?courses=${courses}&user_id=${user_id}`,
    }
  },
  noList() {
    ShowToast("请至少选择一项")
  },
  goCollect() {
    const { selectedArray } = this.data
    let user_id = wx.getStorageSync('user_id')
    let courses = []
    selectedArray.map(item => {
      courses.push(item.id)
    })
    courses = JSON.stringify(courses)
    wx.navigateTo({
      url: `/pages/my/order/shareOrder/shareOrder?courses=${courses}&user_id=${user_id}`
    })
  }
})