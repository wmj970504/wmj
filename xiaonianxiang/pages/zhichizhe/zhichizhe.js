// pages/zhichizhe/zhichizhe.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    zc: [],
    status:''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  jump:function(e){
    console.log(e)
  let user_id = e.currentTarget.dataset.user_id
    wx.navigateTo({
      url: '/pages/others/others?user_id='+user_id,
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
    console.log(options)
    var zcURL = app.globalData.url + '/api/project/support_raised/'
    var zcdata = {
      project_id: options.project_id,
    };
    app.wxRequest('POST', zcURL, zcdata, (res) => {
      console.log(res)
      this.setData({
        zc: res.data,
        status: options.status
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