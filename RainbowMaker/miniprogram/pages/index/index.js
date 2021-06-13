//index.js
const app = getApp()

const FormData = require('../../thirdParty/wxFormdata/formData.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scaleFlag: true,
    imageBackgroundColor : 'white',
    uploadButtonToTop: 0,
    src: "",
    tmpImageFilePath: "",
    tmpImageWidth: 0,
    tmpImageHeight: 0,
    canvasImage:""
  },

    /**
   * 私有函数
   */
//   data () {
//     return {
//       canvas: null // 实例
//     }
// },

  whiteSelected() {
    console.log("whiteSelected")
    let that = this;
    that.setData({
      imageBackgroundColor : 'white'
    })
    that.drawCanvasImage(that.data.tmpImageFilePath,that.data.imageBackgroundColor)
  },

  blueSelected() {
    console.log("blueSelected")
    let that = this;
    that.setData({
      imageBackgroundColor : 'rgb(60, 140, 220)'
    })
    console.log("that.data.tmpImageFilePath: ",that.data.tmpImageFilePath)
    that.drawCanvasImage(that.data.tmpImageFilePath,that.data.imageBackgroundColor)
  },

  redSelected() {
    console.log("redSelected")
    let that = this;
    that.setData({
      imageBackgroundColor : 'rgb(255, 0, 0)'
    })
    that.drawCanvasImage(that.data.tmpImageFilePath,that.data.imageBackgroundColor)
  },

  drawCanvasImage(imageFilePath,canvasBgColor) {
    let that = this;
    const query = wx.createSelectorQuery()
    query.select('#canvas_box')
    .fields({ node: true, size: true })
    .exec((res) => {

    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    console.log("dpr: ", dpr)
    var width = that.data.tmpImageWidth
    var height = that.data.tmpImageHeight

    canvas.width = res[0].width * dpr
    canvas.height = res[0].height * dpr

    //用于区分ios真机模式下scale与安卓真机的scale差异点
    var isIOS = true

    wx.getSystemInfo({
      success:function(res){
        console.log("系统信息:",res)
        if(res.platform == "ios") {
         isIOS = true 
        } else {
         isIOS = false
        }
      }
    });
    ctx.scale(dpr, dpr)
    // if(isIOS == true) {
    //   console.log("ios真机")
    //   if(that.data.scaleFlag == true) {
    //     ctx.scale(dpr, dpr)
    //     that.data.scaleFlag = false
    //   }
    // } else {
    //   console.log("安卓或者模拟器")
    //   ctx.scale(dpr, dpr)
    // }
    //rgb(60, 140, 220)

    let clientWidth = wx.getSystemInfoSync().windowWidth
    let ratio = 750 / clientWidth

    //aspectFill 因为canvas不支持aspectFill属性，需要手写裁剪模式

    const img = canvas.createImage() 

    if(imageFilePath == "") {
      
    } else {
      img.src = imageFilePath
    }
    
    img.onload = () => {
    // ctx.drawImage(img, - 299 / ratio / 2.0, 0, 299 / ratio * 2, 417 / ratio);
    ctx.fillStyle = canvasBgColor;
    ctx.fillRect(0, 0, 299 / ratio, 417 / ratio);

    if(imageFilePath == "") {
      
    } else {
       //ctx.drawImage(img, 0, 0, 299 / ratio, 417 / ratio)

      var disX = 0
      var disY = 0
      var realImageWidth = width;
      var realImageHeight = height;

      console.log("width:", width)
      console.log("height:", height)

      //添加图片裁剪模式，使canvas实现类似image控件的aspectFill属性
      if(width >= height) {
        console.log("高比宽小")
        realImageWidth = ((417.0 / ratio) / height) * width
        console.log("realImageWidth: ", realImageWidth)
        realImageHeight = 417.0 / ratio
        console.log("realImageHeight: ", realImageHeight)
        disX = - (realImageWidth - 299.0 / ratio) / 2.0
        disY = 0

      } else {
        console.log("宽比高小")
        realImageWidth = 299.0 / ratio
        console.log("realImageWidth: ", realImageWidth)
        realImageHeight = ((299.0 / ratio) / width) * height
        console.log("realImageHeight: ", realImageHeight)
        disX = 0
        disY = - (realImageHeight - 417.0 / ratio) / 2.0
      }

       ctx.drawImage(img, disX, disY, realImageWidth, realImageHeight);

    }  
                       
    }

    //canvasImage
    that.setData({
      canvasImage: canvas
    })

  })

  },

  uploadImage(tempImagePath) {
    let that = this
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    //that.drawCanvasImage(tempFilePaths[0],that.data.imageBackgroundColor)
    let formData = new FormData()
    formData.append("api_key", "DCgBh_K6hy8jgfEmHmt4H3knmgtL7zj3")
    formData.append("api_secret", "C-Kp9_XiN536UCDjkKGkaZnAigWRuOL-")
    formData.append("return_grayscale",0)
    formData.appendFile("image_file", tempImagePath)
    let data = formData.getData();
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
            
            const fs = wx.getFileSystemManager()
            const FILE_BASE_NAME = 'tmp_base64imgsrc'
            const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec("data:image/png;base64," + base64Image) || []
            if (!format) {
              console.log("ERROR_PARSE")
                return (new Error('ERROR_PARSE'))
            }
            const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME+Date.parse(new Date())}.${format}`
            const buffer = wx.base64ToArrayBuffer(bodyData)
            fs.writeFile({
                filePath,
                data: buffer,
                encoding: 'binary',
                success() {
                  console.log("写入图片成功")
                  that.setData({
                    tmpImageFilePath: filePath
                  }) 
                  that.drawCanvasImage(filePath,that.data.imageBackgroundColor)

          },
          fail() {
              console.log("写入图片失败")
          },
      });
          } else {
            // wx.showToast({
            //   title: '上传失败，' + errMsg,
            //   icon: 'none',
            //   duration: 1500
            // })
            wx.showModal({
              title: '上传图片失败',
              content: '是否尝试重新上传图片',
              showCancel: true,
              success: function (res) {
                 if (res.confirm) {
                    that.uploadImage(tempImagePath)
                 } else {
                    
                 }
              },
              //接口调用失败的回调函数
              fail: function (res) { },
              //接口调用结束的回调函数（调用成功、失败都会执行）
              complete: function (res) { },
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

  gotoShow() {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        wx.getImageInfo({ 
        src: tempFilePaths[0], 
        success: function (res) { 
          that.setData({
            tmpImageWidth: res.width,
            tmpImageHeight: res.height
          })
        } 
        }) 
          that.uploadImage(res.tempFilePaths[0])
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

  saveToPhotoAlbum() {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvas: this.data.canvasImage,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            wx.showToast({
              title: '保存成功'
            })
          },
          fail() {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: 'canvasToTempFilePath 失败',
          icon: 'none'
        })
        console.log("canvasToTempFilePath 失败")
      }
    })
  },

  downloadToPhotoAlbum() {
    console.log("downloadToPhotoAlbum")
    let that = this;

    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { 
              //这里是用户同意授权后的回调
              that.saveToPhotoAlbum()
            },
            fail() { 
              //这里是用户拒绝授权后的回调
              that.modelView.showDialog()
            }
          })
        } else {  
          //用户已经授权过了
          that.saveToPhotoAlbum()
        }
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
    console.log("ratio: ", ratio)
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
    this.modelView = this.selectComponent("#modelView")
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
