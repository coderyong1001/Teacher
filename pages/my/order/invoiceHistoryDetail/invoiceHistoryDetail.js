// pages/my/order/invoiceHistoryDetail/invoiceHistoryDetail.js
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  getInvoiceDetail
} from '../../../../service/my-service'
// import { getMonthDayHM } from '../../../../utils/format_date'
// import { ShowToast } from '../../../../utils/show_toast_loading_modal';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellItem: [],
    invoice_id: '',
    statusObj: { // 开票状态
      0: '开票中',
      1: '已开票',
      2: '已取消'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInvoiceDetailData(options.invoice_id)
    this.setData({
      invoice_id: options.invoice_id
    })
  },
  refresh() {
    this.getInvoiceDetailData(this.data.invoice_id)
  },
  // 获取开票详情
  async getInvoiceDetailData(id) {
    let getInvoiceDetailRes = await getInvoiceDetail(id)
    const {
      addr_tel, // 地址和电话
      amount, // 总金额
      bank_account, // 开户行和账户
      comment, //备注说明
      create_time, // 创建时间
      email, // 邮箱
      invoice_content, // 开票内容
      paper_elec, // 发票种类 纸质、电子
      price_info, // 开票信息
      tax_number, // 税号
      title, // 发票抬头
      title_type, // 发票抬头类型 公司、个人
      type, // 普通、专票
      category, // 开票类别
      company, //开票方
      pictures, // 图片
      update_status, //是否可更新
      status, // 发票状态
      course_name, // 课程名称
    } = getInvoiceDetailRes.data.data
    const invoiceId = getInvoiceDetailRes.data.data.id
    let invoice_content_obj = {
      1: '培训费',
      2: '会议费',
      3: '活动费',
      4: '课程费',
    }
    let categoryObj = {
      1: '培训',
      2: '会议',
      3: '活动',
    }
    let price_info_list = []
    price_info.forEach((item, index) => {
      price_info_list.push({
        id: 10 + index*2,
        itemName: '开票单价'+(index+1),
        value: item.price,
        cellType: 'common'
      })
      price_info_list.push({
        id: 11 + index*2,
        itemName: '开票数量'+(index+1),
        value: item.num,
        cellType: 'common'
      })
    });
    let cellItem = [
      {
        id: 0,
        itemName: '发票材质',
        value: paper_elec === 1 ? '纸质发票' : '电子发票',
        cellType: 'common'        
      },
      {
        id: 1,
        itemName: "抬头类型",
        value: title_type === 1 ? '个人' : '单位',
        cellType: 'common'
      },
      {
        id: 2,
        itemName: '发票类型',
        value: type === 1 ? '专用发票' : '普通发票',
        cellType: 'common'
      },
      {
        id: 3,
        itemName: '发票抬头',
        value: title,
        cellType: 'common'
      },
      {
        id: 4,
        itemName: '税号',
        value: tax_number ? tax_number : '',
        cellType: 'common'
      },
      {
        id: 5,
        itemName: '地址和手机号',
        value: addr_tel ? addr_tel : '',
        cellType: 'common'
      },
      {
        id: 6,
        itemName: '开户行和账户',
        value: bank_account ? bank_account : '',
        cellType: 'common'
      },
      {
        id: 7,
        itemName: '接收邮箱',
        value: email ? email : '',
        cellType: 'common'
      },
      {
        id: 8,
        itemName: '课程名称',
        value: course_name ? course_name : '',
        cellType: 'common'
      },
      {
        id: 105,
        itemName: '活动类别',
        value: categoryObj[category],
        cellType: 'common'
      },
      ...price_info_list,
      {
        id: 101,
        itemName: '总金额',
        value: amount,
        cellType: 'common'
      },
      {
        id: 102,
        itemName: '发票内容',
        value: invoice_content_obj[invoice_content],
        cellType: 'common'
      },
      {
        id: 103,
        itemName: '开票方',
        value: company ? company : '',
        cellType: 'common'
      },
      {
        id: 104,
        itemName: '备注说明',
        value: comment ? comment : '',
        cellType: 'common'
      },
      
      {
        id: 106,
        itemName: '发票信息照片',
        value: pictures,
        cellType: 'pictures'
      },
      {
        id: 107,
        itemName: '申请时间',
        value: create_time,
        cellType: 'common'
      }
    ]
    cellItem.splice(0, 0, {
      id: 106,
      itemName: '开票状态',
      value: this.data.statusObj[status],
      cellType: 'common',
      link: update_status === 0 ? `/pages/my/order/invoiceDetail/invoiceDetail?invoiceType=3&invoice_id=${invoiceId}` : ''
    })
    let newCellItem = cellItem.filter(item => item.value)
    this.setData({
      cellItem: newCellItem
    })
  }
})