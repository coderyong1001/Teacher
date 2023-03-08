// components/my-radio/my-radio
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:String,
      value:'false'
    },
    size:{
      type:String,
      value:'36rpx'
    },
    color:{
      type:String,
      value:'green'
    },
    checked:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // choice: false
  },

  externalClasses: ['radio-class'],

  relations: {
    './my-radio-group': {
      type: 'parent', // 关联的目标节点应为父节点
      linked: function(target) {
        // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
      },
      linkChanged: function(target) {
        // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
      },
      unlinked: function(target) {
        // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
      }
    }
  },

  ready() {
    this.setData({
      choice: this.data.checked
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapthis:function(){
      this.setData({
        choice: !this.data.choice
      });
    }
  }
})
