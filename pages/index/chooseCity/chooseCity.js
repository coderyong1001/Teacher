// pages/index/chooseCity/chooseCity.js
const city = require('../../../utils/city.js')
import pattern from '../../../utils/pattern'
// 引入SDK核心类
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js')
// 实例化API核心类
const qqmapsdk = new QQMapWX({
  key: 'O5DBZ-AYI66-4MBSW-EHAFG-46SVJ-L5BYF' // 必填
})
import {
  ShowToast
} from '../../../utils/show_toast_loading_modal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityData: {},
    hotCity: [],
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    hidden: true,
    showLetter: '', // 选中的字母
    winHeight: 0,
    tHeight: 0,
    bHeight: 0,
    startPageY: 0,
    scrollTop: 0,
    active: false,
    currentCity: '北京市', // 当前城市
    isFocus: false,
    isSearch: false,
    searchList: [],
    searchVal: '',
    touchStartTime: '',
    touchEndTime: '',
    lastTapTime: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用获取城市列表接口
    this.setData({
      cityData: city.all,
      hotCity: city.hot,
      currentCity: wx.getStorageSync('city')
    })
  },
  clickCity(e) {
    wx.pageScrollTo({
      selector: `#${e.currentTarget.dataset.item}`,
      duration: 300
    })
  },
  // 触摸滑动开始
  searchStart(e) {
    this.setData({
      hidden: false,
      active: true
    })
  },
  // 触摸结束
  searchEnd(e) {
    this.setData({
      hidden: true
    })
  },
  // 触摸移动
  searchMove(e) {
    let y = e.touches[0].clientY
    let offsettop = e.currentTarget.offsetTop
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      var num = parseInt((y - offsettop) / 12);
      if (num > 21) {
        return
      }
      this.setData({
        showLetter: this.data.letter[num]
      }, () => {
        wx.pageScrollTo({
          selector: `#${this.data.showLetter}`,
          duration: 300
        })
      })
    }
  },
  getLetter(e) {
    this.setData({
      showLetter: e.currentTarget.dataset.item,
      hidden: false
    })
  },
  setLetter() {
    wx.pageScrollTo({
      selector: `#${this.data.showLetter}`,
      duration: 300
    })
    this.setData({
      hidden: true
    })
  },
  focusInput() {
    this.setData({
      isFocus: true
    })
  },
  blurInput() {
    this.setData({
      isFocus: false
    })
  },
  cancelSearch() {
    this.setData({
      isFocus: false,
      isSearch: false,
      searchVal: ''
    })
  },
  inputSearch(e) {
    let val = e.detail.value
    const {
      cityData
    } = this.data
    let englishReg = pattern.english.test(val)
    let chineseReg = pattern.chinese.test(val)
    let searchList = []
    if (englishReg) {
      searchList = city.all[val.toUpperCase()]
    } else if (chineseReg) {
      for (let arrItem in cityData) {
        cityData[arrItem].forEach(cityItem => {
          if (cityItem.fullname.indexOf(val) !== -1) {
            searchList.push(cityItem)
          }
          return
        })
      }
    } else {
      return
    }
    this.setData({
      isSearch: val ? true : false,
      searchList: val ? searchList : [],
      searchVal: val
    })
  },
  confirmSearch(e) {
    this.inputSearch(e)
  },
  // 选择城市
  selectCity(e) {
    if (e.currentTarget.dataset.fullname) wx.setStorageSync('city', e.currentTarget.dataset.fullname)
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一页
    // 调用上一个页面的setData 方法，将数据存储
    prevPage.setCity(e.currentTarget.dataset.fullname)
    prevPage.refresh()
    wx.navigateBack({
      delta: 1
    })
  },
  // 点击定位
  clickLocation(e) {
    wx.showLoading({
      mask: true
    })
    const {
      touchStartTime,
      touchEndTime
    } = this.data
    let _this = this
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
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
          return
        }
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
                if (storageCity !== resCity) {
                  wx.showModal({
                    title: '定位',
                    content: `定位到您在${resCity}，是否切换至该城市`,
                    confirmColor: '#018389',
                    success(res) {
                      if (res.confirm) {
                        _this.setData({
                          currentCity: resCity,
                        })
                        wx.setStorageSync('city', resCity)
                        const pages = getCurrentPages()
                        const prevPage = pages[pages.length - 2] // 上一页
                        // 调用上一个页面的setData 方法，将数据存储
                        prevPage.setCity(resCity)
                        prevPage.refresh()
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  })
                } else {
                  ShowToast(`当前定位在${resCity}`)
                  _this.setData({
                    currentCity: resCity,
                  })
                  wx.setStorageSync('city', resCity)
                  const pages = getCurrentPages()
                  const prevPage = pages[pages.length - 2] // 上一页
                  // 调用上一个页面的setData 方法，将数据存储
                  prevPage.setCity(resCity)
                  prevPage.refresh()
                  wx.navigateBack({
                    delta: 1
                  })
                }
              },
              fail(failres) {
                ShowToast('定位失败')
              }
            })
          },
        })

      },
      complete() {
        wx.hideLoading()                    
      }
    })
  }
})