//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imageWidth: 0,
    // imageHeight: 0,
    uploadButtonToTop: 0,
    src: ""
  },

  gotoShow() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        that.setData({
          src:res.tempFilePaths
      })
      },
      fail: function() {
        // fail
        console.log("fail")
        },
        complete: function() {
        // complete
        console.log("complete")
        }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(wx.getSystemInfoSync().windowHeight)
     console.log(wx.getSystemInfoSync().windowWidth)
     // 获取可使用窗口宽度
    let clientHeight = wx.getSystemInfoSync().windowHeight;
    // 获取可使用窗口高度
    let clientWidth = wx.getSystemInfoSync().windowWidth;
    // 算出比例
    let ratio = 750 / clientWidth;
    // 算出高度(单位rpx)
    let height = clientHeight * ratio;
    console.log("realHeight: ", height)
    let that = this;
    that.setData({
      uploadButtonToTop: height - 130
    })
    // let that = this;
    // that.setData({
    //   //  imageHeight: wx.getSystemInfoSync().windowWidth * 413 / 295,
    //   //  imageWidth: wx.getSystemInfoSync().windowWidth
    //   imageHeight: 413,
    //   imageWidth: 295
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
