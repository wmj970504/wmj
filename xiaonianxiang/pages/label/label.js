// pages/phone/phone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    label1: "",
    label2: "",
    label3: "",
    session_key: ''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  phonenum1: function (e) {
    console.log(e)
    var str = e.detail;
    
      this.setData({
        label1: str
      })
    
  },
  phonenum2: function (e) {
    console.log(e)
    var str = e.detail;
    
      this.setData({
        label2: str
      })
    
  },
  phonenum3: function (e) {
    console.log(e)
    var str = e.detail;
       
      this.setData({
        label3: str
      })
    
    
  },


  save: function () {
    let str = this.data.label1 + ',' + this.data.label2 + ',' + this.data.label3 
    let ex=/\s+/
    console.log(str.length)
    if (ex.test(str)){
      wx.showToast({
        title: '不能有空格！',
      })
    } else if (str.length<=15) {
      wx.getStorage({
        key: 'user',
        success: (res) => {
          this.setData({
            session_key: res.data.session_key
          })

          // 保存简介
          var fenleiURL = app.globalData.url + '/api/add_label/'
          let str = this.data.label1 + ',' + this.data.label2 + ','+this.data.label3 
          var data = {
            session_key: this.data.session_key,
            label: str
          };
          console.log(data)
          app.wxRequest('POST', fenleiURL, data, (res) => {
            console.log(res)
          }, (err) => {
            console.log(err.errMsg)
          })

          wx.showToast({
            title: '保存成功',
            duration: 1000
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            mylabel: this.data.label
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500);
        },
      })
    } else {
      wx.showToast({
        title: '字数过多！',
      })
    }
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