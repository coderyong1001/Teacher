export const ShowToast = (msg, icon = 'none', duration = 1500) => {
  return (wx.showToast({
    title: msg || 'unknown error',
    duration,
    icon
  }))
}
export const ShowLoading = (title) => {
  return (wx.showLoading({
    title: title || '',
    mask: true
  }))
}
export const HideLoading = () => {
  return wx.hideLoading()
}
export const ShowModal = (title = '提示', content='内容部分', showCancel = true , callBack) => {
  return (wx.showModal({
    title,
    content,
    showCancel,
    confirmColor: '#018389',
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        if (callBack) {
          callBack()
        }
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  }))
}
