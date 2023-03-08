// pages/my/myContact/addContact/addContact.js

import {
  addConcat,
  getMyConcat,
  getUserInfo
} from '../../../../service/my-service';
import {ShowToast} from '../../../../utils/show_toast_loading_modal'
import pattern from '../../../../utils/pattern'
const app = getApp();
const regeneratorRuntime = app.regeneratorRuntime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexItems: [
      { name: 'male', value: '男', checked: 'true' },
      { name: 'female', value: '女' }
    ],
    // stateKeys: ['area', 'address', 'company', 'department', 'username', 'ID_number', 'sexRadio', 'phone', 'duty', 'professional', 'workingYear'],
    stateKeys: ['company', 'username', 'sexRadio', 'phone', 'duty'],
    defaultValue: {
      sexRadio: 'male'
    },
    id: '',
  },

  async commit () {
    let formInput = this.selectComponent('#form-input')
    // if( this.data.inputData === null ) return
    // let verifyPhone = /^1[3-9][0-9]{9}$/    
    // let inputData = this.data.inputData;
    let { area, address, company, username, ID_type, ID_number, sexRadio, phone, duty, professional, workingYear, department } = formInput.data.inputData
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
    if (!sexRadio) {
      // ShowToast('请选择性别')
      // return
      sexRadio = "male"
    }
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
      gender: sexRadio === "male" ? 0 : 1,
      // birth: birthday,
      // province: area[0],
      // city: area[1],
      // district: area[2],
      job_title: duty,
      // profession: professional,
      // work_exp: workingYear,
      company,
      // address,
      // ID_type: parseInt(ID_type) + 1,
      // ID_type: 1,
      // ID_number: ID_number,
      // department
    };
    if (!params.work_exp) {
      delete params.work_exp
    }
    if (!params.profession) {
      delete params.profession
    }
    if (!params.address) {
      delete params.address
    }
    if (!params.department) {
      delete params.department
    }
    console.log(params,'---------');
    let res = await addConcat(params, this.data.id);
    if (res.data.code === 200) {
      let pages = getCurrentPages()
      pages[pages.length - 2].refresh()
      wx.navigateBack({
        delta: 1,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options)
    if (options.id) {
      let pro = getMyConcat(options.id);
      pro.then(res => {
        let data = res.data.data;
        let defaultValue = {
          username: data.name,
          phone: data.tel,
          sexRadio: data.gender === 0 ? 'male' : 'female',
          // birthday: data.birth,
          area: [data.province, data.city, data.district],
          company: data.company,
          duty: data.job_title,
          professional: data.profession,
          workingYear: data.work_exp,
          address: data.address,
          ID_type: (parseInt(data.ID_type) - 1).toString(),
          ID_number: data.ID_number,
          department: data.department
        };
        this.setData({
          defaultValue,
          id: data.id
        });
      });
    }  else {
      let myInfo = getUserInfo()
      myInfo.then(res => {
        console.log('res:', res)
        const { province, city, district, company, address } = res.data.data
        let defaultValue = {
          area: [province, city, district],
          address: address,
          company,
        }
        this.setData({
          defaultValue
        })
      })
    }
  },
})




