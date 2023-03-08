// components/invoice-list/invoice-list.js
import calcNum from '../../utils/calc_num'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    invoiceDataList: {
      type: Array,
      value: []
    }
  },
  options: {
    styleIsolation: "apply-shared" // 让组件的样式受页面样式影响
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectedList: [], // 保存选择订单的状态
    amount: 0,
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
    single_orders: [] // 保存选中商品的id
  },
  attached() {},
  /**
   * 组件的方法列表
   */
  methods: {
    // 单选
    singleChoose(e) {
      console.log(e)
      var index = e.currentTarget.dataset.index // 获取选中的radio索引
      let id = e.currentTarget.dataset.id
      let money = parseFloat(e.currentTarget.dataset.money) // 获取选中的radio索引的金额
      let selectedList = this.data.selectedList
      let amount = this.data.amount
      let single_orders = this.data.single_orders
      selectedList[index] = !selectedList[index]
      if (selectedList[index]) {
        single_orders.push(id)
      } else {
        single_orders.splice(single_orders.indexOf(id), 1)
      }
      // 保留选中的
      let newSelected = selectedList.filter(item => {
        return item
      })
      // 计算金额
      console.log('amount:', amount)
      // let newAmount = selectedList[index] ? amount + money : amount - money
      let newAmount = selectedList[index] ? calcNum.accAdd(amount, money) : calcNum.accSub(amount, money)
      console.log('newAmount:', newAmount)
      this.setData({
        selectedList,
        amount: newAmount,
        single_orders
      }, () => {
        this.triggerEvent('setOrderData', {
          len: newSelected.length,
          amount: this.data.amount,
          single_orders: this.data.single_orders
        })
        console.log('single_orders:', this.data.single_orders)
      })
    },
    // 本页全选
    curPageSelectAll(isSelect) {
      let selectedList = this.data.selectedList
      let invoiceDataList = this.properties.invoiceDataList
      let single_orders = []
      console.log('selectedList:', selectedList)
      console.log('invoiceDataList:', invoiceDataList)

      for (let i = 0; i < invoiceDataList.length; i++) {
        selectedList[i] = isSelect ? true : false
      }
      console.log('selectedList:', selectedList)
      let allmoney = 0
      if (isSelect) {
        invoiceDataList.map(item => {
          // allmoney += item.real_amount
          allmoney = calcNum.accAdd(allmoney, item.real_amount)
          single_orders.push(item.id)
        })
      }
      console.log('allmoney:', allmoney)
      this.setData({
        selectedList: isSelect ? selectedList : [],
        amount: isSelect ? allmoney : 0,
        single_orders: isSelect ? single_orders : []
      }, () => {
        this.triggerEvent('setOrderData', {
          len: isSelect ? invoiceDataList.length : 0,
          amount: isSelect ? allmoney : 0,
          single_orders: this.data.single_orders
        })
      })
    },
    // 重置数据
    resetData() {
      this.setData({
        selectedList: [],
        amount: 0,
        single_orders: []
      }, () => {
        this.triggerEvent('setOrderData', {
          len: 0,
          amount: 0,
          single_orders: []
        })
      })
    },
  }
})