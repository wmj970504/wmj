// pages/register/register.js
import api from '../../utils/api.js'
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
    pass:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
  bindphone:function(res){
      this.setData({
        phone: res.detail.value
      })
    if (res.detail.value != '') {
      this.setData({
        hidden: false,
        btnValue: '验证码'
      })
    }else {
      this.setData({
        hidden: true
      })
    }
  },
  getCode(e) {
    var that = this;
    api.get_verify_code({
      data:{
        mobile:that.data.phone
      },success:(res)=>{
          if(res.data.code == 200){
            that.timer();
          }else{
            wx.showToast({
              title:res.data.msg,
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
  bindPass:function(res){
      this.setData({
        pass:res.detail.value
      })
  },
  bindCodeInput:function(res){
    this.setData({
      code: res.detail.value
    })
  },
  submitTo:function(e){
      var that = this;
      if(that.data.phone == '' || that.data.pass == '' || that.data.code == ''){
          wx.showToast({
            title: '内容不能为空',
          })
      }else{
        //提交注册
        api.register({
          data:{
            mobile:that.data.phone,
            password: that.data.pass,
            code: that.data.code
          },success:(res)=>{
            if(res.data.code == 200){
                //保存当前用户token
                wx.setStorageSync("token", res.data.data.token)
                wx.showToast({
                  title: '注册成功',
                })
                wx.navigateTo({
                  url: '../login/login',
                })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          }
        })
      }
  }
})