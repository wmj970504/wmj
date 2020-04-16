// pages/question/question.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    help_list:[]
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
    // 请求常见问题列表
    var helpURL = app.globalData.url + '/api/help_list/'
    var data = {};
    app.wxRequest('POST', helpURL, data, (res) => {
      console.log(res.data)
      this.setData({
        help_list: res.data
      })
    }, (err) => {
      console.log(err)
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