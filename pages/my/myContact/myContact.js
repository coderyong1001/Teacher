// pages/my/myContact/myContact.js
import {
  getMyConcat,
  delMyContact,
  getUserInfo
} from '../../../service/my-service';
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {
      name: '',
      tel: '',
      company: '',
      address: ''
    },
    myConcatList: [],
    getParamas: {
      page_num: 1,
      page_size: 20
    },
    featchAll: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pro = getUserInfo()
    let myInfo = this.data.myInfo
    pro.then(res => {
      let data = res.data.data
      myInfo = {
        name: data.name,
        tel: data.tel,
        company: data.company || "",
        address: data.province === data.city
                    ? [data.city, data.district].join("")
                    : [data.province, data.city, data.district].join("")
      }
      this.setData({
        myInfo
      })
    })
    this.refresh()
  },

  onPullDownRefresh: function() {
    let pro = this.refresh()
    pro.then((res) => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.featchAll) {
      let getParamas = this.data.getParamas
      getParamas.page_num += 1
      this.setData({
        getParamas
      })
      this.getList()
    }
  },

  toAddContact: function (e) {
    let url = 'addContact/addContact';
    if (e.currentTarget.dataset.id) {
      url += '?id=' + e.currentTarget.dataset.id;
    }
    wx.navigateTo({
      url: url
    });
  },

  async del(e) {
    await delMyContact(e.currentTarget.dataset.id)
    let myConcatList = this.data.myConcatList.slice()
    for (let i = 0; i < myConcatList.length; i++) {
      if (e.currentTarget.dataset.id == myConcatList[i].id) {
        myConcatList.splice(i, 1)
        this.setData({
          myConcatList
        })
        break
      }
    }
  },

  async getList() {
    let res = await getMyConcat(this.data.getParamas);
    let featchAll = this.data.featchAll
    let pager = res.data.data.pager
    let myConcatList = this.data.myConcatList
    let newList = res.data.data.list
    newList.forEach(e => {
      e.combineAddress = e.province === e.city
                            ? [e.city, e.district].join("")
                            : [e.province, e.city, e.district].join("");
      myConcatList.push(e);
    });
    if (pager.page_num * pager.page_size >= pager.count) {
      featchAll = true
    }
    this.setData({
      myConcatList,
      featchAll
    });
  },

  async refresh() {
    this.data.myConcatList = []
    this.data.getParamas.page_num = 1
    this.data.featchAll = false
    await this.getList()
  },

})