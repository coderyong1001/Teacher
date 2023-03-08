// components/universal-button/universal-button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnText: {
      type: String,
      value: '我是按钮组件'
    },
    noMt: {
      type: Boolean,
      value: false
    }
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
    clickBtn () {
      this.triggerEvent('handleClick')
    }
  }
})
