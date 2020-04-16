//app.js
//asdadadadad
App({
  onLaunch: function (options) {
    wx.hideTabBar();
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.globalData.systemInfo = res
      }, fail(err) {
        console.log(err);
      }
    })
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            // wx.getUserInfo({
            //   success: function (res) {
            //     var objz = {};
            //     objz.avatarUrl = res.userInfo.avatarUrl;
            //     objz.nickName = res.userInfo.nickName;
            //     objz.gender = res.userInfo.gender;
            //     wx.setStorageSync('userInfo', objz);//存储userInfo
            //     console.log(res);
            //   }
            // });
            var l = that.globalData.url +'/api/get_user_wx_openid/';
            var c=res.code
            wx.request({
              url: l,
              data: {
                code:c
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              }, // 设置请求的 header  
              success: function (res) {
                var obj = {};
                obj.openid = res.data.data.openid;
                obj.session_key = res.data.data.session_key;
                wx.setStorageSync('user', obj);//存储openid  
                console.log(obj);
              },
              fail:function(err){
                console.log(err)
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  editTabbar: function () {
    var tabbar = this.globalData.tabBar;
    var currentPages = getCurrentPages();
    var that = currentPages[currentPages.length - 1];
    var pagePath = that.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    that.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    url: "https://xiaoniantou.acmgeek.com/",
    code:'',
    navHeight: 0,
    systemInfo: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/add/add",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "发起筹款"
        },
        {
          "pagePath": "/pages/personal/personal",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    }
  },
  wxRequest(method, url, data, callback, errFun) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        callback(res.data);
      },
      fail: function (err) {
        errFun(res);
      }
    })
  },
  promisify: api => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options, ...extras }, ...params)
      })
    }
  },
  //  postData(url, param){
  //   return new Promise((resolve, reject) => {
  //     wx.request({
  //       url: url,
  //       method: 'POST',
  //       data: param,
  //       success(res) {
  //         resolve(res)
  //       },
  //       fail(err) {
  //         reject(err)
  //       }
  //     })
  //   })
  // }
})
