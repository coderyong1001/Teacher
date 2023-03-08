import { ShowToast } from '../utils/show_toast_loading_modal'
import urlEncode from './url_encode'
// 强制登录的通用方法
const forceNavigate = (showText, navigateUrl) => {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let route = currentPage.route
  let redirectUrl = ''
  for (let key in currentPage.options) {
    if (key === '__key_') {
      delete currentPage.options[key]
    }
  }
  if (JSON.stringify(currentPage.options) === '{}') {
    redirectUrl = route
  } else {
    let params = urlEncode(currentPage.options)
    redirectUrl = `${route}?${params}`
  }
  // wx.setStorageSync('isForce', 'true') // 强制登录标识
  wx.setStorageSync('redirectUrl', redirectUrl) // 保存强制登录时的路由
  wx.navigateTo({
    url: navigateUrl
  })
  ShowToast(showText)
}
export default forceNavigate