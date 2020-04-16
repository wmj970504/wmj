// pages/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    time:"11:20",
    title:"应对疫情“大考” 习近平提出五大改革任务",
    mss:[]
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
    var obj = {};
    wx.getStorage({
      key: 'user',
      success:  (res)=> {
        obj = res.data
        console.log(obj)

        var mssURL = app.globalData.url + '/api/message_list/'
        var data = {
          session_key: obj.session_key
        };
        app.wxRequest('POST', mssURL, data, (res) => {
          console.log(res)
          this.setData({
            mss: res.data
          })
        }, (err) => {
          console.log(err.errMsg)
        })

      },
    })
    // 请求详情
   
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