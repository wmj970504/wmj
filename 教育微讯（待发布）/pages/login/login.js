// pages/login/login.js
import api from '../../utils/api.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    phone: '',
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    code: '',
    second: 60,
    pass: ''
	},
  bindphone: function (res) {
    this.setData({
      phone: res.detail.value
    })
    if (res.detail.value != '') {
      this.setData({
        hidden: false,
        btnValue: '验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  getCode(e) {
    var that = this;
    wx.showToast({
      title: '验证码已发送',
    })
    api.get_verify_code({
      data: {
        mobile: that.data.phone
      }, success: (res) => {
        if (res.data.code == 200) {
          that.timer();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
      }
    })
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  bindPass: function (res) {
    this.setData({
      pass: res.detail.value
    })
  },
  bindCodeInput: function (res) {

    this.setData({
      code: res.detail.value
    })
  },
  submitTo: function (e) {
    var that = this;
    if (that.data.phone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon:"none"
      })
    } else {
      //提交登录  
      api.login({
        data: {
          mobile: that.data.phone,
          password: that.data.pass,
          code: that.data.code
        }, success: (res) => {
          if (res.data.code == 200) {
            //保存当前用户token
            wx.setStorageSync("token", res.data.data.token)
            wx.showToast({
              title: '登录成功',
            })
            // wx.switchTab({
            //   url: '../index/index',
            // })
            wx.navigateBack({
              delta:1
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:"none"
            })
          }
        }
      })
    }
  },
  onLoad:function(e){
      // var is_login = wx.getStorageSync('token');
      // if(is_login != ''){
      //   wx.switchTab({
      //     url: '../index/index',
      //   })
      // }
  }
})