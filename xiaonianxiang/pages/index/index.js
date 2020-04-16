// pages/details/details.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    active: 1,
    value: '',
    tabbar: {},
    page:1,
    banner_list: [],
    fenlei_list:[],
    details_list:[],
    name:1
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  toxinxi:function(e){
    console.log(e.currentTarget.dataset.user_id);
    wx.navigateTo({
      url: '../others/others?user_id=' + e.currentTarget.dataset.user_id,
    })
  },
  qiehuan2(e){
    console.log(e)
  },
  qiehuan(event) {
    console.log(event)
    this.setData({
      active: event.detail.name,
      name: event.detail.name,
      page:1
    })
    var detailsURL = app.globalData.url + '/api/project/project_list/'
    let id = this.data.name
    var detailsdata = {
      category_id: id,
      page: 0,
      page_size: 5
    };
    app.wxRequest('POST', detailsURL, detailsdata, (res) => {
      console.log(res.data)
      this.setData({
        details_list: res.data
      })
    }, (err) => {
      console.log(err.errMsg)
    })
  },

  onSearch() {
    console.log('search搜索' + this.data.value);
    wx.navigateTo({
      url: '../search/search?keyword='+this.data.value,
    })
  },

  onClick() {
    console.log('click搜索' + this.data.value);
    this.onSearch();
  },

  // 跳转详情页
  toDetails:function(e){
    wx.navigateTo({
      url: '../details/details?project_id=' + e.currentTarget.dataset.id
    })
    console.log(e.currentTarget.dataset.id)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // tabbar
    app.editTabbar();
    // 获取右上角关闭按钮距离顶部的距离
    this.setData({
      navH: app.globalData.navHeight,
    });
    // 获取手机型号
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
      },
      fail:function(err){
        console.log(err)
      }
    });
    // 请求
    // var obj={};
    // wx.getStorage({
    //   key: 'user',
    //   success: function(res) {
    //     obj=res.data
    //     console.log(obj)
    //   },
    // })
    var objz = {};
    wx.getStorage({
      key: 'useruserInfo',
      success: function (res) {
        objz = res.data
        console.log(objz)
      }
    })

    // 请求商品列表
    var detailsURL = app.globalData.url + '/api/project/project_list/'
    let id = this.data.name
    var detailsdata = {
      category_id:id,
      page:0,
      page_size:5
    };
    app.wxRequest('POST', detailsURL, detailsdata, (res) => {
      console.log(res.data)
      this.setData({
        details_list:res.data
      })
    }, (err) => {
      console.log(err.errMsg)
    })
    // 请求分类列表
    var fenleiURL = app.globalData.url + '/api/project/category_list/'
    var data = {};
    app.wxRequest('POST', fenleiURL, data, (res) => {
      console.log(res.data)
      this.setData({
        fenlei_list:res.data
      })
    }, (err) => {
      console.log(err.errMsg)
    })
    // 请求轮播列表
    var lunboURL = app.globalData.url + '/api/banner_list/'
    app.wxRequest('POST', lunboURL, data, (res) => {
      console.log(res.data)
      this.setData({
        banner_list:res.data.banner_list
      })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page=this.data.page;
    this.setData({
      page:page+1
    })
    // 请求商品列表
    var detailsURL = app.globalData.url + '/api/project/project_list/'
    let id=this.data.active+1
    var detailsdata = {
      category_id: id,
      page: this.data.page,
      page_size: 5
    };
    console.log(this.data.page)
    app.wxRequest('POST', detailsURL, detailsdata, (res) => {
      var list=this.data.details_list
      var list2 = list.concat(res.data)
      console.log(list2)
      this.setData({
        details_list: list2
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