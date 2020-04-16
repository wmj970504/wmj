// pages/myfans/myfans.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    stasus:false,
    list:[],
    session_key:""
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    }) 
  },

  toOthers:function(e){
    let id = e.currentTarget.dataset.user_id
    wx.navigateTo({
      url: '../others/others?user_id='+id,
    })
  },

  cancel: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.user_id
    let url = app.globalData.url +'/api/favorite/do_favorite/'
    let data = { type: 'user', association_id: id, session_key:this.data.session_key}
    app.wxRequest("POST",url,data,res=>console.log(res),err=>console.log(err))
    this.getOtherList()
  },
  
  getOtherList: function () {
    wx.getStorage({
      key: 'user',
      success: (res) =>{
        this.setData({
          session_key:res.data.session_key
        })
       console.log(res.data)
        let url = app.globalData.url + '/api/focused_list/'
        let data = { session_key: res.data.session_key }
        console.log(url,data)
        app.wxRequest('POST', url, data, (res) => {
          console.log(res)
          this.setData({
            list: res.data
          })
        }, (err) => {
          console.log(err)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    this.getOtherList()
  },
  
  /**s
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