// pages/authorization/authorization.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  login: function() {
    var that = this;
    wx.login({
      success: function(res) {
        
        //发送请求
        wx.request({
          url: app.globalData.url +'/api/account/get_user_wx_openid/', //接口地址
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
          },
          success: function(res) {
            if(res.data.code == 200){
              var openid = res.data.data.openid;
              var session_key = res.data.data.session_key;
              wx.request({
                url: app.globalData.url +'/api/account/check_user_openid/',
                data: { openid},
                method:"post",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success:function(res){
                  if(res.data.code == 200){
                    wx.setStorage({
                      key: 'token',
                      data: res.data.data.token
                    });
                    wx.switchTab({
                      url: '../index/index?token=' + res.data.data.token,
                    })
                  } else if (res.data.code == 400) {
                    wx.getUserInfo({
                      lang: "zh_CN",
                      success: function (res) {
                        wx.request({
                          url: app.globalData.url + '/api/account/get_user_wx_info/',
                          data: { sessionKey: session_key, encrypdata: res.encryptedData, ivdata: res.iv },
                          method:"post",
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success:function(res){
                            if(res.data.code == 200){
                              wx.request({
                                url: app.globalData.url + '/api/account/add_user_info_openid/',
                                method:"post",
                                header: {
                                  'content-type': 'application/x-www-form-urlencoded'
                                },
                                data:{
                                  openid,
                                  session_key,
                                  nickName: res.data.data.nickName,
                                  gender: res.data.data.gender,
                                  avatarUrl: res.data.data.avatarUrl,
                                  country: res.data.data.country,
                                  province: res.data.data.province,
                                  city: res.data.data.city
                                },
                                success:function(res){
                                  if(res.data.code == 200){
                                    wx.setStorageSync("token", res.data.data.token)
                                    wx.switchTab({
                                      url: '../index/index?token=' + res.data.data.token,
                                    })
                                  }
                                },
                              })
                            }

                          }
                        })
                      }
                    })

                  }
                }
              })
            }
            // console.log(res);
            // var openid = res.data.data.openid;
            // var session_key = res.data.data.session_key;
            // var nickName = that.data.nickName;
            // var gender = that.data.gender;
            // var avatarUrl = that.data.avatarUrl;
            // var country = that.data.country;
            // var province = that.data.province;
            // var city = that.data.city;

            // wx.getUserInfo({
            //   lang: 'zh_CN',
            //   success: function(res) {
            //     console.log(res.userInfo);
            //     that.data.nickName = res.userInfo.nickName,
            //       that.data.gender = res.userInfo.gender,
            //       that.data.avatarUrl = res.userInfo.avatarUrl,
            //       that.data.country = res.userInfo.country,
            //       that.data.province = res.userInfo.province,
            //       that.data.city = res.userInfo.city

            //     if (res.userInfo.province == "重庆") {
            //       that.data.city = "重庆市";
            //     }

            //     if (res.userInfo.province == "北京") {
            //       that.data.city = "北京市";
            //     }

            //     if (res.userInfo.province == "天津") {
            //       that.data.city = "天津市";
            //     }

            //     if (that.data.province == "上海") {
            //       that.data.city = "上海市";
            //     }
            //     console.log(that.data.city);
            //     that.setData({
            //         nickName: that.data.nickName,
            //         gender: that.data.gender,
            //         avatarUrl: that.data.avatarUrl,
            //         country: that.data.country,
            //         province: that.data.province,
            //         city: that.data.city
            //       }),
            //       wx.request({
            //         url: app.globalData.url + 'api/account/check_user_openid/',
            //         method: 'post',
            //         header: {
            //           'content-type': 'application/x-www-form-urlencoded'
            //         },
            //         data: {
            //           openid: openid,
            //         },
            //         success: function(res) {
            //           if(res.data.code == 200){
            //             wx.switchTab({
            //               url: '../index/index',
            //             })
            //             console.log(res.data.data);
            //             console.log("success");
            //             wx.setStorage({
            //               key: 'token',
            //               data: res.data.data.token
            //             });
            //           }else if(res.data.code == 400){
            //             wx.request({
            //               url: app.globalData.url +'/api/account/add_user_info_openid/',
            //               method:'post',
            //               data:{open}
            //             })
            //           }

            //         },
            //         fail: function(res) {
            //           // console.log("fail");
            //           // wx.switchTab({
            //           //   url: '../index/index',
            //           // })
            //         }
            //       })
            //   }
            // })

            // wx.setStorage({
            //   key: 'sessionKey',
            //   data: res.data.data.session_key,
            //   success: function(res) {
            //     console.log('保存sessionkey')
            //   }
            // })


            // wx.setStorage({
            //   key: 'openid',
            //   data: res.data.data.openid,
            //   success: function(res) {
            //     console.log('保存openid')
            //   }
            // })


            // if (true) {
            //   wx.setStorage({
            //     key: 'unionid',
            //     data: res.data.data.unionid,
            //     success: function(res) {
            //       console.log('保存unionid')
            //     }
            //   })
            // }
          },

        })
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err);
      }
    })
  },

  //用户跳过授权
  skip:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData)
      
      if(wx.getStorageSync('token') != ''){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
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