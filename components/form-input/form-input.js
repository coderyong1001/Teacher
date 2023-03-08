// components/form/form.js
import getItem from '../../utils/form_create'
Component({
  /**
   * form组件的属性
   * 有5个属性：
   * @param {title} 显示标题
   * @param {radioItems} 单选的数组列表
   * @param {inputType} input--输入框 radio--单选框 input的类型， 
   * @param {placeholder} 输入框提示文字
   * @param {defaultValue} 默认值,形如{username: 'a', phone: 'b'}
   */
  properties: {
    title: {
      type: String,
      value: '默认值'
    },
    radioItems: {
      type: Array,
      value: []
    },
    inputType: {
      type: String,
      value: 'input'
    },
    placeholder: {
      type: String,
      value: '请输入'
    },
    stateKeys: {
      type: Array,
      value: ['username', 'phone']
    },
    defaultValue: {
      type: Object,
      value: {}
    },
    showRequire: {
      type: Boolean,
      value: true
    }
  },
  options: {
    styleIsolation: "apply-shared" // 让组件的样式受页面样式影响
  },
  /**
   * 组件的初始数据
   */
  data: {
    inputValue: '',
    inputData: {},
    inputObj: {},
    birthday: '',
    workingYear: '',
    yearArr: [],
    typeArr: ['身份证', '护照', '其他'],
    year: parseInt(new Date().getFullYear()),
    ID_type: '0'
  },
  lifetimes: {
    attached() {
      const {
        stateKeys
      } = this.properties
      let inputData = {}
      console.log('require:',this.data.showRequire)
      let inputObj = getItem(stateKeys, this.data.showRequire)
      stateKeys.map(item => {
        if (this.properties.defaultValue[item]) {
          inputData[item] = this.data.defaultValue[item]
        } else {
          inputData[item] = null
        }
        if (inputObj[item].formType === "radioForm" && this.properties.defaultValue[item]) {
          inputObj[item].radioList.map(i => {
            if(i.value === this.properties.defaultValue[item]) {
              i.checked = true
            } else {
              i.checked = false
            }
          })
        }
      })
      let yearArr = []
      let year = new Date().getFullYear()
      year = parseInt(year)
      for (let i = 0; i<=100 ; i++) {
        yearArr.push(year-i)
      }
      this.setData({
        inputData,
        inputObj,
        yearArr
      })
    }
  },
  //数据监听
  observers: {
    defaultValue: function () {
      let inputData = {}
      let inputObj = this.data.inputObj
      let stateKeys = Object.keys(inputObj)
      // console.log('stateKeys:', stateKeys)
      // console.log('defaultValue:', this.properties.defaultValue)
      
      stateKeys.map(item => {
        if (this.data.defaultValue[item]) {
          inputData[item] = this.data.defaultValue[item]
        } else {
          inputData[item] = null
        }
        if (inputObj[item].formType === "radioForm" && this.data.defaultValue[item]) {
          inputObj[item].radioList.map(i => {
            if(i.value === this.data.defaultValue[item]) {
              i.checked = true
            } else {
              i.checked = false
            }
          })
        }
      })
      this.setData({
        inputData,
        inputObj
      }, () => {
        // console.log('inputData:', this.data.inputData)
        console.log('inputObj:', this.data.inputObj)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inputChange(e) {
      console.log(e)
      let value = e.detail.value
      let name = e.currentTarget.dataset.name
      if (name === "birthday" || name === "workingYear") {
        value = this.data.yearArr[value]
      }
      this.setData({
        inputData: {
          ...this.data.inputData,
          [name]: value
        },
        [name]: value
      })

      if (e.currentTarget.dataset.trigger) {
        this.inputBlur();
      }
      
      return value
    },
    inputBlur() {
      this.triggerEvent('inputCallBack', {
        inputData: this.data.inputData,
      })
    },

    bindRegionChange (e) {
      console.log(e)
    }
  }
})