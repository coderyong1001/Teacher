// pages/my/opinion/opinion.js
import {feedback} from '../../../service/my-service';
import {ShowToast} from '../../../utils/show_toast_loading_modal'
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 0,
    max: 500,
    currentWordNumber: '',
    value: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('currentWordNumber'|0)
  },
  inputChange (e) {
    let value = e.detail.value
    let len = parseInt(value.length)
    if (len > this.data.max) {
      return
    }
    this.setData({
      value,
      currentWordNumber: len
    })
  },

  async commit () {
    if (!this.data.value.trim()) {
      ShowToast('尚未填写任何反馈')
      return
    }
    await feedback({
      content: this.data.value,
    });
    ShowToast('反馈已提交')
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },
})