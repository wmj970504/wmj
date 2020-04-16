// pages/score/score.js
import api from '../../utils/api.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
      info:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
      var that = this;
      api.my_integral({
          data:{},
          success:(res)=>{
              that.setData({
                  info:res.data.data
              })        
          }
      })
	},
  toPublish:function(){
    wx.switchTab({
      url: '../publish/index',
    })
  },
  toshare:function(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})