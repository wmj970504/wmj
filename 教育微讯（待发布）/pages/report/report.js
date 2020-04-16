// pages/report/report.js
const app = getApp()
import api from "../../utils/api.js"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    info:[],
    wroning_text:'',
    is_submit:false,
    complain_imgs:[],
    complain_imgs_1:[],//提交的时候没有加域名
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    api.community_detail({
      data:{
        community_id:options.id
      },
      success:(res)=>{
          if(res.data.code == 200){
              this.setData({
                  info:res.data.data
              })
          }
      }
    })
	},
  wroning_text:function(e){
      this.setData({
          wroning_text:e.detail.value
      })
  },

  // 增加图证
  // 新增封面
  add_img: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          tem_file: tempFilePaths[0]
        })
        wx.uploadFile({
          url: app.globalData.url + 'api/community/upload_file/?token=' + wx.getStorageSync('token'),
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            console.log(res)
            const data = JSON.parse(res.data)
            var complain_imgs = that.data.complain_imgs;
            var complain_imgs_1 = that.data.complain_imgs_1;
            complain_imgs.push(data.data.file_url);
            complain_imgs_1.push(data.data.file);
            that.setData({
              complain_imgs: complain_imgs,
              complain_imgs_1: complain_imgs_1
            })
          }
        })
      }
    })
  },
  // 删除封面
  del_img: function (e) {
    var index = e.currentTarget.dataset.index;
    var complain_imgs = this.data.complain_imgs;
    var complain_imgs_1 = this.data.complain_imgs_1;
    complain_imgs.splice(index, 1);
    complain_imgs_1.splice(index, 1);
    this.setData({
      complain_imgs: complain_imgs,
      complain_imgs_1: complain_imgs_1
    })
  },


  submits:function(e){
      var that = this;
    var complain_imgs_1 = that.data.complain_imgs_1;
    var gallery = "";
    if (complain_imgs_1.length > 0){
      for (var item of complain_imgs_1) {
        gallery = gallery + item + ',';
      }
    }
      that.setData({
        is_submit:true,
      })
      api.report_community({
          data:{
            community_id:e.target.dataset.id,
            content: that.data.wroning_text,
            gallery: gallery,
          },
          success:(res)=>{
              if(res.data.code == 200){
                  wx.showToast({
                    title: res.data.msg,
                    icon:"none",
                    duration:1500
                  })
                  setTimeout(function(){
                    wx.navigateBack({
                      delta: 1
                    })
                  },1500)

              }else{

                wx.showToast({
                  title: res.data.msg,
                  icon:"none",
                  duration:1500,
                })
                setTimeout(function(){
                  that.setData({
                    is_submit: false,
                  })
                },1500)

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

	}
})