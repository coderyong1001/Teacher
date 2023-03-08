// pages/my/order/shareOrder/shareOrder.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import { goCollection, getShareOrder, share } from '../../../../service/my-service'
import { ShowToast } from '../../../../utils/show_toast_loading_modal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceDataList: [],
    collect_id: '',
    page_num: 1,
    showNoData: false,
    showNoMore: false,
    single_orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let courses = JSON.parse(options.courses)
    let user_id = options.user_id
    this.getCollectId(courses, user_id)
  },
  onReachBottom: function () {
    const { showNoData, showNoMore } = this.data
    if (showNoData || showNoMore) {
      return
    }
    this.getShareOrderList()
  },
  // 获取collect_id
  async getCollectId(courses, user_id) {
    let params = {
      courses,
      user_id
    }
    let goCollectionRes = await goCollection(params)
    this.setData({
      collect_id: goCollectionRes.data.data.collect_id
    }, () => {
      // 调用收集订单列表
      this.getShareOrderList()
    })
  },
  // 获取需要收集的订单列表
  async getShareOrderList() {
    const { collect_id, page_num } = this.data
    let params = {
      collect_id,
      page_num,
      page_size: 20
    }
    let getShareOrderRes = await getShareOrder(params)
    let pager = getShareOrderRes.data.data.pager
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        invoiceDataList: []
      })
    } else {
      this.setData({
        invoiceDataList: [...this.data.invoiceDataList, ...getShareOrderRes.data.data.list],
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false,
      }, () => {
        if (this.data.invoiceDataList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
  },
  setOrderData (e) {
    this.setData({
      single_orders: e.detail.single_orders
    })
  },

  // 分享订单
  async handleClick() {
    const { collect_id, single_orders } = this.data
    if (!single_orders.length) {
      ShowToast('请选择订单')
      return
    }
    let params = {
      collect_id,
      orders: single_orders
    }
    await share(params)
    ShowToast('分享成功')
  }
})