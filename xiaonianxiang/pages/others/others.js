// pages/others/others.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    guanzhu:"关注Ta",
    id:0,
    user_id:'',
    xx:{},
    session_key:''
  },


  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  setgaunzu:function(){
    let url = app.globalData.url +'/api/favorite/do_favorite/';
    let data = { type: 'user', association_id: this.data.user_id, session_key:this.data.session_key}
    app.wxRequest("POST",url,data,res=>{console.log(res)},err=>{console.log(err)})
  },
  cancel: function () {
    this.setgaunzu()
    if (this.data.guanzhu =="关注Ta"){
      this.setData({
        guanzhu:"取消关注"
      })
      wx.showToast({
        title: '已关注',
      })
    }else{
      this.setData({
        guanzhu: "关注Ta"
      })
      wx.showToast({
        title: '已取消',
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
      user_id:options.user_id
    });
    if(options.id==1){
      this.setData({ id: options.id });
    }

    var obj = {};
    wx.getStorage({
      key: 'user',
      success: res=> {
        obj = res.data
        
        console.log(obj)
        var xxURL = app.globalData.url + '/api/personal/get_user_info/'
        var xxdata = {
          session_key: obj.session_key,
          user_id: this.data.user_id
        };
        console.log(xxdata)
        app.wxRequest('POST', xxURL, xxdata, (res) => {
          console.log(res)
          this.setData({
            xx: res.data,
            session_key: obj.session_key
          })

          if(this.data.xx.is_focus==1){
            this.setData({
              guanzhu: "取消关注"
            })
          }else{
            this.setData({
              guanzhu: "关注Ta"
            })
          }
        }, (err) => {
          console.log(err.errMsg)
        })
        
      },
    })

    // 请求用户列表
    // var xxURL = app.globalData.url + '/api/personal/get_user_info/'
    // var xxdata = {
    //   session_key: obj.session_key,
    //   user_id:options.user_id
    // };
    // app.wxRequest('POST', xxURL, xxdata, (res) => {
    //   console.log(res.data)
    //   this.setData({
    //     xx: res.data
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
