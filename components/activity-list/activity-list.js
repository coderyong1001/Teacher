// components/activity-list/activity-list.js
Component({
  /**
   * 首页活动列表组件
   */
  properties: {
    activityList: {
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
    applyStatus: {
      1: '报名中',
      2: '未开始',
      3: '已结束',
    },
    activityType: {
      1: '培训',
      2: '会议',
      3: '活动',
    },
    applyStatusColor: {
      1: ' success',
      2: ' warning',
      3: ' info'
    },
    defaultImg: '../../assets/images/course_bg.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickDetail (e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/index/activityDetail/activityDetail?id=${id}`,
      })
    }
  }
})
