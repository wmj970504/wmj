// pages/zhengshilist/zhengshilist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    zs: ''
  },

  toFbdongtai: function () {
    wx.navigateTo({
      url: '../fbdongtai/fbdongtai',
    })
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    // 请求内容
    var zsURL = app.globalData.url + '/api/project/confirm_raised/'
    var zsdata = {
      project_id: options.project_id,
    };
    app.wxRequest('POST', zsURL, zsdata, (res) => {
      console.log(res.data)
      this.setData({
        zs: res.data
      })
    }, (err) => {
      console.log(err.errMsg)
    })

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