// components/paging/paging.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNoData: {
      type: Boolean,
      value: false
    }
  },
  options: {
    styleIsolation: "apply-shared" // 让组件的样式受页面样式影响
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // bindscrolltolower() {
    //   console.log(111)
    // }
  }
})
