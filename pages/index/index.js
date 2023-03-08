//index.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  getCourseList
} from '../../service/index-service'
import { ShowToast } from '../../utils/show_toast_loading_modal'
// 引入SDK核心类
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
// 实例化API核心类
const qqmapsdk = new QQMapWX({
  key: 'O5DBZ-AYI66-4MBSW-EHAFG-46SVJ-L5BYF' // 必填
})
//获取应用实例
Page({
  data: {
    isFocus: false,
    city: wx.getStorageSync('city') || '定位中..',
    ifChooseCity: false, // 判断是否按照选择城市来获取课程
    tabList: [{
        id: 1,
        tabType: 'time_status',
        controlList: [{
            id: 4,
            name: '全部状态',
            tabType: 'time_status'
          },
          {
            id: 1,
            name: '报名中',
            tabType: 'time_status'
          },
          {
            id: 2,
            name: '未开始',
            tabType: 'time_status'
          },
          {
            id: 3,
            name: '已结束',
            tabType: 'time_status'
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
    search: '',
    showSelected: false,
    time_status: '',
    category: '',
    page_num: 1,
    activityList: [], 
    showNoData: false, // 显示没有数据
    showNoMore: false // 没有更多数据
  },
  onLoad() {
    let _this = this   
    wx.getLocation({ //获取当前经纬度
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success(res) {         
            let storageCity = wx.getStorageSync('city')
            let resCity = res.result.address_component.city
            if (!storageCity) {
              _this.setData({
                city: resCity,
                page_num: 1,
                activityList: []
              }, () => {
                wx.setStorageSync('city', resCity)
                _this.getCourseLists()
              })
              return
            }
            if (storageCity !== resCity) {
              wx.showModal({
                title: '定位',
                content: `定位到您在${resCity}，是否切换至该城市`,
                confirmColor: '#018389',
                success(res) {
                  _this.setData({
                    city: res.cancel ? storageCity : resCity,
                    page_num: 1,
                    activityList: []
                  }, () => {
                    !res.cancel && wx.setStorageSync('city', resCity)
                    _this.getCourseLists()
                  })
                }
              })
            } else {
              _this.setData({
                city: storageCity,
                page_num: 1,
                activityList: []
              }, () => {
                _this.getCourseLists()                
              })
            }
          },
          fail(failres) {
            ShowToast('定位失败')
            _this.setData({
              city: '北京市',
              page_num: 1,
              activityList: []
            }, () => {
              wx.setStorageSync('city', '北京市')
              _this.getCourseLists()
            })                        
          }
        })
      },
      fail: function (failres) {
        _this.setData({
          city: '北京市',
          page_num: 1,
          activityList: []
        }, () => {
          wx.setStorageSync('city', '北京市')
          _this.getCourseLists()
          if (failres.errMsg.indexOf('fail auth deny') !== -1) {
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
              confirmColor: '#018389',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(successRes) {
                      let showText = successRes.authSetting['scope.userLocation'] ? '授权成功' : '授权失败'
                      let showIcon = successRes.authSetting['scope.userLocation'] ? 'success' : 'none'
                      ShowToast(showText, showIcon)
                    },
                    fail(failres) {
                      console.log('failres:', res)
                    }
                  })
                }        
              }
            })
          } else {
            ShowToast('请检测GPS是否开启')                        
          }
        })
      }
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
    this.getCourseLists()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page_num: 1,
      activityList: []
    }, async () => {
      await this.getCourseLists()
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage(){
    
  },
  // 刷新页面
  refresh() {
    this.setData({
      page_num: 1,
      activityList: []
    }, () => {
      this.getCourseLists()
    })
  },
  // 获取课程列表
  async getCourseLists() {
    const { search, time_status, category, page_num } = this.data
    let params = {
      search,
      time_status,
      category,
      page_num,
      page_size: 20
    }
    if (this.data.ifChooseCity) params.city = this.data.city
    let getCourseListRes = await getCourseList(params)
    let pager = getCourseListRes.data.data.pager
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        activityList: [],
        search: ''
      })
    } else {
      this.setData({
        activityList: [...this.data.activityList, ...getCourseListRes.data.data.list],
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false,
        search: ''
      }, () => {
        if (this.data.activityList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
    
  },
  focusInput() {
    this.setData({
      isFocus: true
    })
  },
  blurInput(e) {
    this.setData({
      isFocus: false
    })
  },
  inputChange(e) {
    this.setData({
      search: e.detail.value,
    })
  },
  // 点击放大镜搜索
  clickSearch() {
    this.searchFuc()
  },
  confirmSearch(e) {
    this.searchFuc(e.detail.value)
  },
  // 搜索功能
  searchFuc(value) {
    const { search } = this.data    
    this.setData({
      search: value || search,
      page_num: 1,
      activityList: []
    }, () => {
      this.getCourseLists()
    })
  },
  chooseCity() {
    wx.navigateTo({
      url: '/pages/index/chooseCity/chooseCity',
    })
  },
  // 设置城市
  setCity(city) {
    // 如有city则按城市获取课程，否则获取全部，选择全部城市传入的city为null
    this.setData({
      city: city || this.data.city,
      ifChooseCity: city ? true : false
    })
  },
  // 开展选择列表
  setActive() {
    this.setData({
      showSelected: true
    })
  },
  // 确认选择
  confirmChoice(val) {
    this.setData({
      [val.detail.tabType]: val.detail.id,
      showSelected: true,
      page_num: 1,
      activityList: []
    }, () => {
      this.getCourseLists()
    })
  },
  // 取消选择的回调
  cancelChoice() {
    this.setData({
      showSelected: false
    })
  },
  // 取消
  cancelChoose() {
    if (this.data.showSelected) {
      let tabControl = this.selectComponent('#tabControl')
      tabControl.hideModal()
    }
  }
})