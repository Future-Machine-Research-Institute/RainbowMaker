// Components/modelView/modelView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalDlg: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    preventTouchMove: function () {
      //阻止触摸
    },

    showDialog(){
      this.setData({
        showModalDlg: true
      })
    },

    modelCancel:function(){
      this.setData({
        showModalDlg: false
      })
    },

    toCancel: function () {
      this.setData({
        showModalDlg: false
      })
    },

    openSetting: function () {
      this.setData({
        showModalDlg: false
      })
      wx.openSetting({
        //调起客户端小程序设置界面，返回用户设置的操作结果。
      })
    },

  }
})
