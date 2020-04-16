// pages/modifyinghead/modifyinghead.js
import api from '../../utils/api.js'
import config from '../../utils/config.js';

var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    img:'../../img/modifyinghead.png'
	},
	pic: function (options) {
    var that = this;
    wx.chooseImage({
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				 var tempFilePaths = res.tempFilePaths[0]
         that.setData({
           img: tempFilePaths
         })
			}
		})
	},
  saveAvatar:function(){
    var _this = this;
    wx.uploadFile({
      url: config.HTTP_BASE_URL + '/api/user/upload_avatar/?token=' + wx.getStorageSync('token'),
      filePath: _this.data.img,
      name:'images',
      header:{
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        console.log(data);
        if (data.code == 200) {
          api.save_user_info({
             data:{
               avatar_file:data.data.file
             },
             success:(ress)=>{
                if(ress.data.code == 200){
                  wx.showToast({
                    title: '保存头像成功',
                  })
                }
             }
          })
         }
      }
    })
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    this.setData({
      img: app.globalData.userInfo.avatarUrl
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