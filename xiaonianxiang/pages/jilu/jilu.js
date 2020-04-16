// pages/jilu/jilu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    navH: null,
    page: 1,
    list: [],
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  getoperating:function(){ //获取账户记录
    wx.getStorage({
      key: 'user',
      success:(res) =>{
        let url = app.globalData.url + '/api/operating/'
        let data = { session_key: res.data.session_key, page: this.data.page,page_size:20}
        app.wxRequest("POST",url,data,res=>{
          console.log(res.data)
          let arr=[]
          if (this.data.list == []){
             arr = res.data
          }else{
            let arr1 = res.data
            console.log(res)
            arr = this.data.list
            arr = arr.concat(arr1)
            console.log(arr)
          }
          
          if(res.data[0].title==undefined){
            wx:wx.showToast({
              title: '没有更多记录了',
              icon: 'fail',
            })
          }
          this.setData({
            list:arr
          })
        })
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
    this.getoperating()
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
    let i = this.data.page
    this.setData({
      page:++i
    })
    console.log(this.data.page)
    this.getoperating()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})