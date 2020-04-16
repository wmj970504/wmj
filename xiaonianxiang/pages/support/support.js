// pages/support/support.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    navH: null,
    jiantou:"<",
    title:"",
    zc:[],
    session_key:'',
    page:1,
    user_id:''
  },

  fanhui:function() {
    wx.navigateBack({
      delta: 1
    })
  },

  toXiangqing:function(e){
    if (this.data.title == "我支持的"){
      wx.navigateTo({
        url: '../details/details?project_id=' + e.currentTarget.dataset.project_id,
      })
    }else{
      wx.navigateTo({
        url: '../choukuanxq/choukuanxq?project_id=' + e.currentTarget.dataset.project_id,
      })
    }
   
  },

  getMyProject:function(){//获取支持的列表
    // let url = app.globalData.url +'/api/my_project/'
    console.log(this.data.user_id)
    if(this.data.user_id!=undefined){
      var url = app.globalData.url + '/api/personal/support_list/'
    }else if (this.data.title == "我支持的"){
      var url = app.globalData.url + '/api/my_support_list/'
    }else{
      var url = app.globalData.url +'/api/my_project/'
    }
    console.log(url)
    let data = { 
      session_key: this.data.session_key,
      user_id:this.data.user_id,
      page:this.data.page,
      page_size:20}
      app.wxRequest("POST",url,data,res=>{
        console.log(res)
        if(this.data.list==[]){
          this.setData({
            zc: res.data
          })
        }else{
          let arr=res.data;
          let arr2=this.data.zc;
          arr2=arr2.concat(arr)
          this.setData({
            zc: arr2
          })
        }
        console.log(this.data.zc)
      },err=>{console.log(err)})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      navH: app.globalData.navHeight
    });
    if(options.name=="zhichi"){
      this.setData({
        title:"我支持的"
      })
    }
    if (options.name == "choukuan"){
      this.setData({
        title:"我的筹款"
      })
    }
    var obj = {};
    wx.getStorage({
      key: 'user',
      success:  (res)=> {
        obj = res.data
        this.setData({
          session_key: res.data.session_key,
          user_id: options.user_id
        })
        this.getMyProject() //调用函数
      },
    })

    // 请求商品列表
    // var zcURL = app.globalData.url + '/api/personal/support_list/'
    // var zcdata = {
    //   session_key: obj.session_key,
    //   user_id: options.user_id
    // };
    // app.wxRequest('POST', zcURL, zcdata, (res) => {
    //   console.log(res.data)
    //   this.setData({
    //     zc: res.data
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
    let i = this.data.page
    this.setData({
      page: ++i
    })
    console.log(this.data.page)
    this.getMyProject()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})