// pages/ckdongtai/ckdongtai.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    dt:[],
    project_id:''
  },

  toFbdongtai:function(){
    wx.navigateTo({
      url: '../fbdongtai/fbdongtai?project_id='+this.data.project_id
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
      navH: app.globalData.navHeight,
      project_id:options.project_id
    });
    // 请求内容
    let id = options.project_id
    console.log(id)
    var dtURL = app.globalData.url + '/api/project/news_raised/'
    var dtdata = {
      project_id: id,
    };
    app.wxRequest('POST', dtURL, dtdata, (res) => {
      console.log(res)
      this.setData({
        dt: res.data
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