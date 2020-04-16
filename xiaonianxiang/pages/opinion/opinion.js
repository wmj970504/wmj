// pages/phone/phone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    label: "",
    num:300,
    session_key: '',
    mobile: '',
    true_name: '',
    other: ''
  },
  
  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  inputText: function (e) {
    console.log(e)
    var str = e.detail.value;
    this.setData({
      label: str,
      num:300-str.length
    })
  },
  nametext: function (e) {
    console.log(e)
    var str = e.detail;
    this.setData({
      true_name:str
    })
  },
  mobiletext: function (e) {
    console.log(e)
    var str = e.detail;
    this.setData({
      mobile: str
    })
  },
  othertext:function(e){
    console.log(e)
    var str = e.detail;
    this.setData({
      other: str
    })
  },
  save: function () {
    var ex = /^1[3-9]\d{9}$/ 
    if(this.data.label.length>300){
      wx.showToast({
        title: '字数过多',
      })
    } else if(!ex.test(this.data.mobile)){
      wx.showToast({
        title: '手机号不正确',
      })
    } else if (this.data.true_name == "" || this.data.true_name == undefined){
      wx.showToast({
        title: '名字不能为空',
      })
    }
    else{
      console.log(this.data.label)
      wx.getStorage({
        key: 'user',
        success: (res) => {
          this.setData({
            session_key: res.data.session_key
          })

          // 保存简介
          var fenleiURL = app.globalData.url + '/api/feedback/'
          var data = {
            session_key: this.data.session_key,
            content: this.data.label,
            mobile:this.data.mobile,
            true_name:this.data.true_name,
            other:this.data.other
          };
          console.log(data)
          app.wxRequest('POST', fenleiURL, data, (res) => {
            console.log(res)
            if(res.code==200){
              wx.showToast({
                title: '提交成功',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500);
            }
          }, (err) => {
            console.log(err.errMsg)
          })        
        },
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