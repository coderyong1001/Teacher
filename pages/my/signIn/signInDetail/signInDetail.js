// pages/my/signIn/signInDetail/signInDetail.js
import {
  getSignDetail,
  sign
} from '../../../../service/my-service'
import {
  debounce
} from '../../../../utils/util'
import { 
  ShowToast,
  ShowLoading 
} from '../../../../utils/show_toast_loading_modal'
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInfo: {},
    schedule: [],
    eventStack: {},
    courseId: null,
    signInFunc: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.getDetai(options.id)
      this.data.courseId = options.id
    }
  },
  async getDetai (id) {
    let res = await getSignDetail(id)
    let courseInfo = res.data.data.course_info
    let schedule = res.data.data.schedule_info
    courseInfo.range_start = courseInfo.range_start.split('-').join('.')
    courseInfo.range_end = courseInfo.range_end.split('-').join('.')
    courseInfo.range = courseInfo.range_start + '-' + courseInfo.range_end
    schedule.map(item => {
      // item.course_date = item.course_date.split('-').join('.')
      // let hour = item.start_time.split(' ')
      // hour = parseInt(hour[1])
      // item.day_part = hour > 12 ? '下午' : '上午'
      if (parseInt(item.checkin_time) > 0) {
        item.checkin_time = '签到时间：' + item.checkin_time
      }
    })
    console.log(schedule)
    this.setData({
      courseInfo,
      schedule
    })
  },

  chekIn(e) {
    ShowLoading('位置获取中')
    let time = new Date()
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    let h = time.getHours()
    let m = time.getMinutes()
    let s = time.getSeconds()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m
    s = s < 10 ? '0' + s : s
    let strTime = [year, month, day].join('-') + ' ' + [h, m, s].join(':')
    let params = {
      longitude: 0,
      latitude: 0,
      check_time: strTime,
      start: e.currentTarget.dataset.start,
      end: e.currentTarget.dataset.end,
      sche_id: e.currentTarget.dataset.id
    }
    this.checkLocation();
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success: (res) => {
        wx.hideLoading()
        params.latitude = res.latitude
        params.longitude = res.longitude
        let pro = sign(params)
        pro.then(result => {
          if (result.data.code === 200) {
            this.getDetai(this.data.courseId)
          }
        })
      },
      fail: (err) => {
        wx.hideLoading()
        if (err.errMsg !== "getLocation:fail auth deny") {
          ShowToast('请打开GPS定位')
        }
      }
    })
  },

  signIn (e) {
    if (this.data.signInFunc) this.data.signInFunc(e)
    else this.data.signInFunc = debounce(this, this.chekIn, 1000)
  },

  //校验位置权限是否打开
  checkLocation() {
    //选择位置，需要用户授权
    wx.getSetting({
    success(res) {
      console.log(res)
      if (!res.authSetting['scope.userLocation'])
      wx.showModal({
        title: '提示',
        content: '未授权获取位置信息，不能签到，去授权？',
        confirmColor:"#018389",
        success (res) {
          if (res.confirm) {
            try {
              wx.openSetting()
            } catch(e) {
              ShowToast('未知错误')
            }
          }
        }
      })
    }
    })
  }
})