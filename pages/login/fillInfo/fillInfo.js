// pages/login/fillInfo/fillInfo.js
import {ShowToast} from '../../../utils/show_toast_loading_modal'
import { setMyInfo } from '../../../service/login-service'
import pattern from '../../../utils/pattern'
const app = getApp()
const regeneratorRuntime = app.regeneratorRuntime
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sexItems: [
      { name: 'male', value: '男', checked: 'true' },
      { name: 'female', value: '女' }
    ],
    // stateKeys: ['username', 'sexRadio', 'birthday', 'area', 'company', 'duty', 'professional', 'workingYear'],
    // stateKeys: ['area', 'address', 'company', 'department', 'username', 'ID_number', 'sexRadio','duty', 'professional', 'workingYear'],
    stateKeys: ['company', 'username', 'sexRadio', 'phone','duty'],
    defaultValue: {
      sexRadio: 'male'
    },
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  inputCallBack (inputData) {
    console.log(inputData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async handleClick() {
    let formInput = this.selectComponent('#form-input')
    let { area, address, company, department, username, ID_type, ID_number, sexRadio, phone, duty, professional, workingYear } = formInput.data.inputData
    // if (!area) {
    //   ShowToast('请选择地区')
    //   return
    // }
    if (!company) {
      ShowToast('请填写单位')
      return
    }
    if (!username) {
      ShowToast('请填写姓名')
      return
    }
    // if (!ID_type) {
    //   ShowToast('请选择证件类型')
    //   return
    // }
    // if (!ID_number) {
    //   ShowToast('请输入身份证号码')
    //   return
    // }
    // if (ID_type == '0' && ID_number) {
    //   let idCardReg = pattern.idCard.test(ID_number)
    //   if (!idCardReg) {
    //     ShowToast('请输入正确的身份证号')
    //     return
    //   }
    // }
    // if (ID_number) {
    //   let idCardReg = pattern.idCard.test(ID_number)
    //   if (!idCardReg) {
    //     ShowToast('请输入正确的身份证号')
    //     return
    //   }
    // }
    // if (!sexRadio) {
    //   ShowToast('请选择性别')
    //   return
    // }
    if (!phone) {
      ShowToast('请填写手机号')
      return
    }
    if (!pattern.mobile.test(phone)) {
      ShowToast('请填写正确的手机号码');
      return;
    }
    // if (!duty) {
    //   ShowToast('请填写职务')
    //   return
    // }
    // if (!professional) {
    //   ShowToast('请填写专业')
    //   return
    // }
    // if (!workingYear) {
    //   ShowToast('请选择参加工作年份')
    //   return
    // }
    let params = {
      name: username,
      tel: phone,
      gender: sexRadio === 'male' ? 0 : 1,
      // birth: birthday,
      // province: area[0],
      // city: area[1],
      // district: area[2],
      company,
      // department,
      job_title: duty,
      // profession: professional,
      // work_exp: workingYear ? workingYear : '',
      // nickname: '',
      // address,
      // ID_type: parseInt(ID_type) + 1,
      // ID_number: ID_number
    }
    if (!params.work_exp) {
      delete params.work_exp
    }
    if (!params.profession) {
      delete params.profession
    }
    if (!params.address) {
      delete params.address
    }
    wx.showLoading({title:'信息保存中', mask: true})
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo
        params.nickname = userInfo.nickName
        let setMyInfoRes = setMyInfo(params)
        setMyInfoRes.then((res) => {
          let redirectUrl = wx.getStorageSync('redirectUrl')
          wx.setStorageSync('isRegister', true)
          wx.hideLoading()
          if (redirectUrl) {
            wx.redirectTo({
              url: `/${redirectUrl}`
            })
            wx.removeStorageSync('redirectUrl')
          } else {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
          ShowToast('保存成功')
        }, (res) => {
          //如果出意外要清除登录状态，防止直接返回主页后因为有登录状态而进入个人中心造成错误
          wx.hideLoading()
          try {
            wx.clearStorageSync()
          } catch(e) {
          }
        })
      }
    })
  }
})