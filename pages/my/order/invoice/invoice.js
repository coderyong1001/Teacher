// pages/my/order/invoice/invoice.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  getInvoiceOrders,
  getInvoiceCourse,
  invoiceNext
} from '../../../../service/my-service'
import {
  ShowToast
} from '../../../../utils/show_toast_loading_modal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    selectedNum: 0,
    totalMoney: 0,
    curPageAll: false, // 本页全选与否
    all: false, // 全部全选与否
    invoiceDataList: [], // 发票；列表
    invoiceOrderList: [], // 可开票的课程
    category: '', // 活动分类
    course_id: '',
    page_num: 1,
    page_size: 20,
    count: '', // 数据总条数
    showNoData: false,
    showNoMore: false,
    categoryObj: {
      1: '培训',
      2: '会议',
      3: '活动',
    },
    course_info_obj: {},
    single_orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInvoiceCourseList()
  },
  onReachBottom: function () {
    const {
      showNoData,
      showNoMore
    } = this.data
    if (showNoData || showNoMore) {
      return
    }
    this.getInvoiceOrderList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page_num: 1,
      page_size: 20,
      invoiceDataList: []
    }, async () => {
      await this.getInvoiceOrderList()
      wx.stopPullDownRefresh()
      let invoiceList = this.selectComponent('#invoice-list')
      invoiceList.resetData()
    })
  },
  // 获取开发票列表
  async getInvoiceOrderList() {
    const {
      course_id,
      page_num,
      page_size
    } = this.data
    let params = {
      course_id,
      page_num,
      page_size
    }
    let getInvoiceOrdersRes = await getInvoiceOrders(params)
    let pager = getInvoiceOrdersRes.data.data.pager
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        count: 0,
        invoiceDataList: []
      })
    } else {
      this.setData({
        invoiceDataList: [...this.data.invoiceDataList, ...getInvoiceOrdersRes.data.data.list.order_info],
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false,
        count: pager.count
      }, () => {
        if (this.data.invoiceDataList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
  },
  // 获取开发票的课程列表
  async getInvoiceCourseList() {
    let getInvoiceCourseRes = await getInvoiceCourse()
    let tabArr = getInvoiceCourseRes.data.data
    if (JSON.stringify(tabArr) === '{}') {
      let nodataTabList = [{
          id: 1,
          tabType: 'category',
          controlList: [{
            id: 1,
            name: '暂无数据',
            tabType: 'category'
          }]
        },
        {
          id: 2,
          tabType: 'course_id',
          controlList: [{
            id: 1,
            name: '暂无数据',
            tabType: 'course_id'
          }]
        }
      ]
      this.setData({
        showNoData: true,
        tabList: nodataTabList
      })
      return
    }
    let categoryArr = []
    let courseArr = []
    let course_info_obj = {}
    let initCourse = tabArr[0].course_info
    let initCourseId = tabArr[0].course_info[0].id
    tabArr.map((item, index) => {
      categoryArr.push({
        id: item.category,
        name: this.data.categoryObj[item.category],
        tabType: 'category'
      })
      course_info_obj = {
        ...course_info_obj,
        [item.category]: item.course_info
      }
    })
    initCourse.map((item, index) => {
      courseArr.push({
        id: item.id,
        name: item.name,
        tabType: 'course_id'
      })
    })
    let tabList = [{
        id: 1,
        tabType: 'category',
        controlList: categoryArr
      },
      {
        id: 2,
        tabType: 'course_id',
        controlList: courseArr
      }
    ]
    this.setData({
      tabList,
      course_info_obj,
      course_id: initCourseId
    }, () => {
      this.getInvoiceOrderList()
    })
  },
  // 操作invoice-list组件
  handleInvoiceList(isChooseAll) {
    let invoiceList = this.selectComponent('#invoice-list')
    invoiceList.curPageSelectAll(isChooseAll)
  },
  // 本页全选
  chooseCurPage() {
    if (!this.data.invoiceDataList.length) {
      ShowToast('暂无数据')
      return
    }
    this.setData({
      curPageAll: !this.data.curPageAll,
      all: false
    }, () => {
      this.handleInvoiceList(this.data.curPageAll)
    })
  },
  // 全选
  chooseAll() {
    if (!this.data.invoiceDataList.length) {
      ShowToast('暂无数据')
      return
    }
    this.setData({
      curPageAll: false,
      all: !this.data.all,
      page_size: !this.data.all ? this.data.count : 20,
      page_num: 1,
      invoiceDataList: [],
      single_orders: [],
      totalMoney: 0
    }, async () => {
      await this.getInvoiceOrderList()
      this.handleInvoiceList(this.data.all)
    })
  },
  setOrderData(e) {
    this.setData({
      selectedNum: e.detail.len,
      totalMoney: e.detail.amount,
      single_orders: e.detail.single_orders
    }, () => {
      if (!this.data.single_orders.length) {
        this.setData({
          curPageAll: false,
          all: false
        })
      }
    })
  },
  async nextStep() {
    const {
      course_id,
      totalMoney,
      single_orders
    } = this.data
    console.log('totalMoney:', totalMoney)
    if (!Number(totalMoney)) {
      ShowToast('开票金额必须大于0')
      return
    }
    let params = {
      course_id,
      total_amount: totalMoney,
      orders: single_orders
    }
    console.log(params)
    let invoiceNextRes = await invoiceNext(params)
    const { amount, invoice_content } = invoiceNextRes.data.data
    let invoiceObj = invoiceNextRes.data.data.old_info ? invoiceNextRes.data.data.old_info : {}
    if (JSON.stringify(invoiceObj) !== '{}') {
      for (let key in invoiceObj) {
        if (key === 'status' || key === 'invoice_num' || key === 'company') {
          delete invoiceObj[key]
        }
      }
    }
    
    invoiceObj = {
      ...invoiceObj,
      paper_elec: (invoiceObj.paper_elec === 0 || invoiceObj.paper_elec === 1) ? invoiceObj.paper_elec.toString() : '',
      title_type: (invoiceObj.title_type === 0 || invoiceObj.title_type === 1) ? invoiceObj.title_type.toString() : '',
      type: (invoiceObj.type === 0 || invoiceObj.type === 1) ? invoiceObj.type.toString() : '',
      amount,
      invoice_content,
      course_id,
      single_orders
    }
    app.globalData.invoiceObj = {
      ...invoiceNextRes.data.data,
      old_info: invoiceObj
    }
    wx.navigateTo({
      url: `/pages/my/order/invoiceDetail/invoiceDetail?invoiceType=2&course_id=${course_id}`
    })
  },
  confirmChoice(val) {
    let invoiceList = this.selectComponent('#invoice-list')
    invoiceList.resetData()
    if (val.detail.tabType === 'course_id') {
      this.setData({
        course_id: val.detail.id,
        invoiceDataList: [],
        page_num: 1
      }, () => {
        this.getInvoiceOrderList()
      })
      return
    }
    this.setData({
      category: val.detail.id,
      invoiceDataList: [],
      page_num: 1
    }, () => {
      let chooseCourse = this.data.course_info_obj[this.data.category]
      let courseArr = []
      chooseCourse.map((item, index) => {
        courseArr.push({
          id: item.id,
          name: item.name,
          tabType: 'course_id'
        })
      })
      let tabList = this.data.tabList
      if (tabList.length === 2) {
        tabList.splice(1, 1)
      }
      tabList.push({
        id: 2,
        tabType: 'course_id',
        controlList: courseArr
      })
      this.setData({
        tabList,
        course_id: chooseCourse[0].id
      }, () => {
        this.getInvoiceOrderList()
      })
    })
  },
})