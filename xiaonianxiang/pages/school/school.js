// pages/school/school.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    school: ""
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  schoolname: function (e) {
    var school = e.currentTarget.dataset.school;
    var value = e.detail;
    var dataMap = {};
    dataMap[school] = value;
    this.setData(dataMap);
  },

  addStation:function(){ //保存学校
    wx.getStorage({
      key: 'user',
      success: (res)=>{
        var fenleiURL = app.globalData.url + '/api/add_station/'
        var data = {
          session_key: res.data.session_key,
          type: "school",
          content: this.data.school
        };
        app.wxRequest('POST', fenleiURL, data, (res) => {
          console.log(res)
        }, (err) => {
          console.log(err.errMsg)
        })

      },
    })

  },



  save: function () {
    var regs = /^\s+$/;
    if (regs.test(this.data.school)) {
      wx.showToast({
        title: '不能有空格！',
        icon: 'none'
      })
    } else if (this.data.school!=="") {
      console.log(this.data.school)
      this.addStation()
      wx.showToast({
        title: '保存成功',
        duration: 1000
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        myschool: this.data.school
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1 
        })
      }, 1500);
    } else {
      wx.showToast({
        title: '输入不能为空！',
        icon: 'none'
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight,
      school:options.school
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