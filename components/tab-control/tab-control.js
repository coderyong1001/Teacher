// components/tab-control/tab-control.js
Component({
  /**
   * 组件的属性列表
   * 组件注册事件change返回被选定状态
   */
  properties: {
    tabList: {
      type: Array,
      value: [],
      // observer(newVal, oldVal) {
      //   this.properties.tabList.map(item => {
      //     this.setData({
      //       controlIdObj: {
      //         ...this.data.controlIdObj,
      //         [item.tabType]: item.controlList[0].id,
      //       },
      //     }, () => {
      //       console.log('init:', this.data.controlIdObj)
      //     })
      //   })
      // }
    },
    // 确认选择
    confirmChoice: {
      type: Function,
      value: () => {
        console.log('请传confirmChoice')
      }
    },
    // 展开选择列表时的设置激活样式
    setActive: {
      type: Function,
      value: () => {
        console.log('请传setActive')
      }
    },
    // 取消选择
    cancelChoice: {
      type: Function,
      value: () => {
        console.log('请传cancelChoice')
      }
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    controlList: [],
    showList: false,
    tabId: null,
    tabNameObj: {},
    controlIdObj: {}

  },
  /**
   * 组件的方法列表
   */
  methods: {
    choiceTab: function (e) {
      const {
        tabId,
        showList
      } = this.data

      if (e.currentTarget.dataset.id === tabId && showList) {
        this.setData({
          showList: false
        });
      } else {
        let curControlList = []
        let curTabId = ''
        let tabType = e.currentTarget.dataset.tabtype
        this.properties.tabList.forEach(item => {
          if (item.id === e.currentTarget.dataset.id) {
            curControlList = item.controlList
            curTabId = item.id
          }
        })
        this.setData({
          showList: true,
          controlList: curControlList,
          tabId: curTabId,
        });
        this.triggerEvent('setActive')
      }

    },
    choiceControl: function (e) {
      let tabType = e.currentTarget.dataset.tabtype
      this.setData({
        showList: false,
        tabNameObj: {
          ...this.data.tabNameObj,
          [tabType]: e.currentTarget.dataset.name,
        },
        controlIdObj: {
          ...this.data.controlIdObj,
          [tabType]: e.currentTarget.dataset.id,
        },
      })
      this.triggerEvent('confirmChoice', {
        tabType: e.currentTarget.dataset.tabtype,
        id: e.currentTarget.dataset.id
      })   
    },
    hideModal() {
      this.setData({
        showList: false,
      })
      this.triggerEvent('cancelChoice')
    }
  }
})