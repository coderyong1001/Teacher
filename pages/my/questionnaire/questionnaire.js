// pages/my/questionnaire/questionnaire.js
import {
  commitQuestionare,
  getquestion
} from '../../../service/my-service.js';
import {
  ShowToast
} from '../../../utils/show_toast_loading_modal'
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: [],
    questions: [
      '活动的体系设计较为完整，有一定吸引力．',
      '活动能够了解本领域的发展状况或趋势．',
      '活动体现了较先进的理念或实践模式，能开阔视野或启发思维．',
      '活动的相关内容能够运用到自己的教育教学或管理实践中．',
      '活动的专家讲授较为精彩，能够学到相关的理念或经验．',
      '活动的组织形式能够较好地服务于活动的内容．',
      '活动的各个流程运作流畅，能够较为高效地完成研修任务．',
      '活动期间工作人员服务态度好，能够认真对待学员需求．',
      '活动结束后有学员学习效果评价，并根据评价结果发放结业证书．',
    ],
    textQiestions: [
      '您获取此次活动的信息渠道是?',
      '您以后希望通过什么渠道获得活动信息?',
      '您对此次活动的感想以及未来活动的意见和建议?',
    ],
    // choiceAnswer: [null, null, null, null, null, null, null, null, null],
    actualChannel: '',
    hopeChannel: '',
    advice: '',
    activiyId: '',
    scoreObj: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.question()
  },
  chooseScore(e) {
    const {
      id,
      score
    } = e.currentTarget.dataset
    this.setData({
      scoreObj: {
        ...this.data.scoreObj,
        [id]: score
      }
    })

  },
  changeRadio: function (e) {
    if (e.currentTarget.dataset.id === 'actId') {
      this.setData({
        activiyId: e.detail.value,
      });
    }
  },

  inputText: function (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    switch (index) {
      case 0:
        this.setData({
          actualChannel: e.detail.value
        });
        break;
      case 1:
        this.setData({
          hopeChannel: e.detail.value
        });
        break;
      case 2:
        this.setData({
          advice: e.detail.value
        });
        break;
    }
  },

  async submit() {
    const {
      activiyId,
      actualChannel,
      hopeChannel,
      advice,
      scoreObj
    } = this.data
    if (!activiyId) {
      ShowToast('请问完成问题1')
      return
    }
    let scoreArr = Object.values(scoreObj)
    let scoreKey = Object.keys(scoreObj)
    let arr = ["2", "3", "4", "5", "6", "7", "8", "9", "10"]
    let unChooseArr = arr.filter(item => {
      return scoreKey.indexOf(item) == -1
    })
    if (unChooseArr.length) {
      let showStr = ''
      unChooseArr.forEach(item => {
        showStr += `问题${item}、`
      })
      ShowToast(`请完成${showStr.substr(0, showStr.length - 1)}`)
      return
    }
    if (!actualChannel.trim()) {
      ShowToast('请问完成问题11')
      return
    }
    if (!hopeChannel.trim()) {
      ShowToast('请问完成问题12')
      return
    }
    if (!advice.trim()) {
      ShowToast('请问完成问题13')
      return
    }
    let params = {
      course_id: parseInt(activiyId),
      choices: scoreArr,
      actual_channel: actualChannel,
      hope_channel: hopeChannel,
      advice: advice,
    };
    await commitQuestionare(params);
    ShowToast('问卷已提交')
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 500)
  },

  async question() {
    let res = await getquestion()
    if (res.data.data.length === 0) {
      wx.showModal({
        title: '提示',
        content: '您暂未参加任何活动，没有可评价的活动调查问卷~',
        confirmColor: "#018389",
        confirmText: '返回',
        showCancel: false,
        success() {
          wx.navigateBack({
            delta: 1
          });
        },
      });
    }
    this.setData({
      course: res.data.data
    })
  },
})