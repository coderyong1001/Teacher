// pages/my/order/order.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import { getOrders } from '../../../service/my-service'
import {getMonthDayHM} from '../../../utils/format_date'
import { ShowToast } from '../../../utils/show_toast_loading_modal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        id: 1,
        tabType: 'status',
        controlList: [{
            id: -1,
            name: '全部订单',
            tabType: 'status'
          },
          {
            id: 0,
            name: '支付成功',
            tabType: 'status'
          },
          {
            id: 1,
            name: '待支付',
            tabType: 'status'
          },
          {
            id: 2,
            name: '待审核',
            tabType: 'status'
          },
          {
            id: 4,
            name: '订单取消',
            tabType: 'status'
          },
          {
            id: 5,
            name: '退款审核中',
            tabType: 'status'
          },
          {
            id: 7,
            name: '已部分退款',
            tabType: 'status'
          },
          {
            id: 8,
            name: '已全部退款',
            tabType: 'status'
          },
          {
            id: 10,
            name: '审核已通过放款中',
            tabType: 'status'
          }
        ]
      },
      {
        id: 2,
        tabType: 'category',
        controlList: [{
            id: 4,
            name: '全部类别',
            tabType: 'category'
          },
          {
            id: 1,
            name: '培训',
            tabType: 'category'
          },
          {
            id: 2,
            name: '会议',
            tabType: 'category'
          },
          {
            id: 3,
            name: '活动',
            tabType: 'category'
          }
        ]
      },
    ],
    status: -1, // 订单状态
    category: '', // 订单类型
    create_time: '', // 订单创建时间
    showNoData: false, // 显示没有数据
    showNoMore: false, // 没有更多数据
    orderList: [],
    page_num: 1,
    timeRangeArr: [], // 时间筛选条件
    imgCode: null
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
    this.setData({
      imgCode: app.globalData.groupCode
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { showNoData, showNoMore } = this.data
    if (showNoData || showNoMore) {
      return
    }
    this.getOrderList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page_num: 1,
      orderList: []
    }, async () => {
      await this.getOrderList()
      wx.stopPullDownRefresh()
    })
  },
  goInvoiceHistory() {
    wx.navigateTo({
      url: '/pages/my/order/invoiceHistory/invoiceHistory',
    })
  },
  invoice() {
    wx.navigateTo({
      url: '/pages/my/order/invoice/invoice',
    })
  },
  handleClick() {
    wx.navigateTo({
      url: '/pages/my/order/collectInvoice/collectInvoice',
    })
  },
  saveImageHandler() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success:()=> {
              //授权
              wx.getImageInfo({
                src: this.data.imgCode,
                success:(res)=> {
                  let path = res.path;
                  wx.saveImageToPhotosAlbum({
                    filePath:path,
                    success(res) { 
                      ShowToast('保存成功')
                    },
                    fail:(res)=>{
                      ShowToast('保存失败')
                    }
                  })
                },
                fail:(res)=> {
                  ShowToa('未授权，不能保存图片')
                }
              })
            },
            fail: (res) =>{
              ShowToast('保存失败')
            }
          })
        }else{
          // 已经授权了
          wx.getImageInfo({
            src: this.data.imgCode,
            success:(res)=> {
              let path = res.path;
              wx.saveImageToPhotosAlbum({
                filePath:path,
                success(res) { 
                  ShowToast('保存成功')
                },
                fail:(res)=>{
                  ShowToast('保存失败')
                }
              })
            },
            fail:(res)=> {
              ShowToast('保存失败')
            }
          })
        }
      },
      fail: (res) =>{
        ShowToast('保存失败')
      }
    }) 
    
  },
  saveImgCodeClickHandler () {
    this.setData({
      imgCode: null
    }, ()=>{
      app.globalData.groupCode = null
    })
  },
  // 获取订单列表
  async getOrderList() {
    const { status, category, create_time, page_num } = this.data
    let params = {
      status,
      category,
      create_time,
      page_num,
      page_size: 20
    }
    let getOrdersRes = await getOrders(params)
    let pager = getOrdersRes.data.data.pager
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        orderList: []
      })
    } else {
      let timeRange = getOrdersRes.data.data.list.time_range
      let controlList = []
      timeRange.map((item, index) => {
        controlList.push({
          id: index + 1,
          name: getMonthDayHM(item, 'YYYY年MM月'),
          tabType: 'create_time'
        })
      })
      let tabList = this.data.tabList
      if (tabList.length === 3) {
        tabList.splice(2, 1)
      }
      tabList = [...tabList, {
        id: 3,
        tabType: 'create_time',
        controlList: controlList
      }]
      getOrdersRes.data.data.list.order_info.map(item => {
        let nowTime = new Date().getTime()
        let startTime = new Date(item.course_start.replace(/-/g, '/')).getTime()
        let timeFlag = nowTime < startTime
        if (item.able_refund && (item.order_status === 0 || item.order_status === 7))
          item.canrefund = true && timeFlag
        else
          item.canrefund = false
        return item
      })
      this.setData({
        orderList: [...this.data.orderList, ...getOrdersRes.data.data.list.order_info],
        tabList,
        timeRangeArr: timeRange,
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false
      }, () => {
        if (this.data.orderList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
    console.log('this.data:',this.data)
  },
  // 确认选择
  confirmChoice(val) {
    const { timeRangeArr } = this.data
    this.setData({
      [val.detail.tabType]: val.detail.tabType === 'create_time' ? timeRangeArr[val.detail.id - 1] : val.detail.id,
      orderList: [],
      page_num: 1
    }, () => {
      this.getOrderList()
    })
  },
  // 刷新页面
  refresh(event = {}) {
    this.setData({
      orderList: [],
      page_num: 1
    }, () => {
      this.getOrderList()
      if (event.detail && event.detail.type && event.detail.type === 1) {
        ShowToast(`${event.detail.number}张凭证更新成功`)
      }
    })
  }
})