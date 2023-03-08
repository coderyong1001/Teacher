// pages/index/hotelInfo/hotelInfo.js
const app = getApp()
import { ShowToast, HideLoading, ShowLoading } from '../../../utils/show_toast_loading_modal'
import {getHotelInfos, updateHtotelInfo} from '../../../service/index-service'
const regeneratorRuntime = app.regeneratorRuntime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: false,
    order_id: '',
    isNeedRoomChoose:false,
    isNeedRoom: false,
    range_start: '',
    range_end: '', 
    selectInfos: [], // 已选择房间信息
    roomConfigObj: {}, // 房间的配置
    accommodations: [], // 酒店信息列表
    roomTypeObj: {
      1: '单人间',
      2: '双人间',
      3: '单拼房男',
      4: '单拼房女'
    },
    numRadioList: [
      {
        num: 1,
        index: 1
      },
      {
        num: 2,
        index: 2
      },
      {
        num: 3,
        index: 3
      },
      {
        num: 4,
        index: 4
      }
    ],
    imageName: {
      1: 'single',
      2: 'double',
      3: 'single',
      4: 'single'
    },
    imageClass: {
      1: 'single-image',
      2: 'double-image',
      3: 'single-image',
      4: 'single-image'
    },
    pickerStart: '',
    pickerEnd: '',
    hotelComment: '' // 填写的酒店备注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.isNeedRoomChoose);
    if (!options.from) {
      let {accommodations, hotelComment, hotelHint, isNeedRoomChoose, isNeedRoom, range_start, range_end} = app.globalData
      let selectInfos = app.globalData.accommodationConfirm
      let roomConfigObj = {}
      accommodations.forEach(item => {
        let temp = false
        item.room_info.forEach(element => {
          if (element.config === 3) {
            temp = {
              config: 4,
              price: element.price
            }
          }
          if (element.config === 4) temp = false
        })
        if (temp) item.room_info.push(temp)
        roomConfigObj[item.id] = item
      })
      selectInfos.map(item => {
        if (item.num > 3) {
          item.inputNum = item.num
          item.num = 4
        }
        return item
      })
      if (selectInfos.length === 0) {
        let chooseObj = {
          hotel_id: accommodations[0].id,
          name: accommodations[0].name,
          checkin: range_start,
          checkout: range_end,
          config: accommodations[0].room_info[0].config,
          num: 1,
          price: accommodations[0].room_info[0].price,
          inputNum: 0
        }
        if (range_start === range_end) {
          let tempRangeStart = new Date(new Date(range_start.replace(/-/g, '/')).getTime()-24*3600000)
          let nowDate = new Date()
          let dateStr = `${nowDate.getFullYear()}-${nowDate.getMonth() < 8 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1}-${nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()}`
          if (new Date(dateStr.replace(/-/g, '/')).getTime() <= tempRangeStart.getTime()){
            chooseObj.checkin = `${tempRangeStart.getFullYear()}-${tempRangeStart.getMonth() < 8 ? '0' + (tempRangeStart.getMonth() + 1) : tempRangeStart.getMonth() + 1}-${tempRangeStart.getDate() < 10 ? '0' + tempRangeStart.getDate() : tempRangeStart.getDate()}`
          }
        }
        selectInfos.push(chooseObj)
      }
      let tempstart = new Date(new Date(range_start.replace(/-/g, '/')).getTime()-10*24*3600000)
      let tempend = new Date(new Date(range_end.replace(/-/g, '/')).getTime()+10*24*3600000)
      let startYear = tempstart.getFullYear()
      let startMonth = tempstart.getMonth()+1
      let startDate = tempstart.getDate()
      let endtYear = tempend.getFullYear()
      let endMonth = tempend.getMonth()+1
      let endDate = tempend.getDate()
      let pickerStart = `${startYear}-${startMonth > 9 ? startMonth : '0' + startMonth}-${startDate > 9 ? startDate : '0' + startDate}`
      let pickerEnd = `${endtYear}-${endMonth > 9 ? endMonth : '0' + endMonth}-${endDate > 9 ? endDate : '0' + endDate}`
      this.setData({
        accommodations,
        roomConfigObj,
        selectInfos,
        isNeedRoomChoose,
        isNeedRoom,
        hotelHint,
        hotelComment,
        range_start,
        range_end,
        pickerEnd,
        pickerStart
      })
    }
    if (options.from === 'orderdetail') {
      let order_id = parseInt(options.orderid)
      ShowLoading('获取信息中')
      let hotelInfosResult = getHotelInfos({order_id})
      hotelInfosResult.then(res => {
        let temp = app.globalData.orderAccommodation
        let hotelComment = ''
        let selectInfos = []
        if (temp.hotel_info) {
          hotelComment = temp.note
          selectInfos = temp.hotel_info
          selectInfos.map(item => {
            if (item.num > 3) {
              item.inputNum = item.num
              item.num = 4
            }
            item.checkin = item.checkin.replace(/\./g, '-')
            item.checkout = item.checkout.replace(/\./g, '-')
            item.id = item.hotel_id
            return item
          })
        }
        let accommodations = []
        let roomConfigObj = {}
        accommodations = res.data.data.accommodations
        accommodations.forEach(item => {
          let temp = false
          item.room_info.forEach(element => {
            if (element.config === 3) {
              temp = {
                config: 4,
                price: element.price
              }
            }
            if (element.config === 4) temp = false
          })
          if (temp) item.room_info.push(temp)
          roomConfigObj[item.id] = item
        })
        let range_start = res.data.data.range_start
        let range_end = res.data.data.range_end
        let tempstart = new Date(new Date(range_start.replace(/-/g, '/')).getTime()-10*24*3600000)
        let tempend = new Date(new Date(range_end.replace(/-/g, '/')).getTime()+10*24*3600000)
        let startYear = tempstart.getFullYear()
        let startMonth = tempstart.getMonth()+1
        let startDate = tempstart.getDate()
        let endtYear = tempend.getFullYear()
        let endMonth = tempend.getMonth()+1
        let endDate = tempend.getDate()
        let pickerStart = `${startYear}-${startMonth > 9 ? startMonth : '0' + startMonth}-${startDate > 9 ? startDate : '0' + startDate}`
        let pickerEnd = `${endtYear}-${endMonth > 9 ? endMonth : '0' + endMonth}-${endDate > 9 ? endDate : '0' + endDate}`
        this.setData({
          accommodations,
          roomConfigObj,
          hotelHint: res.data.data.hotel_hint,
          hotelComment,
          selectInfos,
          from: options.from,
          order_id: parseInt(options.orderid),
          isNeedRoom: selectInfos.length > 0,
          range_start,
          range_end,
          pickerStart,
          pickerEnd
        })
        HideLoading()
      })
    }
  },
  // 获取上一个页面
  getPrevPage() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一页
    return prevPage
  },
  // 选择需要酒店
  chooseYes() {
    this.setData({
      isNeedRoomChoose: true
    })
    if (this.data.isNeedRoom) {
      return
    }
    this.setData({
      isNeedRoom: true
    })
  },

  // 选择不需要酒店
  chooseNo() {
    this.setData({
      isNeedRoomChoose: true
    })
    if (!this.data.isNeedRoom) {
      return
    }
    this.setData({
      isNeedRoom: false
    })
  },
  // 删除酒店信息
  deleteHotel(e) {
    let selectInfos = this.data.selectInfos
    selectInfos.splice(e.target.dataset.index, 1)
    this.setData({
      selectInfos
    })
  },
  // 检查选择是否已经存在
  checkedChoice(hotel_id, config, selectInfos, except=-1) {
    let tempobj = {
      hotel_id: parseInt(hotel_id),
      config: config
    }
    let flag = false
    for (let i = 0; i < selectInfos.length; i++) {
      if (tempobj.hotel_id === selectInfos[i].hotel_id && tempobj.config === selectInfos[i].config && ((except !== -1 && i !== except) || except === -1)) {
        flag = true
        break
      }
    }
    if (flag) {
      if (except !== -1) {
        ShowToast("该类型房源已选择")
        this.setData({
          selectInfos
        })
      }
      return false
    }
    return true
  },
  // 选择酒店
  chooseHotel(e) {
    let selectInfos = this.data.selectInfos
    let index = e.target.dataset.index
    let value = e.detail.value
    if (!this.checkedChoice(value, selectInfos[index].config, selectInfos, index)) return
    selectInfos[index].hotel_id = parseInt(value)
    this.data.accommodations.forEach(item => {
      if (item.id === selectInfos[index].hotel_id) selectInfos[index].name = item.name
    })
    this.data.roomConfigObj[selectInfos[index].hotel_id].room_info.forEach((item)=>{
      if(item.config === selectInfos[index].config) selectInfos[index].price = item.price
    })
    this.setData({
      selectInfos
    })
  },
  // 入店时间
  changeCheckIn(e) {
    console.log(e)
    let selectInfos = this.data.selectInfos
    let index = e.target.dataset.index
    let value = e.detail.value
    let nowDate = new Date()
    let dateStr = `${nowDate.getFullYear()}-${nowDate.getMonth() < 8 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1}-${nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()}`
    if (new Date(dateStr.replace(/-/g, '/')).getTime() > new Date(value.replace(/-/g, '/')).getTime()) {
      ShowToast('入店时间不应早于当前时间')
      this.setData({
        selectInfos
      })
      return
    }
    if (new Date(this.data.pickerStart.replace(/-/g, '/')).getTime() > new Date(value.replace(/-/g, '/')).getTime()) {
      selectInfos[index].checkin = this.data.pickerStart
      ShowToast('入店时间不应早于开课时间前10天')
      this.setData({
        selectInfos
      })
      return
    }
    if (new Date(value.replace(/-/g, '/')).getTime() > new Date(selectInfos[index].checkout.replace(/-/g, '/')).getTime()) {
      ShowToast('入店时间应在离店时间之前')
      this.setData({
        selectInfos
      })
      return
    }
    selectInfos[index].checkin = value
    this.setData({
      selectInfos
    })
  },
  // 离店时间
  changeCheckOut(e) {
    let selectInfos = this.data.selectInfos
    let index = e.target.dataset.index
    let value = e.detail.value
    if (new Date(value.replace(/-/g, '/')).getTime() < new Date(selectInfos[index].checkin.replace(/-/g, '/')).getTime()) {
      ShowToast('离店时间应在入店时间之后')
      this.setData({
        selectInfos
      })
      return
    }
    if (new Date(value.replace(/-/g, '/')).getTime() > new Date(this.data.pickerEnd.replace(/-/g, '/')).getTime()) {
      ShowToast('离店时间应在结课时间之后10天内')
      selectInfos[index].checkout = this.data.pickerEnd
      this.setData({
        selectInfos
      })
      return
    }
    selectInfos[index].checkout = value
    this.setData({
      selectInfos
    })
  },
  // 选择房间
  clickRoom(e) {
    let selectInfos = this.data.selectInfos
    let index = e.target.dataset.index
    let config = e.target.dataset.config
    if(!this.checkedChoice(selectInfos[index].hotel_id, config, selectInfos, index)) return
    selectInfos[index].config = parseInt(config)
    this.data.roomConfigObj[selectInfos[index].hotel_id].room_info.forEach((item)=>{
        if(item.config === selectInfos[index].config) selectInfos[index].price = item.price
    })
    this.setData({
      selectInfos
    })
  },
  // 房间数量
  chooseNum(e) {
    let selectInfos = this.data.selectInfos
    let index = e.target.dataset.index
    let value = e.detail.value
    selectInfos[index].num = parseInt(value)
    this.setData({
      selectInfos
    })
  },
  // 输入的房间数量
  numInpuChange(e) {
    let selectInfos = this.data.selectInfos
    let index = e.target.dataset.index
    let value = e.detail.value
    selectInfos[index].inputNum = parseInt(value)
    this.setData({
      selectInfos
    })
  },
  // 添加酒店
  addHotel() {
    let {selectInfos, accommodations, range_start, range_end} = this.data
    let flag = false
    selectInfos.forEach(item => {
      if(item.num === 4 && item.inputNum < 4) {
        if (item.inputNum > 0) item.num = item.inputNum
        else flag = true
      }
    })
    if (flag) {
      ShowToast('请填写房间数量')
      return
    }
    let canadd = false
    let chooseObj = {
      hotel_id: accommodations[0].id,
      name: accommodations[0].name,
      checkin: range_start,
      checkout: range_end,
      config: accommodations[0].room_info[0].config,
      num: 1,
      price: accommodations[0].room_info[0].price,
      inputNum: 0
    }
    for (let i = 0; i < accommodations.length; i++) {
      for (let j = 0; j < accommodations[i].room_info.length; j++) {
        if(this.checkedChoice(accommodations[i].id,accommodations[i].room_info[j].config,selectInfos)) {
          chooseObj = {
            hotel_id: accommodations[i].id,
            name: accommodations[i].name,
            checkin: range_start,
            checkout: range_end,
            config: accommodations[i].room_info[j].config,
            num: 1,
            price: accommodations[i].room_info[j].price,
            inputNum: 0
          }
          canadd = true
          break
        }
      }
    }
    if (!canadd) {
      ShowToast("无更多房型可添加")
      return
    }
    if (range_start === range_end) {
      let tempRangeStart = new Date(new Date(range_start.replace(/-/g, '/')).getTime()-24*3600000)
      let nowDate = new Date()
      let dateStr = `${nowDate.getFullYear()}-${nowDate.getMonth() < 8 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1}-${nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()}`
      if (new Date(dateStr.replace(/-/g, '/')).getTime() <= tempRangeStart.getTime())
        chooseObj.checkin = `${tempRangeStart.getFullYear()}-${tempRangeStart.getMonth() < 8 ? '0' + (tempRangeStart.getMonth() + 1) : tempRangeStart.getMonth() + 1}-${tempRangeStart.getDate() < 10 ? '0' + tempRangeStart.getDate() : tempRangeStart.getDate()}`
    }
    selectInfos.push(chooseObj)
    this.setData({
      selectInfos
    })
  },
  // 填写备注信息
  inputComment(e) {
    let hotelComment = e.detail.value
    this.setData({
      hotelComment
    })
  },
  async handleClick() {
    let {isNeedRoomChoose, isNeedRoom, hotelComment, selectInfos} = this.data
    let flag = 0
    selectInfos.forEach(item => {
      if(item.num === 4 && item.inputNum < 4) {
        if (item.inputNum > 0) item.num = item.inputNum
        else flag = 1
      }
      if (new Date(item.checkout.replace(/-/g, '/')).getTime() < new Date(item.checkin.replace(/-/g, '/')).getTime()) flag = 2
    })
    if ((selectInfos.length === 0 && isNeedRoom) || !isNeedRoomChoose) {
      ShowToast('您至少填写一个酒店信息，或者是否需要住宿选择否')
      return
    }
    if (flag === 1) {
      ShowToast('请填写房间数量')
      return
    }
    if (flag === 2) {
      ShowToast('入店时间应在离店时间之前')
      return
    }
    selectInfos.map(item => {
      if (item.num === 4 && item.inputNum >= 4) item.num = item.inputNum
      delete item.inputNum
      return item
    })
    // console.log(isNeedRoom, selectInfos, hotelComment)
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一页
    if (!this.data.from) {
      // 调用上一个页面的setData 方法，将数据存储
      prevPage.refreshRoomNeed(isNeedRoomChoose, isNeedRoom, selectInfos, hotelComment)
      wx.navigateBack({
        delta: 1
      })
    }
    if (this.data.from === 'orderdetail') {
      selectInfos.map(item => delete item.id)
      await updateHtotelInfo({
        order_id: this.data.order_id,
        accommodation: this.data.isNeedRoom 
          ? {
            note: this.data.hotelComment,
            hotel_info: selectInfos
          }
          : {}
      })
      prevPage.reflush()
      wx.navigateBack({
        delta: 1
      })
    }
  }
})