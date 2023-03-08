// pages/my/personalCenter/personalCenter.js
import {
  getUserInfo, 
  putUserInfo,
  upHead 
} from '../../../service/my-service.js';
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellItem: [],
    typeObj: {
      1: '身份证',
      2: '护照',
      3: '其他',
    }
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    this.getInfo()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let pro = this.getInfo()
    pro.then((res)=>{
      wx.stopPullDownRefresh()
    })
  },

  async refreshPersonalCenter () {
    let userInfo = await this.getInfo(true)
    let pages = getCurrentPages()
    for (let i = pages.length - 1; i > 0; i--) {
      //遍历页面栈来刷新个人中心顶部信息
      if (pages[i].route === 'pages/my/my') {
        pages[i].refresh(userInfo)
        break
      }
    }
  },

  async setHead (e) {
    let upres = await upHead(e.detail.file,'file')
    let data = upres.data
    await putUserInfo({
      pic: data.data.file_url
    })
    let userInfo = await this.getInfo(true)
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.refresh(userInfo)
  },

  async setRegion (e) {
    await putUserInfo({
      province: e.detail.value[0],
      city: e.detail.value[1],
      district: e.detail.value[2]
    })
    let userInfo = await this.getInfo(true)
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.refresh(userInfo)
  },

  async setWorkExp (e) {
    console.log(e)
    await putUserInfo({
      work_exp: e.detail.value
    })
    await this.getInfo()
  },

  async setBirth (e) {
    console.log(e)
    await putUserInfo({
      birth: e.detail.value
    })
    await this.getInfo()
  },

  async getInfo (UserInfo) {
    let res = await getUserInfo();
    let data = res.data.data
    let infoObj = wx.getStorageSync('userInfo')
    this.setData({
      //设置数据
      cellItem: [
        {
          id: 1,
          itemName: '头像',
          value: data.pic || infoObj.pic,
          link: '/',
          cellType: 'setHead'
        },
        {
          id: 2,
          itemName: '昵称',
          value: data.nickname || infoObj.name,
          cellType: 'common',
          link: './nickname/nickname?type=nickname&value=' + (data.nickname || infoObj.name),        
        },
        {
          id: 3,
          itemName: '姓名',
          value: data.name,
          cellType: 'common',
          link: `./nickname/nickname?type=username&value=${ data.name }`
        },
        {
          id: 4,
          itemName: '手机号',
          value: data.tel,
          cellType: 'common'
        },
        // {
        //   id: 5,
        //   itemName: '证件类型',
        //   value: data.ID_type ? this.data.typeObj[data.ID_type] : '',
        //   cellType: 'common'
        // },
        // {
        //   id: 6,
        //   itemName: '身份证号',
        //   value: data.ID_number ? data.ID_number : '',
        //   cellType: 'common'
        // },
        {
          id: 7,
          itemName: '性别',
          value: data.gender == 0 ? '男' : '女',
          cellType: 'common',
          link: `./nickname/nickname?type=sexRadio&value=${ data.gender == 0 ? 'male' : 'female' }`
        },
        // {
        //   id: 8,
        //   itemName: '出生年份',
        //   value: data.birth || "",
        //   link: '/',
        //   cellType: 'setBirthday'
        // },
        {
          id: 8,
          itemName: '单位地址',
          value: data.province === data.city
            ? ( data.city  + data.district + (data.address || "") )
            : ( data.province  + data.city  + data.district + (data.address ? data.address : "") ),
          link: `./nickname/nickname?type=area&value=${data.province},${data.city},${data.district}&address=${data.address || ""}`,
          cellType: 'common'
        },
        {
          id: 9,
          itemName: '单位',
          value: data.company || "",
          link: `./nickname/nickname?type=company&value=${data.company || ""}`,
          cellType: 'common'
        },
        {
          id: 10,
          itemName: '部门',
          value: data.department || "",
          link: `./nickname/nickname?type=department&value=${data.department || ""}`,
          cellType: 'common'
        },
        {
          id: 11,
          itemName: '职务',
          value: data.job_title || "",
          link: `./nickname/nickname?type=duty&value=${ data.job_title || ""}`,
          cellType: 'common'
        },
        {
          id: 12,
          itemName: '最高学历毕业专业',
          value: data.profession || "",
          link: `./nickname/nickname?type=profession&value=${ data.profession || "" }`,
          cellType: 'common'
        },
        {
          id: 13,
          itemName: '参加工作年份',
          value: data.work_exp || "",
          link: '/',
          cellType: 'setStartTime',
          noBt: true
        }
      ]
    })
    //新的个人信息
    let obj = {
      name: data.nickname || infoObj.name,
      pic: data.pic || infoObj.pic,
      city:  data.province === data.city ? ( data.city + data.district ) : ( data.province + data.city + data.district )
    }
    if (obj.name !== infoObj.name || obj.pic!==infoObj.pic) {
      //假设在不同设备更改头像、用户名信息造成信息详情和本设备storge存储的不一致，则刷新
      let pages = getCurrentPages()
      for (let i = pages.length - 1; i > 0; i--) {
        if (pages[i].route === 'pages/my/my') {
          pages[i].refresh(obj)
          break
        }
      }
    }
    if (!!UserInfo) {
      return obj
    }
  },
})