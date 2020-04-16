// pages/support/support.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    jiantou: "<",
    title: "",
    zc: [],
    session_key: '',
    page: 1,
    user_id: '',
    title:''
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  toXiangqing: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/details/details?project_id=' + e.currentTarget.dataset.project_id,
    })
  },

  getMyProject: function () {//获取他的筹款列表
  var url=''
    if (this.data.title =="支持"){
      url = app.globalData.url + '/api/personal/support_list/'
    }else{
       url = app.globalData.url + '/api/personal/raised_list/' 
    }
    
    console.log(url)
    let data = {
      session_key: this.data.session_key,
      user_id: this.data.user_id,
      page: this.data.page,
      page_size: 20
    }
    app.wxRequest("POST", url, data, res => {
      if (this.data.list == []) {
        this.setData({
          zc: res.data
        })
      } else {
        let arr = res.data;
        let arr2 = this.data.zc;
        arr2 = arr2.concat(arr)
        this.setData({
          zc: arr2
        })
      }
      console.log(this.data.zc)
    }, err => { console.log(err) })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      navH: app.globalData.navHeight
    });
    console.log(options)
    if (options.name == "zhichi") {
      this.setData({
        title: "支持"
      })
    }
    if (options.name == "choukuan") {
      this.setData({
        title: "筹款"
      })
    }
    var obj = {};
    wx.getStorage({
      key: 'user',
      success: (res) => {
        obj = res.data
        this.setData({
          session_key: res.data.session_key,
          user_id: options.user_id
        })
        this.getMyProject() //调用函数
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