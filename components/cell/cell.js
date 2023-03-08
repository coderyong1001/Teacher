// components/cell/cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cellItem: {
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
    date: '',
    region: '',
    workingYear: '',
    rangeYear: [],
    year: parseInt(new Date().getFullYear())
  },

  lifetimes: {
    attached() {
      let rangeYear = [];
      let year = this.data.year;
      for (let i = 0; i <= 100; i++) {
        rangeYear.push(year - i);
      }
      this.setData({
        rangeYear
      })
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    showMaxImg(e) {
      wx.previewImage({
        current: e.currentTarget.dataset.src,
        urls: e.currentTarget.dataset.list
      })
    },
    clickLink(e) {
      let link = e.currentTarget.dataset.link
      let celltype = e.currentTarget.dataset.celltype
      switch (celltype) {
        case 'common':
          this.navigateToUrl(link)
          break
        case 'setHead':
          this.setHead()
          break
      }

    },
    // 跳转地址
    navigateToUrl(link) {
      if (!link) {
        return
      }
      wx.navigateTo({
        url: link
      })
    },
    // 设置头像
    setHead() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          let tempFilePath = res && res.tempFilePaths[0]
          this.triggerEvent('setHead', {file: tempFilePath})
        }
      })
    },
    // 设置生日和执教年份
    bindDateChange (e) {
      switch (e.currentTarget.dataset.type) {
        case 'setStartTime':
          this.setData({
            workingYear: e.detail.value,
          });
          this.triggerEvent('setWorkExp', {value: this.data.rangeYear[e.detail.value]})
          break;
        case 'setBirthday':
          this.setData({
            date: e.detail.value,
          });
          this.triggerEvent('setBirth', {value: this.data.rangeYear[e.detail.value]})
          break;
      }
      
    },
    // 设置地区
    bindRegionChange (e) {
      this.setData({
        region: e.detail.value
      })
      this.triggerEvent('setRegion', {value: e.detail.value})
    },
  }
})