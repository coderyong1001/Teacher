// pages/index/activityDetail/activityDetail.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  getCourseDetail
} from '../../../service/index-service'
import {
  ShowToast,
  ShowLoading,
  HideLoading
} from '../../../utils/show_toast_loading_modal'
import forceNavigate from '../../../utils/force_navigate'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: '../../../assets/images/course_bg.png',
    course_id: '', // 课程id
    markers: [],
    isShowModal: false,
    activityType: {
      1: '培训',
      2: '会议',
      3: '活动',
    },
    applyStatus: {
      1: '报名中',
      2: '未开始',
      3: '已结束',
    },
    applyStatusColor: {
      1: ' success',
      2: ' warning',
      3: ' info'
    },
    roomTypeObj: {
      1: '单人间',
      2: '双人间',
      3: '单人拼房'
    },
    courseDetailDataObj: {},
    desc: '', // 活动介绍
    place: {},
    conference: [], // 联系人
    hotel_type: '',
    recommend_hotels: [], // 推荐酒店
    reference: [], // 证书
    schedule: [], // 日程
    dayTimesObj: {}, // 保存日程安排的数据
    dayTime: '', // 当前点击的日程安排
    currentDayIndex: 0,
    time_status: '', // 活动状态
    schedule_pic: '', //课程详情图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      course_id: options.id
    }, () => {
      this.getActivityDetail()
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getActivityDetail()
    wx.stopPullDownRefresh()
  },
  // 获取课程详情页
  async getActivityDetail() {
    const {
      course_id
    } = this.data
    let getCourseDetailRes = await getCourseDetail(course_id)
    console.log(getCourseDetailRes);
    let courseDetailData = getCourseDetailRes.data.data
    let dayTimesObj = {}
    courseDetailData.schedule.map(item => {
      dayTimesObj[item.course_date] = item.day_times
      item.day_times.map(dayCon=>{
        dayCon.content=(dayCon.content.split(/[(\r\n)\r\n]+/));
      })
    })
    this.setData({
      courseDetailDataObj: courseDetailData,
      time_status: courseDetailData.time_status,
      place: courseDetailData.place ? courseDetailData.place : {},
      conference: courseDetailData.conference,
      recommend_hotels: courseDetailData.recommend_hotels,
      reference: courseDetailData.reference,
      schedule: courseDetailData.schedule,
      schedule_pic: courseDetailData.schedule_pic,
      dayTimesObj,
      markers: [{
        iconPath: "/assets/images/activity-pos.png",
        id: 0,
        latitude: courseDetailData.place ? courseDetailData.place.latitude : '',
        longitude: courseDetailData.place ? courseDetailData.place.longitude : '',
        width: 20,
        height: 28
      }],
      desc: courseDetailData.desc ? courseDetailData.desc.replace(/\<img/g, '<img style="width:100%;') : '',
      hotel_type: courseDetailData.hotel_type
    })
    console.log('this.data',this.data)
  },
  clicknavigation() {
    const {
      latitude,
      longitude,
      detail_address
    } = this.data.place
    if (!detail_address) {
      return
    }
    wx.openLocation({ //​使用微信内置地图查看位置。
      latitude: parseFloat(latitude), //要去的纬度-地址
      longitude: parseFloat(longitude), //要去的经度-地址
      name: detail_address,
      address: detail_address
    })
  },
  // 開起模态框
  clickShowModal() {
    this.setData({
      isShowModal: true
    })
  },
  // 关闭模态框
  closeModal() {
    this.setData({
      isShowModal: false
    })
  },
  // 立即报名
  onGotUserInfo(res) {
    const { time_status } = this.data
    if (time_status === 2) {
      ShowToast('报名未开始！')
      return
    }
    if (time_status === 3) {
      ShowToast('报名已结束！')
      return
    }
    if (!res.detail.userInfo) {
      ShowToast('需要授权才能支付！')
      return
    }
    let token = wx.getStorageSync('token')
    if (!token) {
      app.globalData.userInfo = res.detail.userInfo
      forceNavigate('请登录', '/pages/login/login')
      return
    }
    let isRegister = wx.getStorageSync('isRegister')
    if (token && !isRegister) {
      forceNavigate('请完善个人信息', '/pages/login/fillInfo/fillInfo')
      return
    }
    const {
      course_id
    } = this.data
    wx.navigateTo({
      url: `/pages/index/pay/pay?course_id=${course_id}`,
    })
  },
  // 点击预览
  clickPreview() {
    const {
      template
    } = this.data.courseDetailDataObj
    wx.previewImage({
      current: template, //当前图片地址
      urls: [template]
    })
  },
  // 下载文件
  downloadFile(e) {
    ShowLoading('下载中')
    wx.downloadFile({
      url: e.currentTarget.dataset.downloadurl,
      success: function (res) {
        HideLoading()        
        var filePath = res.tempFilePath
        let fileFormat = filePath.substring(filePath.lastIndexOf('.') + 1)
        let imgFormatArr = ['jpg', 'png', 'jpeg', 'jpg', 'bmp']
        let videoFormatArr = ['mp3', 'wav']
        if (imgFormatArr.indexOf(fileFormat) !== -1) {
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success() {
              ShowToast('已保存到相册')        
            },
            fail() {         
              ShowToast('保存失败')
            }
          })
        } else if (videoFormatArr.indexOf(fileFormat) !== -1) {         
          wx.saveVideoToPhotosAlbum({
            filePath: filePath,
            success() {            
              ShowToast('已保存到相册')
            },
            fail() {          
              ShowToast('保存失败')
            }
          })
        } else {
          wx.saveFile({
            tempFilePath: filePath,
            success: function (res) {
              const savedFilePath = res.savedFilePath
              wx.openDocument({
                filePath: savedFilePath,
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail: function (res) {
                  ShowToast('打开文件失败')
                }
              })
            },
            fail: function () {
              ShowToast('保存失败')
            },
          })
        }
        
      },
      fail: function () {
        HideLoading()        
        ShowToast('下载失败')
      }
    })
  },
  // 拨打电话
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  // 拨打座机
  makePhoneCall1(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.short_tel
    })
  },
  // 查看日程安排
  changeDayTime(e) {
    let time = e.currentTarget.dataset.time
    let index = e.currentTarget.dataset.index
    if (this.data.dayTime !== time) {
      this.setData({
        dayTime: e.currentTarget.dataset.time,
        currentDayIndex: index
      })
    }
  },
  onShareAppMessage(){}
})