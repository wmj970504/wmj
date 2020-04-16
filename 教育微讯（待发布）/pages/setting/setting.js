// pages/setting/setting.js
import api from '../../utils/api.js';
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
  quit:function(){
    api.logout({
        success:(res)=>{
          if(res.data.code == 200){
            //清空缓存 
            wx.setStorageSync('userInfo', '');
            app.globalData.userInfo = '';
            wx.setStorageSync('token', '');
            
            wx.showToast({
              title: '退出成功',
            }),
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
    })
    wx.setStorageSync('token', '');
  }
})