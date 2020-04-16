// pages/nickname/nickname.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 2,
    max: 10,
    username: "",
    text: ''
  },

  getUsername: function() {
    var that = this;
    that.setData({
      user_name: wx.getStorageSync('username')
    })
  },
  //字数限制  
  bindInput: function(e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var lenC = value.length;
    //最多字数限制
    if (lenC <= this.data.min) {
      this.setData({
        texts: "至少两个字"
      })
    } else if (lenC > this.data.min) {
      this.setData({
        texts: " "
      })
    }
    if (lenC > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      username: value,
      currentWordNumber: lenC
    });
  },
  handleSave: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'api/user/save_user_info/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        user_name: this.data.username
      },
      success: function(res) {
        if (res.data.code == 200) {
          console.log(res);
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          });
          wx.removeStorageSync('username');
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUsername();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})