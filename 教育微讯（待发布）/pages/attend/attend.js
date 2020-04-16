// pages/attend/attend.js
const app=getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// showicon: false,
		// attention: "关注",
		fallowList:[],
		page:1,
		total:0,
		userId:0,
		isFallowArr:['关注','已关注']
	},

	showicon(e) {
		this.setData({
			showicon: true,
		})
    this.is_fan(e.currentTarget.dataset.id)
	},

	getFallow:function(){
		var that=this;
		wx.request({
			url: app.globalData.url +'/api/user/fallow_list/?token='+wx.getStorageSync('token'),
			method: "post",
			header:{
				"content-type":"application/x-www-form-urlencoded"
			},
			data:{
				session_key:wx.getStorageSync("sessionKey"),
				user_id:this.data.userId,
				type:1,
				page:1,
				page_size:10
			},
			success:function(res){
				console.log(res.data.data)
				that.setData({
					fallowList:res.data.data.list,
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			userId : options.user_id
		})
		this.getFallow();
	},

  // 取消关注
  is_fan: function (id) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/community/fallow_user/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        // session_key: wx.getStorageSync("sessionKey"),
        user_id: id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1500
          })
          that.getFallow()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1500
          })
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

	},
})