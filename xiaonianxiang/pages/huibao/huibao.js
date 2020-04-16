// pages/huibao/huibao.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    session_key:'',
    array:''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getStatus(id){
    if(id==0){
      return '未兑换'
    }else if(id==1){
      return '已兑换'
    }else if(id==2){
      return '已申诉待反馈'
    }else{
      return '已确认'
    }
  },
getlist:function(){
  let url = app.globalData.url +'/api/my_return_list/';
  let data = { session_key:this.data.session_key }
  app.wxRequest("POST",url,data,res=>{
    console.log(res)
    this.setData({
      array:res.data
    })
  },err=>{console.log(err)})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    wx.getStorage({
      key: 'user',
      success: (res)=>{
        this.setData({
          session_key:res.data.session_key
        })
        this.getlist()
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