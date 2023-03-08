const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
import {
  cancelOrder,
  deleteOrder,
  refund,
  voucher,
  cancelRefund
} from '../../service/my-service'
import {
  payOrder
} from '../../service/index-service'
import baseUrl from '../../service/baseUrl'
import {
  ShowToast,
  ShowLoading,
  HideLoading
} from '../../utils/show_toast_loading_modal'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    categoryObj: {
      1: '培训',
      2: '会议',
      3: '活动',
    },
    orderStatusObj: {
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
    uploadfileUrl: [],
    refund: false, // 是否显示退款弹窗
    applicants: [], // 退款弹窗人员信息列表
    refundOrderId: '', // 退款订单id
    refundStatus: {
      0: '',
      1: '(待支付)',
      2: '(待审核)',
      3: '(审核未通过)',
      4: '(订单取消)',
      5: '(退款审核中)',
      6: '(退款已拒绝)',
      7: '(已部分退款)',
      8: '(已全部退款)',
      9: '(订单已删除)'
    },
    refundPrice: '', // 退款订单单价
    refundNumber: 0, // 退款人数
    refundCount: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 去支付
    async goPay(e) {
      let order_id = e.currentTarget.dataset.orderid
      let payParams = {
        order_id,
        openid: wx.getStorageSync('openId'),
        pay_type: 'UnionPay_Third_Mini'
      }
      let payOrderRes = await payOrder(payParams)
      if (payOrderRes.data.code === 1111) {
        ShowToast('订单已支付')
        setTimeout(() => {
          this.triggerEvent('refresh')
        }, 1500)
        return
      }
      const {
        timeStamp,
        nonceStr,
        paySign,
        signType
      } = payOrderRes.data.data
      wx.requestPayment({
        timeStamp,
        nonceStr,
        package: payOrderRes.data.data.package,
        signType,
        paySign,
        success: (res) => {
          this.triggerEvent('refresh')
        },
        fail(failres) {
          if (failres.errMsg.indexOf('cancel') !== -1) {
            ShowToast('已取消支付')
          } else {
            ShowToast(failres.errMsg)
          }
        }
      })
    },
    // 查看详情
    showDetail (e) {
      wx.navigateTo({
        url: `/pages/my/order/orderDetail/orderDetail?id=${e.currentTarget.dataset.id}`
      })
    },
    // 取消订单
    clickCancelOrder(e) {
      let order_id = e.currentTarget.dataset.orderid
      wx.showModal({
        title: '提示',
        content: '是否确定要取消订单？',
        confirmColor: '#018389',
        success: (res) => {
          if (res.confirm) {
            this.confirmCancel(order_id)
          }
        }
      })
    },
    // 确认取消订单
    async confirmCancel(id) {
      let params = {
        order_id: id
      }
      await cancelOrder(params)
      this.triggerEvent('refresh')
      ShowToast('成功取消订单')
    },
    // 申请退款弹窗
    applyRefund(e) {
      // let order_id = e.currentTarget.dataset.orderid
      // wx.showModal({
      //   title: '提示',
      //   content: '是否确定要申请退款？',
      //   confirmColor: '#018389',
      //   success: (res) => {
      //     if (res.confirm) {
      //       this.confirmRefund(order_id)
      //     }
      //   }
      // })
      let applicants = e.target.dataset.applicants
      let checkedStatusList = [6, 7, 8, 9]
      applicants.map(item => {
        item.checked = checkedStatusList.indexOf(item.refund_status) === -1 ? false : true
        return item
      })
      let refundOrderId = e.target.dataset.orderid
      let refundPrice = e.target.dataset.price
      this.setData({
        refund: true,
        applicants,
        refundOrderId,
        refundPrice
      })
      console.log(this.data)
    },
    // 关闭退款弹窗
    closeRefund(e) {
      if (e.target.id === 'box' || e.target.id === 'close' || e.target.id === 'cancel') {
        this.setData({
          refund: false,
          refundNumber: 0,
          applicants: []
        })
      }
      if (e.target.id === 'confirm') this.confirmRefund()
    },
    // 选择退款人员
    chooseApplicant(e) {
      let index = e.currentTarget.dataset.index
      let applicants = this.data.applicants
      if (applicants[index].refund_status === 0) {
        applicants[index].checked = !applicants[index].checked
        let refundNumber = 0
        applicants.forEach(item => {
          if (item.refund_status === 0 && item.checked) refundNumber++
        })
        this.setData({
          applicants,
          refundNumber,
          refundCount: (refundNumber * this.data.refundPrice).toFixed(2)
        })
      }
    },
    // 取消退款
    async cancelRefund(e) {
      let params = {
        order_id: e.target.dataset.orderid
      }
      await cancelRefund(params)
      ShowToast('取消退款成功')
      this.triggerEvent('refresh')
    },
    // 确认申请退款
    async confirmRefund() {
      let applicants = []
      this.data.applicants.forEach(item => {
        if (item.checked && item.refund_status === 0) applicants.push(item.id)
      })
      let params = {
        order_id: this.data.refundOrderId,
        applicants
      }
      await refund(params)
      this.triggerEvent('refresh')
      ShowToast('已申请退款，请等待审核', 'success')
      this.setData({
        refund: false
      })
    },
    // 删除订单
    delOrder(e) {
      let order_id = e.currentTarget.dataset.orderid
      wx.showModal({
        title: '提示',
        content: '是否确定要删除订单？',
        confirmColor: '#018389',
        success: (res) => {
          if (res.confirm) {
            this.confirmDel(order_id)
          }
        }
      })
    },
    // 确认删除订单
    async confirmDel(id) {
      let params = {
        order_id: id
      }
      await deleteOrder(params)
      this.triggerEvent('refresh')
      ShowToast('删除成功', 'success')
    },
    // 选择图片
    chooseFile(e) {
      let order_id = e.currentTarget.dataset.orderid
      let _this = this
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          let tempFilePath = res && res.tempFilePaths
          let successUp = 0 //成功
          let failUp = 0 //失败
          let length = tempFilePath.length //总数
          let count = 0 //第几张
          _this.uploadOneByOne(tempFilePath, successUp, failUp, count, length, order_id)
        },
        fail(failRes) {
          let showText = (failRes.errMsg.indexOf('cancel') !== -1) ? '已取消上传' : failRes.errMsg
          ShowToast(showText)
        }
      })
    },
    // 上传支付凭证
    uploadOneByOne(tempFilePath, successUp, failUp, count, length, orderId) {
      var _this = this
      ShowLoading(`正在上传第${count + 1}张`)
      wx.uploadFile({
        url: baseUrl + '/file_upload/',
        filePath: tempFilePath[count],
        name: 'file',
        header: {
          'Authorization': 'Bear ' + wx.getStorageSync('token')
        },
        success(uploadres) {
          successUp++
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
          failUp++
          ShowToast(failres.errMsg)
        },
        complete() {
          count++ //下一张
          HideLoading()
          if (count === length) {
            // //上传完毕，作一下提示
            _this.voucherFile(orderId, successUp)
          } else {
            //递归调用，上传下一张
            _this.uploadOneByOne(tempFilePath, successUp, failUp, count, length, orderId);
          }
        }
      })
    },
    // 上传支付凭证到接口
    async voucherFile(order_id, successUp) {
      const { uploadfileUrl } = this.data
      let params = {
        order_id,
        voucher: uploadfileUrl
      }
      await voucher(params)
      this.triggerEvent('refresh',{type: 1, number: successUp})
      this.setData({
        uploadfileUrl: []
      })
    }
  }
})