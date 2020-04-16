// pages/phone/phone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    phone:"" ,
    session_key:''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  phonenum: function (e) {
    var value = e.detail;
    this.setData({
      phone:value
    })
  },

// addStation:function(){
//   wx.getStorage({
//     key: 'user',
//     success: (res)=> {
//       console.log(res)
//       let url = app.globalData.url +'/api/add_station/'
//       let data = { type: 'phone', session_key: res.data.session_key, content:this.data.phone}
//       app.wxRequest("post",url,data,res=>{
//         console.log(res)
//       },err=>{console.log(err)})
//     },
//   })
// },
  save: function () {
    var regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
    if(regs.test(this.data.phone)){
      console.log(this.data.phone)
      
      // 保存电话
      var fenleiURL = app.globalData.url + '/api/add_station/'
      var data = {
        session_key:this.data.session_key,
        type:"phone",
        content:this.data.phone
      };
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
        myphone:this.data.phone
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);
    }else{
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'none'
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      navH: app.globalData.navHeight,
      phone:options.phone
    });
    wx.getStorage({
      key: 'user',
      success:  (res) =>{
        this.setData({
          session_key:res.data.session_key
        })
      },
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