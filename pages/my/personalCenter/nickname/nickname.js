// pages/my/personalCenter/nickname/nickname.js
import {putUserInfo} from '../../../../service/my-service.js'
import {ShowToast} from '../../../../utils/show_toast_loading_modal'
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateKeys: ['nickname','duty','professional', 'company', 'department', 'username', 'sexRadio','area','address'],
    typename: '',
    inputData: '',
    defaulvalue: {},
    type: '',
  },

  async commit() {
    let formInput = this.selectComponent('#formInput')
    let params = {};
    // console.log(formInput.data.inputData)
    switch(this.data.type) {
      case 'nickname':
        params = {
          nickname: formInput.data.inputData.nickname,
        };
        break
      case 'duty':
        params = {
          job_title: formInput.data.inputData.duty,
        };
        if (!params.job_title) {
          ShowToast('请填写职务')
          return 
        }
        break
      case 'profession':
        params = {
          profession: formInput.data.inputData.professional,
        };
        break
      case 'company':
        params = {
          company: formInput.data.inputData.company,
        };
        break
      case 'department':
        params = {
          department: formInput.data.inputData.department,
        };
        break
      case 'username':
        params = {
          name: formInput.data.inputData.username,
        };
        if (!params.name) {
          ShowToast('请填写姓名')
          return
        }
        break
      case 'sexRadio':
        params = {
          gender: formInput.data.inputData.sexRadio === 'male' ? 0 : 1,
        };
        if (params.gender !== 0 && params.gender !== 1) {
          ShowToast('请填选择性别')
          return
        }
        break
      case 'area':
        params = {
          province: formInput.data.inputData.area[0],
          city: formInput.data.inputData.area[1],
          district: formInput.data.inputData.area[2],
          address:  formInput.data.inputData.address
        };
        break;
      default:
        break
    }
    // console.log(params);
    await putUserInfo(params);
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.refreshPersonalCenter()
    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.value = options.value || "";
    switch(options.type){
      case 'nickname':
        this.setData({
          typename: '昵称',
          stateKeys: ['nickname'],
          defaulvalue: {
            nickname: options.value
          },
          type: options.type
        });
        break;
      case 'duty':
        this.setData({
          typename: '职务',
          stateKeys: ['duty'],
          defaulvalue: {
            duty: options.value
          },
          type: options.type
        });
        break;
      case 'profession':
        this.setData({
          typename: '最高学历毕业专业',
          stateKeys: ['professional'],
          defaulvalue: {
            professional: options.value
          },
          type: options.type
        });
        break;
      case 'company':
        this.setData({
          typename: '单位',
          stateKeys: ['company'],
          defaulvalue: {
            company: options.value
          },
          type: options.type
        });
        break;
      case 'department':
        this.setData({
          typename: '部门',
          stateKeys: ['department'],
          defaulvalue: {
            department: options.value
          },
          type: options.type
        });
        break;
      case 'username':
        this.setData({
          typename: '姓名',
          stateKeys: ['username'],
          defaulvalue: {
            username: options.value
          },
          type: options.type
        });
        break;
      case 'sexRadio':
        this.setData({
          typename: '性别',
          stateKeys: ['sexRadio'],
          defaulvalue: {
            sexRadio: options.value
          },
          type: options.type
        });
        break;
      case 'area':
        this.setData({
          typename: '单位地址',
          stateKeys: ['area','address'],
          defaulvalue: {
            area: options.value.indexOf('null')===-1? options.value.split(','): '',
            address: options.address || ""
          },
          type: options.type
        });
      default :
        break;
    }
  },
})