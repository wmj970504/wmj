// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    value:'',
    yc:'',
    keyword:'',
    page: 1,
    details_list:[]
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  onSearch() {
    console.log('search搜索' + this.data.value);
    var searchURL = app.globalData.url + '/api/project/search/'
    var searchdata = {
      keyword: this.data.value,
      page: 0,
      page_size: 5
    };
    app.wxRequest('POST', searchURL, searchdata, (res) => {
      console.log(res.data)
      this.setData({
        details_list: res.data
      })
      if (this.data.details_list.length == 0) {
        this.setData({
          yc: 1
        })
      }
      console.log(this.data.details_list.length)
    }, (err) => {
      console.log(err.errMsg)
    })
  },

  onClick() {
    console.log('click搜索' + this.data.value);
    this.onSearch()
  },

  toDetails: function (e) {
    wx.navigateTo({
      url: '../details/details?project_id=' + e.currentTarget.dataset.id
    })
    console.log(e.currentTarget.dataset.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight,
      // 获取关键字
      keyword:options.keyword
    });
    // 请求搜索商品列表
    var searchURL = app.globalData.url + '/api/project/search/'
    var searchdata = {
      keyword: this.data.keyword,
      page: 0,
      page_size: 5
    };
    app.wxRequest('POST', searchURL, searchdata, (res) => {
      console.log(res.data)
      this.setData({
        details_list: res.data
      })
      if(this.data.details_list.length==0){
        this.setData({
          yc:1
        })
      }
      console.log(this.data.details_list)
    }, (err) => {
      console.log(err.errMsg)
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
    var page = this.data.page += 1;
    // 请求商品列表
    var searchURL = app.globalData.url + '/api/project/search/'
    var searchdata = {
      keyword: this.data.keyword,
      page: page,
      page_size: 5
    };
    app.wxRequest('POST', searchURL, searchdata, (res) => {
      var list = this.data.details_list.concat(res.data)
      this.setData({
        details_list: list
      })
      console.log(this.data.details_list)
    }, (err) => {
      console.log(err.errMsg)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})