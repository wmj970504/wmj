// pages/shensu/shensu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    num: 300,
    textContent: '',
    radio: '1',
    user_return_id:'',
    session_key:''
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name
    });
  },

  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  inputText: function (e) {
    var value = e.detail.value
    this.setData({
      num: 300 - value.length,
      textContent: value
    })
  },

  fabu: function () {
    if (this.data.textContent == ""){
      wx.showToast({
        title: '请填写申诉理由',
      })
      return
    }
    console.log(this.data.textContent)
    let url = app.globalData.url +'/api/complain_return/'
    let data = { session_key: this.data.session_key, user_return_id: this.data.user_return_id, content:this.data.textContent}
    console.log(data)
    app.wxRequest('POST',url,data,res=>{
      console.log(res)
      wx.showToast({
        title: '申诉成功',
      })
      setTimeout(this.fanhui,1000)
      
      },err=>{console.log(err)})
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
    let id = options.user_return_id
    wx.getStorage({
      key: 'user',
      success: (res)=>{
        this.setData({
          user_return_id:id,
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