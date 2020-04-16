// pages/tixian/tixian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    yue:0,
    can_transfer:0,
    num:'',
    session_key:'',
    down_amount:''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },


  tixianjine:function(e){
    console.log(e)
   let q= e.detail 
   console.log(q)
    this.setData({
      num:q
    })
    // let num = e.currentTarget.dataset.num;
    // let value = e.detail.value;;
  },

  tijiao:function(){
    
    if (parseFloat(this.data.num) <= parseFloat(this.data.can_transfer)){
      console.log(this.data.num, this.data.can_transfer)
      let url = app.globalData.url +"/api/transfer/";
      let data = { session_key: this.data.session_key, amount:this.data.num }
      app.wxRequest('POST',url,data,res=>{
        console.log(res)
        if(res.code==200){
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          setTimeout(this.fanhui,1000)
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        
      }, err => { console.log(err) })
     
    }else{     
      wx.showToast({
        title: '提现余额不足',
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
      can_transfer:options.can_transfer,
      down_amount: options.down_amount
    });
    wx.getStorage({
      key: 'user',
      success: (res)=>{
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