// pages/my/order/orderDetail/orderDetail
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  ShowToast,
  ShowLoading
} from '../../../../utils/show_toast_loading_modal'
import {
  orderDetail
} from '../../../../service/my-service'
Page({
  data:{
    showStatus: false,
    images: [],
    courseInfo: '',
    menberInfo: [],
    orderInfo: {
      paymentMethod: '',
      number: '',
      createTime: '',
      paymentTime: '',
      status: '',
      id: ''
    },
    statusObj: {
      0: '已支付',
      1: '待支付',
      2: '待审核',
      3: '审核未通过',
      4: '订单取消',
      5: '退款审核中',
      6: '退款已拒绝',
      7: '已部分退款',
      8: '已全部退款',
      9: '订单已删除',
      10: '审核已通过放款中'
    },
    roomTypeObj: {
      1: '单人间',
      2: '双人间',
      3: '单拼房男',
      4: '单拼房女'
    },
    logInfo: [],
    accommodation: [],
    hotel_type: '',
    imgCode: null
  },
  onLoad:function(options){
    if (options.id) {
      this.getOrderDetail(options.id)
    }
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
  async getOrderDetail(id) {
    ShowLoading('数据加载中')
    const res = await orderDetail(id)
    let {course_info, order_info, log_info} = res.data.data
    let hotel_type = order_info.hotel_type
    let {applicant_info, accommodation} = order_info
    course_info.range_start = course_info.range_start.replace(/-/g, '.')
    course_info.range_end = course_info.range_end.replace(/-/g, '.')
    let orderInfo = {}
    orderInfo.paymentMethod = order_info.payment_method == 1 ? '线下支付' : '线上支付'
    orderInfo.number = order_info.order_number
    orderInfo.createTime = order_info.create_time
    orderInfo.paymentTime = order_info.payment_time
    orderInfo.status = order_info.payment_status
    orderInfo.id = order_info.id
    log_info.map(item => {
      item.log_time = item.log_time.substring(5)
      item.log_time = item.log_time.replace(/-/g, '.')
      return item
    })
    if (accommodation.hotel_info)
      accommodation.hotel_info.map(item => {
        item.checkin = item.checkin.replace(/-/g, '.')
        item.checkout = item.checkout.replace(/-/g, '.')
        return item
      })
    this.setData({
      courseInfo: course_info,
      menberInfo: applicant_info,
      orderInfo,
      logInfo: log_info,
      accommodation,
      hotel_type,
      imgCode: course_info.qr_code
    })
    wx.hideLoading()
    console.log(this.data)
  },
  handlerClose (e) {
    if (e.target.id === "box" || e.target.id === "close") {
      this.setData({
        showStatus: false
      })
    }
  },
  andlerOpen(e) {
    this.setData({
      showStatus: true
    })
  },
  handlerPreviewImage (e) {
    console.log(e)
    let {url, urlarr} = e.target.dataset
    wx.previewImage({
      current: url,
      urls: urlarr,
      fail: function() {
        ShowToast('图片预览失败')
      }
    })
  },
  reflush() {
    this.getOrderDetail(this.data.orderInfo.id)
  },
  toFillHotel(e) {
    let range_start = this.data.courseInfo.range_start
    let range_end = this.data.courseInfo.range_end
    range_end = range_end.replace(/\./g, '-')
    range_start = range_start.replace(/\./g, '-')
    let startTime = new Date(range_start.replace(/-/g, '/')).getTime()
    let endTime = new Date(range_end.replace(/-/g, '/')).getTime()
    let nowTime = new Date().getTime()
    if (startTime - nowTime < 3600000*24*3 && endTime - nowTime > 0) {
      ShowToast('距离开课时间已小于3天，不可更改住宿信息')
      return
    }
    if (this.data.orderInfo.status === 8) {
      ShowToast('当前订单已全部退款')
      return
    }
    if (this.data.orderInfo.status === 9) {
      ShowToast('当前订单已删除')
      return
    }
    if (endTime - nowTime < 0) {
      ShowToast('课程已结束')
      return
    } 
    app.globalData.orderAccommodation = this.data.accommodation
    wx.navigateTo({
      url: `/pages/index/hotelInfo/hotelInfo?orderid=${e.target.dataset.orderid}&from=orderdetail`
    })
  }
})