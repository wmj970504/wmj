// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{title:1},
    navH:null,
    avatarUrl:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:[],
    usernum:[],
    session_key:'',
    renzheng:''
  }, 

  tozh:function(){
    wx.navigateTo({
      url: '../zhanghao/zhanghao',
    })
  },

  toPages:function(e){
    var obj = {};
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../'+url,
    })
  },
  getStorageUser:function(){
    var obj={}
    wx.getStorage({
      key: 'user',
      success: function (res) {
        obj = res.data
        console.log(obj)
      },
    })
  },
  getStorageInfo:function(){
    var objz = {};
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        objz = res.data
        console.log(res.data)
      }
    })   
  },
  setStatus: function () {
    let id = this.data.usernum.is_verify;
    if (id == 0) {
      this.setData({
        renzheng: '去验证'
      })
    } else if (id == 1) {
      this.setData({
        renzheng: '已通过'
      })
    } else if (id == 2) {
      this.setData({
        renzheng: '已驳回'
      })
    } else if (id == 3) {
      this.setData({
        renzheng: '审核中'
      })
    }
  },
  getuserinfo2:function(){
    var url = app.globalData.url + '/api/get_userinfo/' //获取用户信息
    var data = { session_key: this.data.session_key }
    console.log(data.session_key)
    app.wxRequest("POST", url, data,
      res => {
        console.log(res)
        wx.setStorage({
          key: 'queren',
          data: 1,
        })
        if (res.code == 200) {
          this.setData({
            usernum: res.data,
            avatarUrl: res.data.avatar_file
          })
          this.setStatus()//调用认证状态
        }
      })
  },
  getcode:function(){
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: (res) =>{
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                objz.gender = res.userInfo.gender;
                wx.setStorageSync('userInfo', objz);//存储userInfo
                console.log(res);
              }
            });
            var u = that.globalData.url +'/api/get_user_wx_openid/';
            var c=res.code
            wx.request({
              url: u,
              data: {
                code:c
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              }, // 设置请求的 header  
              success:  (res) =>{
                var obj = {};
                obj.openid = res.data.data.openid;
                obj.session_key = res.data.data.session_key;
                wx.setStorageSync('user', obj);//存储openid  
                console.log(obj);
                this.setData({
                  session_key: res.data.data.session_key
                })
                this.getuserinfo2()
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
  
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo != undefined) {
      this.setData({
        canIUse: false,
        userInfo: e.detail.userInfo
      })
      console.log(this.data.userInfo)
      wx.getStorage({
        key: 'user',
        success: res => {
          var obj = res.data
          console.log(res.data)
          this.setData({
            session_key: res.data.session_key
          })


          var userURL = app.globalData.url + '/api/check_user_openid/'
          var userdata = {
            openid: obj.openid,
            session_key: obj.session_key,
            nick_name: this.data.userInfo.nickName,
            avatar: this.data.userInfo.avatarUrl,
            gender: this.data.userInfo.gender
          };

          console.log(userdata)

          app.wxRequest('POST', userURL, userdata, (res) => {//登录 注册

            var url = app.globalData.url + '/api/get_userinfo/' //获取用户信息
            var data = { session_key: obj.session_key }
            console.log(data.session_key)
            app.wxRequest("POST", url, data,
              res => {
                console.log(res)

                if (res.code == 200) {
                  this.setData({
                    usernum: res.data
                  })
                  this.setStatus()//调用认证状态
                }
              }),
              err => { console.log(err) }

          }, (err) => {
            console.log(err.errMsg)
          })
        },
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'user',
      success: (res) => {
        this.setData({
          session_key:res.data.session_key
        })
       this.getuserinfo2()
      },
    })
    app.editTabbar();
    this.setData({
      navH: app.globalData.navHeight
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res=>{
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;
              objz.gender = res.userInfo.gender;
              wx.setStorageSync('userInfo', objz);//存储userInfo
              console.log(objz);
              this.setData({
                avatarUrl:res.userInfo.avatarUrl
              })
            }
          });
          
          // var obj = {}
          // wx.getStorage({
          //   key: 'user',
          //   success:  res=> {
          //     obj = res.data
          //     console.log(this.data.userInfo)

              
          //     var userURL = app.globalData.url + '/api/check_user_openid/'
          //     var userdata = {
          //       openid: obj.openid,
          //       session_key: obj.session_key,
          //       nick_name: this.data.userInfo.nickName,
          //       avatar: this.data.userInfo.avatarUrl,
          //       gender: this.data.userInfo.gender
          //     };
          //     console.log(userdata)

          //   },
          // })
          
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})