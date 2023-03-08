// pages/my/order/invoiceDetail/invoiceDetail.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  ShowToast,
  ShowLoading,
  HideLoading,
  ShowModal
} from '../../../../utils/show_toast_loading_modal'
import {
  makeInvoice,
  getInvoiceInfo,
  upHead,
  getInvoiceTemp,
  getInvoiceInfoUpdate,
  updateInvoiceInfo
} from '../../../../service/my-service'
import pattern from '../../../../utils/pattern'
import baseUrl from '../../../../service/baseUrl'
import calcNum from '../../../../utils/calc_num'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showdown: false,
    showOtherInfo1: false,
    // showOtherInfo2: false,
    showOtherInfo2: true,
    showAdd: true,
    tempFilePath: [], // 发票信息的展示
    canChoice: 4, // 可以选择上传的张数
    currentType: 1,
    paramsObj: {}, // 开发票的信息
    invoiceContentObj: {
      1: '培训费',
      2: '会议费',
      3: '活动费',
      4: '课程费',
    },
    isNeedInvoiceChoose: false,
    isNeedInvoice: false,
    invoiceNumber: [
      {
        order_id: 0,
        price: 0,
        maxnumber: 0,
        remaining: 0
      }
    ], // 订单信息的数组
    invoiceList: [{ // 发票信息的数组
      list: [],
      countPrice: 0,
    }],
    invoiceTemp: [], // 发票模板
    top: '',
    uploadfileUrl: [], // 上传发票信息的url
    allowInputChange: true
    // selectOrderId: {
    //   0: {
    //     0: 34
    //   }
    // } // 选择的订单id
  },
  onLoad: function (options) {
    console.log(this.data.isNeedInvoiceChoose);
    let {isNeedInvoiceChoose, isNeedInvoice} = app.globalData
    this.setData({
      isNeedInvoiceChoose:isNeedInvoiceChoose,
      isNeedInvoice:isNeedInvoice
    })
    if(options.invoiceType == 1 || options.invoiceType ==2)
      this.getInvoiceInfoData(options)
    if (options.invoiceType == 3){
      this.setData({
        currentType: options.invoiceType

      })
      this.getInvoiceUpdate(options.invoice_id)
    }
  },
  // 获取发票详情，修改
  async getInvoiceUpdate(invoiceId) {
    let invoiceInfoResult = await getInvoiceInfoUpdate({invoice_id: invoiceId})
    let res = invoiceInfoResult.data.data
    let orders = []
    let invoiceNumber = []
    let invoiceList = []
    res.price_verify_info.forEach(item => {
      orders.push(item.order_id)
      invoiceNumber.push({
        maxnumber: item.applicant_num,
        order_id: item.order_id,
        price: item.price,
        remaining: item.applicant_num,
      })
    })
    console.log('res:', res)
    console.log('res.invoice_info.details:', res.invoice_info.details)
    res.invoice_info.details.forEach(item => {
      let temp = {
        countPrice: 0,
        list: []
      }
      item.price_info.forEach(eve => {
        for (let i=0; i<invoiceNumber.length; i++) {
          console.log('invoiceNumber[i].order_id:', invoiceNumber[i].order_id)
          console.log('eve.order_id:', eve.order_id)
          console.log('invoiceNumber[i].price:', invoiceNumber[i].price)
          console.log('eve.price:', eve.price)

          
          if (invoiceNumber[i].order_id === eve.order_id && invoiceNumber[i].price === eve.price) {
            eve.priceindex = i
            break
          }
        }
        console.log('eve.priceindex:', eve.priceindex)
        if (eve.priceindex === 0 || eve.priceindex){
          temp.list.push({
            number: invoiceNumber[eve.priceindex].remaining >= eve.num ? eve.num : invoiceNumber[eve.priceindex].remaining,
            priceindex: eve.priceindex,
            order_id: eve.order_id,
            price: eve.price
          })
          invoiceNumber[eve.priceindex].remaining -= eve.num
        }
      })
      console.log('temp:', temp)
      if (temp.list.length > 0) {
        invoiceList.push(temp)
      }
    })
    let paramsObj = {
      course_id: res.course_id,
      orders,
      type: res.type ? res.type : 0,
      title_type: res.title_type ? res.title_type : 0,
      paper_elec: res.paper_elec ? res.paper_elec : 0,
      // paper_elec: 0,
      title: res.title,
      tax_number: res.tax_number,
      addr_tel: res.addr_tel,
      bank_account: res.bank_account,
      email: res.email,
      comment: res.comment,
      invoice_content: res.invoice_content,
      amount: 0,
      company: res.company
    }
    console.log('invoiceList:', invoiceList)
    this.setData({
      paramsObj,
      invoiceNumber,
      invoiceList,
      tempFilePath: res.pictures
    })
    this.checkeList()
    
  },
  // 获取订单信息, 新建
  async getInvoiceInfoData(options) {
    let {
      course_id,
      invoiceType,
      number
    } = options
    let currentType = invoiceType || 1
    let oldInfo = {}
    let invoiceContent = ''
    let invoiceNumber = []
    let ordersArr = []
    if (currentType == 1) {
      let params = {
        course_id
      }
      let getInvoiceInfoRes = await getInvoiceInfo(params)
      // oldInfo = getInvoiceInfoRes.data.data.old_info ? getInvoiceInfoRes.data.data.old_info : {}
      invoiceContent = getInvoiceInfoRes.data.data.invoice_content
      invoiceNumber.push(
        {
          order_id: 1,
          price: getInvoiceInfoRes.data.data.price[0],
          maxnumber: parseInt(number),
          remaining: parseInt(number)
        }
      )
      if (app.globalData.completedInvoiceInfo) {
        // 此处是判断是否填写了信息，填写过则展示填写过后的信息
      let keys = Object.keys(app.globalData.completedInvoiceInfo)
      if (keys.length > 0) {
        let {
          addr_tel,
          bank_account,
          comment,
          email,
          paper_elec,
          tax_number,
          title,
          title_type,
          type,
          invoice_info,
          pictures
        } = app.globalData.completedInvoiceInfo
        let paramsObj = {
          addr_tel,
          bank_account,
          comment,
          email,
          paper_elec: paper_elec ? paper_elec : 0,
          // paper_elec: 0,
          tax_number,
          title,
          title_type: title_type ? title_type : 0,
          type: type ? type : 0,
          amount: 0,
          invoice_content: invoiceContent
        }
        let invoiceList = []
        invoice_info.details.forEach(item => {
          let templistobj = {
            countPrice: 0,
            list: [
              {
                priceindex: 0,
                number: item.price_info[0].num > invoiceNumber[0].remaining ? invoiceNumber[0].remaining : item.price_info[0].num,
                order_id: 1,
                price: invoiceNumber[0].price
              }
            ]
          }
          invoiceList.push(templistobj)
          invoiceNumber[0].remaining -= templistobj.list[0].number
        })
        this.setData({
          currentType,
          paramsObj,
          invoiceNumber,
          invoiceList,
          tempFilePath: pictures
        }, () => {
          this.checkeList();
        })
        return
      }
      }
    } else if(currentType == 2) {
      let {
        price_verify_info,
        old_info,
        invoice_content,
        orders
      } = app.globalData.invoiceObj
      console.log('app.globalData.invoiceObj:', app.globalData.invoiceObj)
      oldInfo = old_info
      invoiceContent = invoice_content
      ordersArr = orders
      price_verify_info.forEach((item, index) => {
        invoiceNumber.push(
          {
            order_id: item.order_id,
            price: item.price,
            maxnumber: item.applicant_num,
            remaining: item.applicant_num
          }
        )
      })
    }
    let {
      addr_tel,
      bank_account,
      comment,
      email,
      paper_elec,
      tax_number,
      title,
      title_type,
      type
    } = oldInfo
    // console.log('oldInfo:', oldInfo)
    let paramsObj = {
      addr_tel,
      bank_account,
      comment,
      email,
      paper_elec: paper_elec ? paper_elec : 0,
      // paper_elec: 0,
      tax_number,
      title,
      title_type: title_type ? title_type : 0,
      type: type ? type : 0,
      amount: 0,
      invoice_content: invoiceContent
    }
    if (currentType == 2) {
      paramsObj.orders = ordersArr
      paramsObj.course_id = course_id
    }
    this.setData({
      currentType,
      paramsObj,
      invoiceNumber
    }, () => {
      this.addInvoice({target: {dataset: {index: 0}}})
      this.checkeList();
    });
  },
  // 修改发票信息单价
  changePrice(e) {
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    let newIndex = parseInt(e.detail.value);
    let hasPriceList = []
    const {
      invoiceList,
      invoiceNumber
    } = this.data
    let selectIndex = []
    invoiceList[index].list.forEach(eve => {
      selectIndex.push(eve.priceindex)
    })
    if (invoiceNumber[newIndex].remaining === 0) {
      ShowToast('该单价发票已开完')
      this.setData({
        invoiceNumber,
        invoiceList
      })
      this.checkeList()
      return
    }
    if (selectIndex.indexOf(newIndex) >=0 ) {
      ShowToast('该单价发票已开具')
      this.setData({
        invoiceNumber,
        invoiceList
      })
      this.checkeList()
      return
    }
    invoiceNumber[invoiceList[index].list[item].priceindex].remaining += invoiceList[index].list[item].number
    invoiceList[index].list[item].order_id = invoiceNumber[newIndex].order_id
    invoiceList[index].list[item].number = 0
    invoiceList[index].list[item].priceindex = newIndex
    invoiceList[index].list[item].price = invoiceNumber[newIndex].price
    this.setData({
      invoiceNumber,
      invoiceList
    })
    this.checkeList()
  },
  // 输入开票人数
  inputItemNumber(e) {
    const {
      invoiceList,
      invoiceNumber
    } = this.data
    const {
      index,
      item
    } = e.currentTarget.dataset
    let value = parseInt(e.detail.value)
    if (value !== value) value = 0
    // console.log(index, item, value)
    let maxnumber = invoiceNumber[invoiceList[index].list[item].priceindex].remaining + invoiceList[index].list[item].number
    value = maxnumber >= value ? value : maxnumber
    invoiceList[index].list[item].number = value
    invoiceNumber[invoiceList[index].list[item].priceindex].remaining = maxnumber - value
    this.setData({
      invoiceList,
      invoiceNumber
    })
    this.checkeList()
    // console.log(this.data)
  },
  // 设置剩余开票的数量和总价
  checkeList() {
    let {
      invoiceNumber,
      invoiceList,
      showAdd,
      paramsObj
    } = this.data
    let amount = 0
    showAdd = false
    invoiceNumber.forEach(item => item.remaining > 0 ? showAdd = true : '')
    invoiceList.forEach(invoice => {
      invoice.countPrice = 0
      invoice.list.forEach(item => {
        invoice.countPrice += item.price * item.number
      })
      invoice.countPrice = parseFloat(invoice.countPrice.toFixed(2))
      amount += invoice.countPrice
    })
    amount = parseFloat(amount.toFixed(2))
    paramsObj.amount = amount
    this.setData({
      invoiceNumber,
      paramsObj,
      showAdd,
      invoiceList
    })
  },
  // 添加发票信息
  addInvoice(event) {
    const {
      showAdd,
      invoiceList,
      invoiceNumber
    } = this.data
    if (!showAdd) {
      ShowToast('不可添加更多发票信息了')
      return
    }
    let index = event.target.dataset.index
    if (index > -1){
      if (invoiceList[index].list.length > 0 && invoiceList[index].list[invoiceList[index].list.length - 1].number === 0) {
        ShowToast('请填写已添加的发票人数')
        return
      }
      let selectIndex = []
      invoiceList[index].list.forEach(item => selectIndex.push(item.priceindex))
      let flag = true
      for (let i=0; i<invoiceNumber.length; i++) {
        if (selectIndex.indexOf(i) === -1 && invoiceNumber[i].remaining > 0) {
          invoiceList[index].list.push({
            number: 0,
            priceindex: i,
            order_id: invoiceNumber[i].order_id,
            price: invoiceNumber[i].price
          })
          flag = false
          break
        }
      }
      invoiceList[index].noadd = flag
      this.setData({
        invoiceList
      })
      this.checkeList()
    } else {
      if (invoiceList[invoiceList.length - 1].list[invoiceList[invoiceList.length - 1].list.length - 1].number === 0) {
        ShowToast('请填写已添加的发票人数')
        return
      }
      invoiceList.push({
        countPrice: 0,
        list: []
      })
      this.setData({
        invoiceList
      })
      this.addInvoice({target: {dataset: {index: invoiceList.length - 1}}})
    }
  },
  // 删除发票信息
  deleteInvoice(e) {
    let {
      invoiceList,
      invoiceNumber
    } = this.data;
    const {
      index,
      item
    } = e.currentTarget.dataset
    if (item || item === 0) {
      if (invoiceList[index].list.length === 1) {
        if (invoiceList.length === 1) {
          ShowToast("您至少需要开具一张发票");
          return;
        } else if (invoiceList.length > 1) {
          invoiceNumber[invoiceList[index].list[0].priceindex].remaining += invoiceList[index].list[0].number
          invoiceList.splice(index, 1);
        }
      } else if (invoiceList[index].list.length > 1) {
        invoiceNumber[invoiceList[index].list[item].priceindex].remaining += invoiceList[index].list[item].number
        invoiceList[index].list.splice(item, 1);
      }
    } else {
      if (invoiceList.length === 1) {
        ShowToast("您至少需要开具一张发票");
        return;
      } else if (invoiceList.length > 1) {
        invoiceList[index].list.forEach(item => {
          invoiceNumber[item.priceindex].remaining += item.number
        })
        invoiceList.splice(index, 1);
      }
    }
    this.setData({
      invoiceList,
      invoiceNumber
    }, () => {
      this.checkeList();
    });
  },

  // 设置参数
  setParams(e) {
    this.setData({
      paramsObj: {
        ...this.data.paramsObj,
        [e.currentTarget.dataset.name]: e.detail.value
      },
    }, () => {
      console.log('paramsObj111:', this.data.paramsObj)
    })
  },
  // 验证税号输入的是否是中文
  regChinese(e) {
    let val = e.detail.value
    let reg = /^(([0-9a-zA-Z]{1,})|([\u65e0]{1})|([\u65e0][\u7a0e][\u53f7]{1}))$/
    let regResult = reg.test(val)
    if (!regResult) {
      this.setData({
        paramsObj: {
          ...this.data.paramsObj,
          [e.currentTarget.dataset.name]: '无税号'
        }
      })
      return
    }
  },
  // 单选
  chooseType: function (e) {
    const {
      name,
      value
    } = e.currentTarget.dataset
    let paramsObj = Object.assign({}, this.data.paramsObj)
    paramsObj = {
      ...paramsObj,
      [name]: value
    }
    if (paramsObj.title_type == 1) paramsObj.type = 0
    this.setData({
      paramsObj
    })
  },
  // 输入框
  inputChange(e) {
    if (e.currentTarget.dataset.name === 'title' && !this.data.allowInputChange) {
      return
    }
    if (!e.detail.value) {
      this.setData({
        invoiceTemp: [],
        paramsObj: {
          ...this.data.paramsObj,
          [e.currentTarget.dataset.name]: e.detail.value
        }
      })     
      return
    }
    if (e.currentTarget.dataset.name === 'title' && e.detail.value) {
      let params = {
        search: e.detail.value
      }
      this.searchInvoiceTemp(params)
    }
    this.setParams(e)
  },
  inputFocus(e) {
    if (e.target.dataset.name === "title") {
      this.setData({
        top: `-${e.detail.height}`,
        showdown: true,
        allowInputChange: true
      })
    } else {
      this.setData({
        top: `-${e.detail.height}`,
      })
    }
  },
  inputBlur() {
    setTimeout(() => {
      this.setData({
        top: '',
        showdown: false
      })
    }, 500)
  },
  // 选择发票模板
  chooseTemp(e) {
    const {
      id
    } = e.currentTarget.dataset
    let invoiceTemp = this.data.invoiceTemp
    let chooseInvoiceTemp = invoiceTemp.filter(item => {
      return item.id === id
    })
    const {
      addr_tel,
      bank_account,
      email,
      tax_number,
      title
    } = chooseInvoiceTemp[0]
    let invoiceObj = {
      title,
      tax_number,
      email,
      bank_account,
      addr_tel
    }
    this.setData({
      paramsObj: {
        ...this.data.paramsObj,
        ...invoiceObj
      },
      allowInputChange: false,
      invoiceTemp: [],
    })
  },
  // 获取发票模板
  async searchInvoiceTemp(params) {
    let tempDataRes = await getInvoiceTemp(params)
    console.log('tempDataRes:', tempDataRes)
    if (tempDataRes.data.code === 200) {
      let tempData = tempDataRes.data.data
      if (tempData && tempData.length) {
        this.setData({
          invoiceTemp: tempData,
        })
      }
    } else if (tempDataRes.data.code === 10044) {
      this.setData({
        invoiceTemp: [],
      })
    }
  },
  // 显示折叠更多内容和其他信息
  showOther: function (e) {
    let id = e.currentTarget.dataset.id;
    id == 1 ?
      this.setData({
        showOtherInfo1: !this.data.showOtherInfo1
      }) :
      this.setData({
        showOtherInfo2: !this.data.showOtherInfo2
      });
  },
  // 检验发票
  async checkInvoice() {
    console.log(this.data.isNeedInvoiceChoose);
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一页
    const { isNeedInvoiceChoose, isNeedInvoice, currentType } = this.data
    if ( !isNeedInvoiceChoose ) {
      ShowToast(' 请选择是否需要开具发票！')
      return
    }
    if (!isNeedInvoice && currentType == 1) {
      // 不开发票
      prevPage.setInvoiceInfo();
      wx.navigateBack({
        delta: 1
      })
      return
    }

    // 参数处理
    const {
      invoiceList,
    } = this.data
    const {
      type,
      title_type,
      paper_elec,
      title,
      tax_number,
      email,
      addr_tel,
      bank_account
    } = this.data.paramsObj
    if (paper_elec != 0 && paper_elec != 1) {
      ShowToast('请选择发票类型')
      return
    }
    if (title_type != 0 && title_type != 1) {
      ShowToast('请选择抬头类型')
      return
    }
    if (type != 0 && type != 1) {
      ShowToast('请选择发票种类')
      return
    }
    if (!title) {
      ShowToast('请填写发票抬头')
      return
    }
    if (title_type == 0) {
      if (!tax_number) {
        ShowToast('请填写税号')
        return
      }
    }
    if (paper_elec == 0) {
      if (!email) {
        ShowToast('请填写邮箱')
        return
      }
      let emailReg = pattern.email.test(email)
      if (!emailReg) {
        ShowToast('请输入正确的邮箱')
        return
      }
    }
    if (title_type == 0) {
      if (!addr_tel && paper_elec == 1 && title_type == 0) {
        ShowToast('请填写地址和手机号')
        return
      }
      // if (!bank_account || !(bank_account.trim())) {
      //   ShowToast('请填写开户行和账号')
      //   return
      // }
    }
    if (invoiceList.length === 1 && invoiceList[0].list[0].number === 0) {
      ShowToast("你至少开一张发票")
      return
    }


    if (title_type == 0) {
      let checkParams = {
        search: tax_number
      }
      let checkRes = await getInvoiceTemp(checkParams)
      if (checkRes.data.code == 10044) {
        this.handleClick()
        return
      }
      if (checkRes.data.code == 200) {
        // wx.showModal({
        //   title: '提示',
        //   content: '该税号与发票信息库中的税号重复，是否确认提交',
        //   cancelText: '去查验',
        //   confirmColor:"#018389",
        //   confirmText: '确认提交',
        //   success: (res) => {
        //     if (res.confirm) {
        //       this.handleClick()
        //     } else if (res.cancel) {
  
        //     }
        //   }
        // })
        this.handleClick()
      }
      
    } else {
      this.handleClick()
    }
  },
  // 提交
  async handleClick() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    // 参数处理
    const {
      paramsObj,
      invoiceList,
      tempFilePath,
      invoiceNumber,
      currentType 
    } = this.data
    const {
      paper_elec,
    } = this.data.paramsObj
    
    paramsObj.comment = paramsObj.comment || ""
    if (paper_elec == 1) {
      paramsObj.email = ''
    }
    if (paramsObj.title_type == 1) {
      paramsObj.tax_number = ''
      paramsObj.addr_tel = ''
      paramsObj.bank_account = ''
    }
    if (paramsObj.title_type == 0  && paper_elec == 0) {
      paramsObj.addr_tel = ''
    }
    paramsObj.invoice_info = {
      invoice_number: 0,
      details: []
    }
    invoiceList.forEach(item => {
      if (item.countPrice > 0) {
        let tempObj = {}
        tempObj.price_info = []
        tempObj.detail_amount = item.countPrice
        paramsObj.invoice_info.invoice_number += 1
        item.list.forEach(everyone => {
          if (everyone.number > 0) {
            tempObj.price_info.push({
              price: invoiceNumber[everyone.priceindex].price,
              num: everyone.number,
              order_id: everyone.order_id
            })
          }
        })
        paramsObj.invoice_info.details.push(tempObj)
      }
    })
    paramsObj.pictures = []
    if (tempFilePath.length) {
      ShowLoading("图片上传中")
      for (let i = 0; i < tempFilePath.length; i++) {
        if (/^http:\/\/tmp\//.test(tempFilePath[i])) {
          let res = await upHead(tempFilePath[i], 'file')
          paramsObj.pictures.push(res.data.data.file_url)
        } else {
          paramsObj.pictures.push(tempFilePath[i])
        }
      }
      HideLoading();
    }
    if (currentType == 1) {
      // 调用上一个页面的setData 方法，将数据存储
      paramsObj.invoice_info.details.map(item => {
        item.price_info.map(eve => {
          delete eve.order_id
          return eve
        })
        return item
      })
      prevPage.setInvoiceInfo(paramsObj);
      wx.navigateBack({
        delta: 1
      })
      return
    }
    
    // 新建发票
    if (currentType == 2) {
      let res = await makeInvoice(paramsObj)
      wx.navigateBack({
        delta: 2
      })
      return
    }
    // 修改发票
    if (currentType == 3) {
      let res = await updateInvoiceInfo(paramsObj)
      pages[pages.length - 3].refresh()
      wx.navigateBack({
        delta: 2
      })
    }
  },
  // 是否开具发票
  clickYesNo(e) {
    const that=this
    switch (e.currentTarget.dataset.value) {
      case 'yes':
        console.log(1,that.data.isNeedInvoiceChoose);
        this.setData({
          isNeedInvoiceChoose: true,
          isNeedInvoice: true
        });
        break;
      case 'no':
        console.log(2,that.data.isNeedInvoiceChoose);
        this.setData({
          isNeedInvoiceChoose: true,
          isNeedInvoice: false
        });
        break;
    }
  },
  // 选择图片
  upImage() {
    wx.chooseImage({
      count: this.data.canChoice,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log("res", res);
        this.setData({
          tempFilePath: [...this.data.tempFilePath, ...res.tempFilePaths],
          canChoice: this.data.canChoice - res.tempFilePaths.length
        })
      }
    })
  },
  // 删除图片
  deleteImg(e) {
    let tempFilePath = this.data.tempFilePath;
    tempFilePath.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      tempFilePath,
      canChoice: this.data.canChoice + 1
    });
  },
})