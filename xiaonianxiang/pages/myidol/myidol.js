// pages/myidol/myidol.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    user_id:'', 
    list:[],
    session_key:''
  },

  toOthers: function (e) {
    let id = e.currentTarget.dataset.user_id
    wx.navigateTo({
      url: '../others/others?user_id=' + id,
    })
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  cancel: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.user_id
    let url = app.globalData.url + '/api/favorite/do_favorite/'
    let data = { type: 'user', association_id: id, session_key: this.data.session_key }
    app.wxRequest("POST", url, data, res => console.log(res), err => console.log(err))
    this.getOtherList()
  },
  setgaunzu: function (id) {
    let url = app.globalData.url + '/api/favorite/do_favorite/';
    let data = { type: 'user', association_id: id, session_key: this.data.session_key }
    app.wxRequest("POST", url, data, res => { console.log(res) }, err => { console.log(err) })
  },
  getOtherList: function () {
    wx.getStorage({
      key: 'user',
      success: (res) => {
        console.log(res.data)
        var url = app.globalData.url + '/api/focus_list/'
        console.log(this.data.user_id)
        if (this.data.user_id !== undefined){
          url = app.globalData.url +'/api/personal/focus_list/'
        }
        console.log(url)
        let data = { session_key: res.data.session_key, user_id:this.data.user_id }
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
    console.log(options.user_id)
    this.setData({
      navH: app.globalData.navHeight,
      user_id:options.user_id
    });
    var obj = {};
    wx.getStorage({
      key: 'user',
      success: (res) =>{
        obj = res.data
        console.log(obj)
        this.setData({
          session_key:res.data.session_key
        })
      },
    })
    this.getOtherList()
    // 请求商品列表
    // var gzURL = app.globalData.url + '/api/personal/focus_list/'
    // var gzdata = {
    //   session_key: obj.session_key,
    //   user_id: options.user_id
    // };
    // app.wxRequest('POST', gzURL, gzdata, (res) => {
    //   console.log(res)
    //   this.setData({
    //     gz: res.data
    //   })
    // }, (err) => {
    //   console.log(err.errMsg)
    // })

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