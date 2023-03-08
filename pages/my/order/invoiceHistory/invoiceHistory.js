// pages/my/order/invoiceHistory/invoiceHistory.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import { getInvoiceHistory } from '../../../../service/my-service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    invoiceHistoryList: [],
    paper_elec_obj: { //  发票类型
      0: '电子发票',
      1: '纸质发票',
    },
    statusObj: { // 开票状态
      0: '开票中',
      1: '已开票',
      2: '已取消'
    },
    page_num: 1,
    showNoData: false,
    showNoMore: false
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/my/order/invoiceHistoryDetail/invoiceHistoryDetail?invoice_id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInvoiceHistoryList()
  },
  onReachBottom: function () {
    const { showNoData, showNoMore } = this.data
    if (showNoData || showNoMore) {
      return
    }
    this.getInvoiceHistoryList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page_num: 1,
      invoiceHistoryList: []
    }, async () => {
      await this.getInvoiceHistoryList()
      wx.stopPullDownRefresh()
    })
  },
  refresh() {
    this.setData({
      page_num: 1,
      invoiceHistoryList: []
    }, async () => {
      await this.getInvoiceHistoryList()
      wx.stopPullDownRefresh()
    })
  },
  // 获取开票历史列表
  async getInvoiceHistoryList() {
    const { page_num } = this.data
    let params = {
      page_num,
      page_size: 20
    }
    let getInvoiceHistoryRes = await getInvoiceHistory(params)
    let pager = getInvoiceHistoryRes.data.data.pager
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        invoiceHistoryList: []
      })
    } else {
      this.setData({
        invoiceHistoryList: [...this.data.invoiceHistoryList, ...getInvoiceHistoryRes.data.data.list],
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false
      }, () => {
        if (this.data.invoiceHistoryList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
  }

})