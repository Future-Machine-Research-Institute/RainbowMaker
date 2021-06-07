//index.js
const app = getApp()

const FormData = require('../../thirdParty/wxFormdata/formData.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imageWidth: 0,
    // imageHeight: 0,
    imageBackgroundColor : 'white',
    uploadButtonToTop: 0,
    src: ""
  },

    /**
   * 私有函数
   */
  whiteSelected() {
    console.log("whiteSelected")
    let that = this;
    that.setData({
      imageBackgroundColor : 'white'
  })
  },

  blueSelected() {
    console.log("blueSelected")
    let that = this;
    that.setData({
      imageBackgroundColor : 'rgb(60, 140, 220)'
  })
  },

  redSelected() {
    console.log("redSelected")
    let that = this;
    that.setData({
      imageBackgroundColor : 'rgb(255, 0, 0)'
  })
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
      //   that.setData({
      //     src:res.tempFilePaths
      // })

        let formData = new FormData()
        formData.append("api_key", "DCgBh_K6hy8jgfEmHmt4H3knmgtL7zj3")
        formData.append("api_secret", "C-Kp9_XiN536UCDjkKGkaZnAigWRuOL-")
        formData.append("return_grayscale",0)
        formData.appendFile("image_file", res.tempFilePaths[0])
        let data = formData.getData();
        wx.showLoading({
          title: '上传中',
        })
        wx.request ({
          url: 'https://api-cn.faceplusplus.com/humanbodypp/v2/segment',
          method: "post",
          header: {
          'content-type': data.contentType
        },
        data: data.buffer,
        success:function(res){
          console.log('success');
          console.log(res)
          var statusCode = res.statusCode
          var errMsg = res.data.error_message
          var base64Image = res.data.body_image
          wx.hideLoading({
            success: (res) => {
              if(statusCode == 200) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'none',
                  duration: 1000
                })
                that.setData({
                  src: base64Image
                })
              } else {
                wx.showToast({
                  title: '上传失败，' + errMsg,
                  icon: 'none',
                  duration: 1500
                })
              }
            },
          })
        },
        fail:function(res){
          console.log('failed');
          console.log(res)
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '上传失败，' + res.errMsg,
                icon: 'none',
                duration: 1500
              })
            },
          })
        },
        complete:function() {
          console.log('completed');
        }
      })

        },
        fail: function() {
          // fail
          console.log("fail")
          wx.showToast({
            title: '选取图片失败',
            icon: 'none',
            duration: 1500
          })
          },
          complete: function() {
          // complete
          console.log("complete")
          }
      })
  },

  downloadToPhotoAlbum() {
    console.log("downloadToPhotoAlbum")
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
