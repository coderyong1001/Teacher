// pages/my/order/invoiceDetail/invoiceDetail.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  ShowToast,
  ShowLoading,
  HideLoading
} from '../../../../utils/show_toast_loading_modal'
import {
  makeInvoice,
  getInvoiceInfo,
  upHead,
  getInvoiceTemp
} from '../../../../service/my-service'
import pattern from '../../../../utils/pattern'
import baseUrl from '../../../../service/baseUrl'
import calcNum from '../../../../utils/calc_num'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOtherInfo1: false,
    showOtherInfo2: false,
    showAdd: true,
    tempFilePath: [], // 发票信息的展示
    canChoice: 4, // 可以选择上传的张数
    type: 1,
    paramsObj: {}, // 开发票的信息
    invoiceContentObj: {
      1: '培训费',
      2: '会议费',
      3: '活动费',
      4: '课程费',
    },
    showDetail: true,
    invoiceNumber: [{
      price: 0,
      maxnumber: 0,
      remaining: 0
    }],
    priceList: [0],
    invoiceList: [{
      list: [{
        priceindex: 0,
        number: 0
      }],
      countPrice: 0,
    }],
    invoiceTemp: [], // 发票模板
    top: '',
    uploadfileUrl: [], // 上传发票信息的url
  },
  onLoad: function (options) {
    if (options.type == 1) {
      getInvoiceInfo({
        course_id: options.course_id
      }).then(res => {
        let paramsObj = {}
        let type = options.type || 1
        paramsObj.invoice_content = res.data.data.invoice_content
        paramsObj.amount = 0
        let priceList = res.data.data.price
        if (res.data.data.old_info) {
          // let old_info = res.data.data.old_info
          let { addr_tel, bank_account, comment, email, paper_elec, tax_number, title, title_type, type } = res.data.data.old_info
          paramsObj.title = title
          paramsObj.addr_tel = addr_tel
          paramsObj.bank_account = bank_account
          paramsObj.paper_elec = `${paper_elec}`
          paramsObj.title_type = title_type
          paramsObj.type = type
          paramsObj.comment = comment
          paramsObj.email = email
          paramsObj.tax_number = tax_number
        }
        let invoiceNumber = [{
          price: priceList[0],
          maxnumber: parseInt(options.number),
          remaining: parseInt(options.number)
        }]
        this.setData({
          type,
          priceList,
          paramsObj,
          invoiceNumber
        });
      });
      this.checkeList();
    }
    if (options.type == 2) {
      let {
        price_verify_info,
        old_info,
        invoice_content,
        orders
      } = app.globalData.invoiceObj
      
      let paramsObj = {
        title_type: old_info.title_type,
        type: old_info.type,
        paper_elec: old_info.paper_elec,
        title: old_info.title,
        tax_number: old_info.tax_number,
        addr_tel: old_info.addr_tel,
        bank_account: old_info.bank_account,
        email: old_info.email,
        comment: old_info.comment,
        amount: 0,
        course_id: parseInt(options.course_id),
        orders,
        invoice_content
      }
      // paramsObj.invoice_content = invoice_content
      let invoiceNumber = []
      let priceList = []
      price_verify_info.forEach(item => {
        invoiceNumber.push({
          price: item.price,
          maxnumber: item.applicant_num,
          remaining: item.applicant_num
        })
        priceList.push(item.price)
      })
      // let tempFilePath = old_info.pictures
      console.log(app.globalData.invoiceObj)
      this.setData({
        type: options.type,
        priceList,
        invoiceNumber,
        paramsObj,
        // tempFilePath
      })
      this.checkeList()
    }
  },
  // 设置参数
  setParams(e) {
    this.setData({
      paramsObj: {
        ...this.data.paramsObj,
        [e.currentTarget.dataset.name]: e.detail.value
      }
    })
  },
  // 单选
  chooseType: function (e) {
    const { name, value } = e.currentTarget.dataset
    this.setData({
      paramsObj: {
        ...this.data.paramsObj,
        [name]: value
      }
    })
  },
  // 输入框
  inputChange(e) {
    if (!e.detail.value) {
      this.setData({
        invoiceTemp: []
      })
      return
    }
    if (e.currentTarget.dataset.name === 'title') {
      let params = {
        search: e.detail.value
      }
      this.searchInvoiceTemp(params)
    }
    this.setParams(e)
  },
  inputFocus(e) {
    this.setData({
      top: `-${e.detail.height}`
    })
  },
  inputBlur() {
    this.setData({
      top: ''
    })
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
      invoiceTemp: []
    })
  },
  // 获取发票模板
  async searchInvoiceTemp(params) {
    let tempDataRes = await getInvoiceTemp(params)
    if (tempDataRes.data.code === 200) {
      let tempData = tempDataRes.data.data
      if (tempData && tempData.length) {
        this.setData({
          invoiceTemp: tempData
        })
      }
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
  // 提交
  async handleClick() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一页
    if (!this.data.showDetail && this.data.type == 1) {
      // 不开发票
      prevPage.setInvoiceInfo();
      wx.navigateBack({
        delta: 1
      })
      return
    }
    // 参数处理
    const {
      paramsObj,
      invoiceList,
      tempFilePath,
      priceList
    } = this.data
    const {
      type,
      title_type,
      paper_elec,
      title,
      tax_number,
      email
    } = this.data.paramsObj
    if (!paper_elec) {
      ShowToast('请选择发票类型')
      return
    }
    if (!title_type) {
      ShowToast('请选择抬头类型')
      return
    }
    if (!type) {
      ShowToast('请选择发票种类')
      return
    }
    if (!title) {
      ShowToast('请填写发票抬头')
      return
    }
    if (paper_elec === '0') {
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
    if (title_type === '0') {
      if (!tax_number) {
        ShowToast('请填写税号')
        return
      }
    }
    if (invoiceList.length === 1 && invoiceList[0].list[0].number === 0) {
      ShowToast("你至少开一张发票")
      return
    }
    paramsObj.comment = paramsObj.comment || ""
    if (paper_elec === '1') {
      paramsObj.email = ''
    }
    if (paramsObj.title_type === '1') {
      paramsObj.tax_number = ''
      paramsObj.addr_tel = ''
      paramsObj.bank_account = ''
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
              price: priceList[everyone.priceindex],
              num: everyone.number
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
    if (this.data.type == 1) {
      // 调用上一个页面的setData 方法，将数据存储
      prevPage.setInvoiceInfo(paramsObj);
      wx.navigateBack({
        delta: 1
      })
      return
    }
    // 新建发票
    if (this.data.type == 2) {
      let res = await makeInvoice(paramsObj)
      wx.navigateBack({
        delta: 2
      })
      return
    }
    console.log(paramsObj);
  },
  // 是否开具发票
  clickYesNo(e) {
    switch (e.currentTarget.dataset.value) {
      case 'yes':
        this.setData({
          showDetail: true
        });
        break;
      case 'no':
        this.setData({
          showDetail: false
        });
        break;
    }
  },
  // 修改发票信息单价
  changePrice(e) {
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    let hasPriceList = [];
    let invoiceList = this.data.invoiceList;
    let newIndex = parseInt(e.detail.value);
    let invoiceNumber = this.data.invoiceNumber;
    invoiceList[index].list.forEach(e => {
      hasPriceList.push(e.priceindex);
    });
    if (hasPriceList.indexOf(newIndex) >= 0) {
      ShowToast("该单价已选择");
    } else {
      let number = invoiceList[index].list[item].number;
      for (let i = 0; i < this.data.invoiceNumber.length; i++) {
        if (this.data.invoiceNumber[i].price === this.data.priceList[newIndex]) {
          let maxnumber = this.data.invoiceNumber[i].remaining;
          if (maxnumber === 0) {
            ShowToast("该单价发票已填完");
            newIndex = invoiceList[index].list[item].priceindex;
          } else {
            number = number > maxnumber ? maxnumber : number;
          }
          break;
        }
      }
      invoiceList[index].list[item].priceindex = newIndex;
      invoiceList[index].list[item].number = number;
    }
    this.setData({
      invoiceList
    });
    this.checkeList();
  },
  // 删除发票信息
  deleteInvoice(e) {
    let invoiceList = this.data.invoiceList;
    if (e.currentTarget.dataset.item || e.currentTarget.dataset.item === 0) {
      let index = e.currentTarget.dataset.index;
      let item = e.currentTarget.dataset.item;
      if (invoiceList[index].list.length === 1) {
        if (invoiceList.length === 1) {
          ShowToast("您至少需要开具一张发票");
          return;
        } else if (invoiceList.length > 1) {
          invoiceList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            invoiceList
          });
        }
      } else if (invoiceList[index].list.length > 1) {
        invoiceList[index].list.splice(item, 1);
        this.setData({
          invoiceList
        });
      }
    } else {
      if (invoiceList.length === 1) {
        ShowToast("您至少需要开具一张发票");
        return;
      } else if (invoiceList.length > 1) {
        invoiceList.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          invoiceList
        });
      }
    }
    this.checkeList();
  },
  // 添加发票信息
  addInvoice(event) {
    if (!this.data.showAdd) {
      ShowToast("不能再添加发票信息了");
      return;
    }
    let invoiceList = this.data.invoiceList;
    if (event.currentTarget.dataset.index || event.currentTarget.dataset.index === 0) {
      let index = event.currentTarget.dataset.index;
      let maxlength = invoiceList[index].list.length;
      if (invoiceList[index].list[maxlength - 1].number === 0) {
        ShowToast("请先完成已有的发票信息");
        return;
      }
      let hasPriceList = [];
      invoiceList[index].list.forEach(e => {
        hasPriceList.push(this.data.priceList[e.priceindex]);
      });
      let newPrice = 0;
      this.data.invoiceNumber.forEach(e => {
        if (e.remaining > 0 && hasPriceList.indexOf(e.price) < 0) {
          newPrice = e.price;
        }
      });
      invoiceList[index].list.push({
        priceindex: this.data.priceList.indexOf(newPrice),
        number: 0
      });
    } else {
      let length1 = invoiceList.length;
      let length2 = invoiceList[length1 - 1].list.length;
      if (invoiceList[length1 - 1].list[length2 - 1].number === 0) {
        ShowToast("请先完成已有的发票信息");
        return;
      }
      let newPrice = 0;
      this.data.invoiceNumber.forEach(e => {
        if (e.remaining > 0) {
          newPrice = e.price;
        }
      });
      invoiceList.push({
        countPrice: 0,
        list: [{
          priceindex: this.data.priceList.indexOf(newPrice),
          number: 0
        }]
      });
    }
    this.setData({
      invoiceList
    });
  },
  // 重置剩余最大开票数和总价
  checkeList() {
    let alreadHas = {}
    let showAdd = false;
    let priceList = this.data.priceList;
    let invoiceList = this.data.invoiceList;
    this.data.invoiceNumber.forEach(e => {
      alreadHas[`price${e.price}`] = 0;
    });
    invoiceList.map(item => {
      let count = 0;
      item.list.forEach(e => {
        alreadHas[`price${priceList[e.priceindex]}`] += e.number;
        // count += priceList[e.priceindex] * e.number;
        count = calcNum.accAdd(count, calcNum.accMul(priceList[e.priceindex], e.number))
      });
      item.countPrice = count;
      return item;
    });
    this.data.invoiceNumber.map(e => {
      e.remaining = e.maxnumber - alreadHas[`price${e.price}`];
      if (e.remaining > 0) {
        showAdd = true;
      }
      return e;
    });
    let count = 0;
    invoiceList.forEach(e => {
      // count += e.countPrice;
      count = calcNum.accAdd(count, e.countPrice)
    });
    let paramsObj = this.data.paramsObj;
    paramsObj.amount = count;
    this.setData({
      paramsObj,
      invoiceList,
      showAdd
    });
  },
  // 输入开票人数
  inputItemNumber(e) {
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    let invoiceList = this.data.invoiceList;
    let priceList = this.data.priceList;
    let price = priceList[invoiceList[index].list[item].priceindex];
    let number = parseInt(e.detail.value);
    // 防止paresInt出NaN
    number = number === number ? number : 0;
    // 限制不可超出最大剩余可开票数目
    for (let i = 0; i < this.data.invoiceNumber.length; i++) {
      if (this.data.invoiceNumber[i].price === price) {
        let maxnumber = this.data.invoiceNumber[i].remaining + invoiceList[index].list[item].number;
        number = number > maxnumber ? maxnumber : number;
        break;
      }
    }
    if (number === number && number < 0) {
      number = 0;
      ShowToast("数目应大于0");
      return;
    }
    invoiceList[index].list[item].number = number;
    this.setData({
      invoiceList
    });
    this.checkeList();
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