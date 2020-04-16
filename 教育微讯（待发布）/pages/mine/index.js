//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: 'Hi 开发者！',
    userInfo: {},
		user:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function() {
    
		var that=this;

    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 签到栏的显示
  sign_is_show:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/user/sign_setting/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 200) {
            that.setData({
              sign_is_show: res.data.data.sign_witch
            })
            console.log(that.data.sign_is_show)
        } 
      }
    })
  },

  onShow:function(){

    if (wx.getStorageSync('token') == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    
    var that = this;
    that.sign_is_show()
    wx.request({
      url: app.globalData.url + '/api/user/user_center/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        // session_key: wx.getStorageSync('sessionKey')
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            user: res.data.data.user_info,
            extra: res.data.data.extra
          })
        } else {
          
          wx.showToast({
            title: '未授权',
            icon: 'none'
          })
        }
      }
    })
  }
})