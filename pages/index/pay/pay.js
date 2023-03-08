// pages/index/pay/pay.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import baseUrl from '../../../service/baseUrl'
import {
  getUserHotelInfo,
  getContact,
  submitOrder,
  payOrder
} from '../../../service/index-service'
import {
  ShowToast,
  ShowLoading,
  HideLoading
} from '../../../utils/show_toast_loading_modal'


const subscribe1 = 'rcmbXweM0VugXLgKpruZdhuHhsKuLbEYmEn8Dz68fqo' //退款通知消息订阅id
const subscribe2 = '1aPviO32faKkunJn-0JO5EhsWCFQmsMSIBw0LnvfnNo' // 課程待支付订阅id
const subscribe3 = 'n75OH6kmUSoZ53EIRt4Em87V9dZVcemMgEc-k3h4CHM' // 报名成功订阅id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: '../../../assets/images/course_bg.png',
    course_id: '', // 课程id
    user_info: {}, // 用户信息
    course_info: {}, // 课程信息
    accommodations: [], // 酒店信息列表
    accommodationConfirm: [], // 要提交的酒店信息
    hotelHint: '', // 后台配置的酒店备注信息
    hotelType: '', // 酒店类型，是否可预订
    hotelComment: '',// 填写的酒店备注信息
    range_start: '', //开课时间
    range_end: '', // 课程结束时间
    selfApplyInfo: [], // 保存自己的报名信息,
    personList: [], // 报名人员信息,
    contactList: [], // 联系人列表
    checkstatus: {}, // 选中联系人
    contactIdArr: [], // 选中的联系人id
    confirmId: {}, // 新添加的联系人id
    isNeedRoomChoose: false,
    isNeedRoom: false, // 是否需要住宿
    isNeedInvoiceChoose: false,
    isNeedInvoice: false, // 是否需要发票
    hotelList: [ // 入住信息
      {
        id: 1,
        type: 'add1'
      }
    ],
    invoiceInfo: {}, // 发票信息
    isFocus: false,
    showUpFile: false, // 显示上传
    showRemark: false, // 显示备注
    isShowFeeDetail: false, // 显示模态框
    showAnimation: false, // 显示动画效果    
    isShowAdd: false, // 显示添加联系人
    payment_method: 0, // 支付方式 0： 微信支付 1：线下汇款 2：其他
    uploadfileUrl: [],
    price: '', // 单价
    amount: '', // 总价
    comment: '', // 支付备注说明
    page_num: 1,
    showNoData: false,
    showNoMore: false,
    showQRCode:false,
    RQCodeImg:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      course_id: options.course_id
    }, () => {
      this.getUserHotelData()
    })
    console.log('pay-onload:',this.data)
  },
  onShow: function () {
    console.log('pay:',this.data)
  },

  // 设置发票参数
  setInvoiceInfo(invoiceInfo) {
    if (invoiceInfo){
      this.setData({
        invoiceInfo,
        isNeedInvoiceChoose: true,
        isNeedInvoice: true
      });
    } else {
      this.setData({
        invoiceInfo: {},
        isNeedInvoiceChoose: true,
        isNeedInvoice: false
      });
    }
  },
  // 获取支付详情页面
  async getUserHotelData() {
    const {
      course_id
    } = this.data
    let params = {
      course_id
    }
    let getUserHotelInfoRes = await getUserHotelInfo(params)
    let getUserHotelInfoObj = getUserHotelInfoRes.data.data
    let idArr = this.data.contactIdArr
    getUserHotelInfoObj.user_info.id && idArr.push(getUserHotelInfoObj.user_info.id)
    let accommodations = getUserHotelInfoObj.course_info.accommodations
    let hotelHint = getUserHotelInfoObj.course_info.hotel_hint
    let hotelType = getUserHotelInfoObj.course_info.hotel_type
    let range_start = getUserHotelInfoObj.course_info.range_start
    let range_end = getUserHotelInfoObj.course_info.range_end
    this.setData({
      RQCodeImg:getUserHotelInfoObj.course_info.qr_code,
      course_info: getUserHotelInfoObj.course_info,
      personList: getUserHotelInfoObj.user_info.tel ? [getUserHotelInfoObj.user_info] : [],
      selfApplyInfo: getUserHotelInfoObj.user_info.tel ? [getUserHotelInfoObj.user_info] : [],
      checkstatus: getUserHotelInfoObj.user_info.id ? {...this.data.checkstatus, [getUserHotelInfoObj.user_info.id]: true} : this.data.checkstatus,
      hotelRadioList: accommodations.length ? getUserHotelInfoObj.course_info.accommodations : [],
      selectedHotel: accommodations.length ? {
        add1: getUserHotelInfoObj.course_info.accommodations[0].name
      } : {},
      contactIdArr: idArr,
      amount: getUserHotelInfoObj.course_info.price,
      price: getUserHotelInfoObj.course_info.price,
      accommodations,
      hotelHint,
      range_start,
      range_end,
      hotelType
    }, () => {
      console.log('selfApplyInfo:', this.data.selfApplyInfo)
    })
  },
  // 获取联系人
  async getContactList() {
    const {
      page_num,
      selfApplyInfo,
      personList
    } = this.data
    let params = {
      page_num,
      page_size: 20
    }
    let getContactRes = await getContact(params)
    let pager = getContactRes.data.data.pager
    
    if (pager.count === 0) {
      this.setData({
        showNoData: true,
        showNoMore: false,
        contactList: selfApplyInfo
      })
    } else {
      this.setData({
        contactList: [...selfApplyInfo, ...this.data.contactList, ...getContactRes.data.data.list],
        page_num: pager.page_num + 1,
        showNoData: false,
        showNoMore: false
      }, () => {
        if (this.data.contactList.length >= pager.count) {
          this.setData({
            showNoMore: true
          })
        }
      })
    }
  },
  // 联系人输入框滑动触底事件
  bindscrolltolower() {
    const {
      showNoData,
      showNoMore
    } = this.data
    if (showNoData || showNoMore) {
      return
    }
    this.getContactList()
  },
  // 刷新联系人列表
  refresh() {
    this.setData({
      contactList: [],
      page_num: 1
    }, () => {
      this.getContactList()
    })
  },
  // 添加报名人
  addPerson() {
    this.setData({
      page_num: 1,
      contactList: []
    }, async () => {
      await this.getContactList()
      this.setData({
        isShowAdd: !this.data.isShowAdd
      }, () => {
        this.setData({
          showAnimation: !this.data.showAnimation
        })
      })
    })

  },
  // 选择要添加的联系人
  checkboxChange(e) {
    let {
      index,
      contactid
    } = e.currentTarget.dataset
    const {
      checkstatus
    } = this.data
    if (!checkstatus[contactid]) {
      this.setData({
        checkstatus: {
          ...this.data.checkstatus,
          [contactid]: true
        }
      }, () => {
        console.log('checkstatus:', this.data.checkstatus)
      })
    } else {
      this.setData({
        checkstatus: {
          ...this.data.checkstatus,
          [contactid]: false
        },
      }, () => {
        console.log('checkstatus2:', this.data.checkstatus)
      })
    }
  },
  // 确认添加联系人
  confirmAdd() {
    const {
      contactList,
      checkstatus,
    } = this.data
    let personList = this.data.personList
    let contactIdArr = this.data.contactIdArr
    let confirmArr = [] // 选中的报名人
    let confirmIdArr = [] // 选中的报名人的id

    contactList.map(item => {
      if (checkstatus[item.id]) {
        confirmArr.push(item)
      }
    })
    confirmArr = [...this.data.personList, ...confirmArr]
    var result = [] // 去重的结果
    var obj = {}
    // 去重
    for (var i = 0; i < confirmArr.length; i++) {
      if (!obj[confirmArr[i].id]) {
        result.push(confirmArr[i]);
        obj[confirmArr[i].id] = true;
      }
    }
    // 去掉没有选中的
    result.map((item, index) => {
      if (checkstatus[item.id] === false) { // 不能直接判断是否存在
        result.splice(index, 1)
      }
    })
    // 保存选中的id
    result.map(item => {
      if (contactIdArr.indexOf(item.id) === -1) {
        confirmIdArr.push(item.id)
      }
    })
    // 去掉未选中的
    contactIdArr.map((item, index) => {
      if (checkstatus[item] === false) {
        contactIdArr.splice(index, 1)
      }
    })
    this.setData({
      personList: result,
      contactIdArr: [...contactIdArr, ...confirmIdArr],
      confirmId: checkstatus
    }, () => {
      console.log('添加contactIdArr:', this.data.contactIdArr)
      this.calMoney()
      this.closeModal()
    })
  },
  // 删除报名人
  deletePerson(e) {
    wx.showModal({
      title: '提示',
        content: '是否确定要删除报名人？',
        confirmColor: '#018389',
        success: (res) => {
          if (res.confirm) {
            this.confirmDelete(e)
          }
        }
    })
  },
  // 删除报名人员信息
  confirmDelete(e) {
    let {
      index,
      contactid
    } = e.currentTarget.dataset
    let contactIdArr = this.data.contactIdArr
    let checkstatus = this.data.checkstatus
    let personList = this.data.personList
    personList.splice(index, 1)
    contactIdArr.splice(index, 1)
    checkstatus[contactid] = false
    this.setData({
      personList,
      contactIdArr,
      checkstatus
    }, () => {
      console.log('删除contactIdArr:', this.data.contactIdArr)
      this.calMoney()
    })
  },
  // 新增联系人
  handleClick() {
    wx.navigateTo({
      url: '/pages/my/myContact/addContact/addContact'
    })
  },
  //打开二维码
  openImgClick(){
    this.setData({showQRCode:true})
  },
  //关闭二维码
  closeImgClick(){
    this.setData({showQRCode:false})
  },
  // 编辑联系人
  editPerson(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/my/myContact/addContact/addContact?id=${id}`
    })
  },
  // 选择入住信息
  fillHotelInfo() {
    const {isNeedRoomChoose, isNeedRoom, personList, accommodations, accommodationConfirm, hotelHint, hotelComment, range_start, range_end} = this.data
    if (!personList.length) {
      ShowToast('请添加报名人')
      return
    }
    app.globalData.isNeedRoomChoose = isNeedRoomChoose
    app.globalData.isNeedRoom = isNeedRoom
    app.globalData.accommodations = accommodations
    app.globalData.accommodationConfirm = accommodationConfirm
    app.globalData.hotelHint = hotelHint
    app.globalData.hotelComment = hotelComment
    app.globalData.range_start = range_start
    app.globalData.range_end = range_end
    wx.navigateTo({
      url: '/pages/index/hotelInfo/hotelInfo'
    })
  },
  // 完善发票信息
  fillInvoiceInfo() {
    let  { course_id, personList, invoiceInfo, isNeedInvoiceChoose, isNeedInvoice } = this.data
    if (!personList.length) {
      ShowToast('请添加报名人')
      return
    }
    app.globalData.completedInvoiceInfo = invoiceInfo
    app.globalData.isNeedInvoiceChoose = isNeedInvoiceChoose
    app.globalData.isNeedInvoice = isNeedInvoice
    wx.navigateTo({
      url: `/pages/my/order/invoiceDetail/invoiceDetail?invoiceType=1&course_id=${course_id}&number=${personList.length}`
    })
  },
  refreshRoomNeed(isNeedRoomChoose, isNeedRoom, accommodationConfirm, hotelComment) {
    this.setData({
      isNeedRoomChoose,
      isNeedRoom,
      accommodationConfirm,
      hotelComment
    })
  },
  payChange(e) {
    let val = e.detail.value
    switch (val) {
      case 'wxpay':
        this.setData({
          showUpFile: false,
          showRemark: false,
          payment_method: 0
        })
        break
      case 'offline':
        this.setData({
          showUpFile: true,
          showRemark: false,
          payment_method: 1
        })
        break
        // case 'other':
        //   this.setData({
        //     showUpFile: false,
        //     showRemark: true,
        //     payment_method: 2
        //   })
        break
    }


  },
  // 浮点数相乘
  accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  // 计算支付金额
  calMoney() {
    const {
      contactIdArr,
      price
    } = this.data
    let amount = this.accMul(price, contactIdArr.length)
    this.setData({
      amount
    })
  },
  // 上传支付凭证
  chooseFile() {
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        ShowLoading('上传中')
        let tempFilePath = res && res.tempFilePaths[0]
        wx.uploadFile({
          url: baseUrl + '/file_upload/',
          filePath: tempFilePath,
          name: 'file',
          header: {
            'Authorization': 'Bear ' + wx.getStorageSync('token')
          },
          success(uploadres) {
            HideLoading()
            let uploadresObj = JSON.parse(uploadres.data)
            if (uploadresObj.code === 200) {
              let file_url = uploadresObj.data.file_url
              let uploadfileUrl = _this.data.uploadfileUrl
              uploadfileUrl.push(file_url)
              _this.setData({
                uploadfileUrl
              })
            } else {
              ShowToast(uploadresObj.msg)
            }

          },
          fail(failres) {
            ShowToast(failres.errMsg)
          }
        })
      },
      fail(failRes) {
        let showText = (failRes.errMsg.indexOf('cancel') !== -1) ? '已取消上传' : failRes.errMsg
        ShowToast(showText)
      }
    })
  },
  // 删除图片
  deleteItem(e) {
    let uploadfileUrl = this.data.uploadfileUrl
    uploadfileUrl.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      uploadfileUrl: uploadfileUrl
    })
  },
  // 显示费用明细
  showFeeDetail() {
    this.setData({
      isShowFeeDetail: !this.data.isShowFeeDetail
    }, () => {
      this.setData({
        showAnimation: !this.data.showAnimation
      })
    })
  },
  // 关闭模态框
  closeModal() {
    this.setData({
      showAnimation: false,
      isShowFeeDetail: false,
      isShowAdd: false,
      page_num: 1
    })
  },

  // 取消
  cancel() {
    this.setData({
      checkstatus: this.data.confirmId
    }, () => {
      this.closeModal()
    })
  },
  click(e) {
    // console.log(e)
  },
  // 填写支付备注说明
  commentInput(e) {
    let value = e.detail.value
    this.setData({
      comment: value
    })
  },
  // 支付
  clickPay() {
    const {
      contactIdArr,
      payment_method,
      uploadfileUrl,
      isNeedRoomChoose,
      isNeedInvoiceChoose
    } = this.data
    if ( !isNeedRoomChoose && this.data.hotelRadioList.length && this.data.hotelType === 3) {
      ShowToast('请填写入住信息！')
      return
    }
    if ( !isNeedInvoiceChoose ) {
      ShowToast('请填写发票信息！')
      return
    }
    if (!contactIdArr.length) {
      ShowToast('请添加报名人')
      return
    }
    let confirmPay = () => {
      if (!uploadfileUrl.length && payment_method === 1) {
        wx.showModal({
          title: '提示',
          content: '未上传支付凭证，是否继续？',
          confirmColor: '#018389',
          success: async (res) => {
            if (res.confirm) {
              this.clickPayFuc()
            }
          }
        })
        return
      }
      this.clickPayFuc()
    }
    wx.requestSubscribeMessage({
      tmplIds: [subscribe1, subscribe2, subscribe3],
      success:(res) => {
        confirmPay()
      },
      fail:(err) =>{
        confirmPay()
      }
    })
    
  },
  // 支付
  async clickPayFuc() {
    const {
      course_id,
      contactIdArr,
      payment_method,
      amount,
      uploadfileUrl,
      comment,
      invoiceInfo,
      isNeedInvoice,
      isNeedRoom,
      hotelComment,
      accommodationConfirm,
    } = this.data
    let hotelName = []
    let params = {
      course_id: parseInt(course_id),
      applicant_info: contactIdArr,
      payment_method,
      voucher: uploadfileUrl,
      comment,
      amount: parseFloat(amount)
    }
    if (isNeedRoom) 
      params.accommodation = {
        note: hotelComment,
        hotel_info: accommodationConfirm
      }
    if (isNeedInvoice) {
      params.invoice_data = invoiceInfo
      let tempnum = 0;
      invoiceInfo.invoice_info.details.forEach(item => {
        item.price_info.forEach(e => {
          tempnum += e.num
        })
      })
      if (tempnum > contactIdArr.length) {
        ShowToast("开票人数大于报名人数，请重新填写发票信息")
        return
      }
    }
    let submitOrderRes = await submitOrder(params)
    if(submitOrderRes.data.data.detail && submitOrderRes.data.data.detail.indexOf('已报名')){
      this.openImgClick()
    }
    if(!submitOrderRes.data.data.order_id){
      ShowToast(submitOrderRes.data.msg)
      return
    }
    if (payment_method === 1 || payment_method === 2) {
      wx.navigateTo({
        url: '/pages/index/check/check',
      })
      ShowToast('已提交订单')
      return
    }
    let payParams = {
      order_id: submitOrderRes.data.data.order_id,
      openid: wx.getStorageSync('openId'),
      pay_type: 'UnionPay_Third_Mini'
    }
    let payOrderRes = await payOrder(payParams)
    if (payOrderRes.data.code === 1111) {
      this.setData({RQCodeImg : payOrderRes.data.data.qr_code})
      ShowToast('订单已支付')
      this.openImgClick()
      return
    }
    console.log('payOrderRes', payOrderRes)
    const {
      timeStamp,
      nonceStr,
      paySign,
      signType,
      qr_code
    } = payOrderRes.data.data
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: payOrderRes.data.data.package,
      signType,
      paySign,
      success(res) {
        app.globalData.groupCode = qr_code
        wx.navigateTo({
          url: '/pages/my/order/order',
        })
      },
      fail(failres) {
        wx.showToast({
          title: failres.errMsg.indexOf('cancel') !== -1 ? '支付取消' : failres.errMsg,
          icon: 'none',
          mask: true,
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/my/order/order',
          })
        }, 1500)
      },
    })
  },
})