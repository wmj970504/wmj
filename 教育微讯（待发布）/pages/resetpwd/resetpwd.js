// pages/resetpwd/resetpwd.js
import api from '../../utils/api.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    pass:'',
    repass:''
	},
  onLoad:function(options){
    this.setData({
      mobile: options.mobile
    })
  },
  bindpass:function(e){
    this.setData({
      pass:e.detail.value
    })
  },
  bindrepass: function (e) {
    this.setData({
      repass: e.detail.value
    })
  },
  subto:function(e){
    var that = this;
    if(that.data.pass != that.data.repass){
      wx.showToast({
        title: '两次输入密码不一致',
      })
      return false;
    }else{
      api.reset_password({
        data:{
          mobile:that.data.mobile,
          password:that.data.pass,
          re_password:that.data.repass
        },
        success:(res)=>{
          if(res.data.code == 200){
            wx.showToast({
              title: '重置密码成功',
            })
            wx.redirectTo({
              url: '../login/login',
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:"none",
              duration:1500
            })
          }
        }
      })
    }
  }

})