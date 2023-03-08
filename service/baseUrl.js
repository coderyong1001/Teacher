let baseUrl = ''
let version = __wxConfig.envVersion
// 判断小程序的环境
switch (version) {
  case 'develop': // 开发版
  // baseUrl = 'http://172.20.22.112:8000/teacher_training/small_app'
    baseUrl = 'https://ccc-tt-api-qa.dev-test.mmxlr.com/teacher_training/small_app'
    break;
  case 'trial': // 体验版
    // baseUrl = 'https://ccc-tt-api-pre.dev-test.mmxlr.com/teacher_training/small_app'
    baseUrl = 'https://ccc-tt-api-qa.dev-test.mmxlr.com/teacher_training/small_app'
    break;
  case 'release': // 线上版
    baseUrl = 'https://teacher-api.cnccbm.org.cn/teacher_training/small_app'
    break;
  default:
    baseUrl = 'https://ccc-tt-api-qa.dev-test.mmxlr.com/teacher_training/small_app'
}
export default baseUrl