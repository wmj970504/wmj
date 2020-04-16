// pages/proposal/proposal.js
const app=getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		min:0,
		max:400
	},

	bindTextarea:function(e){
		var value = e.detail.value;
		var len = parseInt(value.length);
		if (len > this.data.max) return;
		this.setData({
			currentWordNumber: len, //当前字数
			content: value
		});
	},

	submit:function(){
		console.log(this.data.content)
		var that=this;
		wx.request({
			url: app.globalData.url +'api/user/add_feedback/?token='+wx.getStorageSync('token'),
			method:"post",
			header:{
				"content-type":"application/x-www-form-urlencoded"
			},
			data:{
				content:this.data.content
			},
			success:function(res){
				console.log(res.data.data);
				wx.showToast({
					title: res.data.msg,
					icon:'none'
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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