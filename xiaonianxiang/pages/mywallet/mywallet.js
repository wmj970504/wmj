// pages/mywallet/mywallet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    money:''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  getUserRaised:function(){
    wx.getStorage({
      key: 'user',
      success: (res)=> {
        console.log(res)
        var url = app.globalData.url + '/api/get_user_raised/'
        var data = { session_key: res.data.session_key }
        app.wxRequest("POST", url, data,
          res => {
            console.log(res)
            if (res.code == 200) {
              this.setData({
                money: res.data
              })
            }
          }),
          err => { console.log(err) }
      },
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });

    
   
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
    this.getUserRaised()
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