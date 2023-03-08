const inputForm = { // 
  username: {
    title: '姓名',
    placeholder: '请输入姓名',
    name: 'username',
    formType: 'inputForm',
    isRequired: true
  },
  nickname: {
    title: '昵称',
    placeholder: '请输入昵称',
    name: 'nickname',
    formType: 'inputForm',
    isRequired: true
  },
  phone: {
    title: '手机号',
    placeholder: '请输入手机号',
    name: 'phone',
    formType: 'inputForm',
    isRequired: true
  },
  area: {
    title: '单位地址',
    placeholder: '请选择地区',
    name: 'area',
    formType: 'region',
    isRequired: true
  },
  company: {
    title: '单位',
    placeholder: '请填写单位',
    name: 'company',
    formType: 'inputForm',
    isRequired: true
  },
  duty: {
    title: '职务',
    placeholder: '请填写职务',
    name: 'duty',
    formType: 'inputForm',
    isRequired: false
  },
  professional: {
    title: '最高学历毕业专业',
    placeholder: '请填写最高学历毕业专业',
    name: 'professional',
    formType: 'inputForm',
    isRequired: false
  },
  address: {
    title: '详细地址',
    placeholder: '请填写详细地址',
    name: 'address',
    formType: 'inputForm',
    isRequired: false
  },
  ID_number: {
    title: '身份证号码',
    placeholder: '请填写身份证号码',
    // title: '证件号码',
    // placeholder: '请填写证件号码',
    name: 'ID_number',
    formType: 'inputForm',
    isRequired: true
  },
  department: {
    title: '部门',
    placeholder: '请填写部门',
    name: 'department',
    formType: 'inputForm',
    isRequired: false
  }
}
const radioForm = { // 单选表单
  sexRadio: {
    title: '性别',
    placeholder: '性别选择',
    name: 'sexRadio',
    formType: 'radioForm',
    isRequired: true,
    radioList: [
      {
        id: 1,
        value: 'male',
        valueText: '男',
        checked: false
      },
      {
        id: 2,
        value: 'female',
        valueText: '女',
        checked: false
      },
    ]
  }
}
const birthdayForm = {
  birthday: {
    title: '出生年份',
    placeholder: '请选择出生年份',
    name: 'birthday',
    formType: 'birthdayForm',
    isRequired: true
  }
}
const IDTypeForm = {
  ID_type: {
    title: '证件类型',
    placeholder: '请选择证件类型',
    name: 'ID_type',
    formType: 'IDTypeForm',
    isRequired: true
  }
}
const workingForm = {
  workingYear: {
    title: '参加工作年份',
    placeholder: '请选择参加工作年份',
    name: 'workingYear',
    formType: 'workingForm',
    isRequired: false
  }
}
/** 如果不传参返回空
 * @param {arr} ['username'] <input type='text' placeholder='请输入用户名' name='username' className='username' />
 * 在父组件中调用commonInput组件，自定义属性必须是stateKeys;
 * 例如：
 * const stateKeys = ['username', 'password']
 * <CommonInput stateKeys={stateKeys} />
 */
const getItem = (arr = [], flag = true) => {
  let allObj = (
    () => Object.assign({}, inputForm, radioForm, birthdayForm, IDTypeForm, workingForm)
  )()
  let newInputObj = {}
  arr.map(item => {
    if (allObj[item]){
      newInputObj[item] = {}
      Object.assign(newInputObj[item], allObj[item])
    }
  })
  if (!flag) {
    let keys = Object.keys(newInputObj)
    keys.forEach(item => {
      newInputObj[item].isRequired = false;
    })
  }
  return newInputObj
}

export default getItem 