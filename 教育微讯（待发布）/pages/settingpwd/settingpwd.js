// pages/settingpwd/settingpwd.js
import WxValidate from '../../utils/WxValidate.js'
const app=getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		form:{
			oldPassword:'',
			password: '',
			rePassword: '',
		},
	},
	bindOldPassword:function(e){
		this.setData({
			oldPassword:e.detail.value
		})
	},
	bindPassword: function (e) {
		this.setData({
			password: e.detail.value
		})
	},
	bindRePassword: function (e) {
		this.setData({
			rePassword: e.detail.value
		})
	},
	//报错 
	showModal(error) {
		wx.showModal({
			content: error.msg,
			showCancel: false,
		})
	},
	//验证函数
	initValidate() {
		const rules = {
			oldPassword: {
				rangelength: [6,18]
			},
			password: {
				required: true,
				rangelength: [6, 18]
			},
			rePassword: {
				required: true,
			}
		}
		const messages = {
			oldPassword: {
				rangelength: "请输入6-18位密码"
			},
			password: {
				required: '请填写新密码',
				rangelength: "请输入6-18位密码"
			},
			rePassword: {
				required: '请再次填写新密码',
			}
		}
		this.WxValidate = new WxValidate(rules, messages)
	},
	//调用验证函数
	submit: function (e) {
		var that=this;
		// this.initValidate();
		if(this.data.rePassword!=this.data.password){
			wx.showModal({
				title: '两次密码不一致',
				showCancel: false,
			})
			return false
		}
		const params = e.detail.value
		//校验表单
		if (!this.WxValidate.checkForm(params)) {
			const error = this.WxValidate.errorList[0]
			this.showModal(error)
			return false
		}
		wx.request({
			url: app.globalData.url +'api/user/save_password/?token='+wx.getStorageSync('token'),
			method:"post",
			header:{
				"content-type":"application/x-www-form-urlencoded"
			},
			data:{
				old_password:this.data.oldPassword,
				password: this.data.password,
				re_password: this.data.rePassword,
			},
			success:function(res){
				console.log(res)
				wx.showToast({
					title: res.data.msg,
					icon:"none"
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.initValidate();
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