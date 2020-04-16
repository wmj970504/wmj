// pages/rank/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'txt'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var topic_list = JSON.parse(options.list)
    console.log(topic_list)
    this.setData({
      topic_list: topic_list
    })
  },

  // 升序
  item_up:function(e){
    var list = this.data.topic_list;
    var sort = e.currentTarget.dataset.sort
    if(sort == 0){
      wx.showToast({
        title: '已是第一位哦',
        icon:'none',
        duration:1000
      })
      return;
    }
    console.log(list)
    list[sort].sort -=1;//当前-1
    list[sort-1].sort +=1;//前一个+1
    list.sort(function (a, b) {
      return a.sort - b.sort;
    })
    this.setData({
      topic_list:list
    })
    console.log(list)
  },
  // 降序
  item_down:function(e){
    console.log(e)
    var list = this.data.topic_list;
    var sort = e.currentTarget.dataset.sort
    var length = this.data.topic_list.length
    if (sort == length-1) {
      wx.showToast({
        title: '已是最后一位哦',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log(list)
    list[sort].sort += 1;
    list[sort + 1].sort -= 1;
    console.log(list,333)
    list.sort(function (a, b) {
      return a.sort - b.sort;
    })
    this.setData({
      topic_list: list
    })
    console.log(list)
  },

  // 取消 
  cancel_rank:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  // 完成
  finish_rank:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      topic_list: this.data.topic_list
    })

    wx.navigateBack({

      delta: 1
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