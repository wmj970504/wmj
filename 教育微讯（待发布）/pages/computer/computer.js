import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getScancode: function () {
    if(wx.getStorageSync('token') == ''){
      wx.redirectTo({
        url: '../login/login',
      })
      return false;
    }
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (e) => {
        console.log('扫码返回的参数-----',e);
          //请求获取code
        api.qrcode_login({
          data:{
            code:e.result
          },
          success:(e)=>{
            wx.showToast({
              title: e.data.msg,
            })
          }
        })
      }
    })

  }
})