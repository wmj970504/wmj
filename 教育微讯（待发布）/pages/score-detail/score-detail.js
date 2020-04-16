// pages/score-detail/score-detail.js
import api from '../../utils/api.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TabCur: "",
		scrollLeft: 0,
		topinfo:[
			{
				name: "全部"
			},
			{
				name:"获取"
			},
			{
				name:"使用"
			}
		],
    info:[]
	},
	tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
    //change info
    var that = this;
    //全部积分
    api.my_integral_list({
      data: {
        type: e.currentTarget.dataset.name
      },
      success: (res) => {
        that.setData({
          info: res.data.data.list
        })
      }
    })
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
      var that =this;
      //全部积分
      api.my_integral_list({
        data:{
          type:0
        },
        success:(res)=>{
            that.setData({
                info:res.data.data.list
            })
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

	}
})