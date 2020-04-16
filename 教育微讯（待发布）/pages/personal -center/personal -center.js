// pages/personal -center/personal -center.js
const app = getApp()
import api from '../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
     atn: "关注",
     a: 1,
    post: [{
        id: 1,
        type: 'default',
        title: "贴子"
      },
      {
        id: 2,
        type: 'default',
        title: "问答"
      }
    ],
    userId: 0,
    TabCur: 0,
    scrollLeft: 0,
    page: 1,
    total: 0,
    postList: [],
    good: "../../img/good.png",
    good_select: "../../img/good-yellow.png",
  },
  tabSelect(e) {
    var index = e.currentTarget.dataset.id;
    console.log(index)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  selected: function (e) {
  	var a = this.data.a;
  	if (a == 1) {
  		this.setData({
  			atn: '已关注',
        'a': '2',
        color: '#999999',
        background: '#EDEDED',
  		})
  	}

  	if (a == 2) {
  		this.setData({
  			atn: '关注',
        'a': '1',
        color: 'white',
        background: '#1FC987',
  		})
  	}

    var that = this;

    api.fallow_user({
      data:{
        user_id: that.data.user.id
      },
      success:(res)=>{
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },
  getUser: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'api/user/user_detail/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        session_key: wx.getStorageSync('sessionKey'),
        user_id: this.data.userId
      },
      success: function(res) {
        console.log(res.data.data);
        that.setData({
          user: res.data.data
        })
      }
    })
  },
  getPost: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'api/user/user_community_list/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        session_key: wx.getStorageSync('sessionKey'),
        user_id: this.data.userId,
        page: 1,
        page_size: 10
      },
      success: function(res) {
        console.log(res.data.data.list);
        that.setData({
          postList: res.data.data.list
        });
        if (res.data.data.list[0]['is_fallow'] == 1) {
          that.setData({
            atn: '已关注',
            'a': '2',
            color: '#999999',
            background: '#EDEDED',
          })
        } else {
          that.setData({
            atn: '关注',
            'a': '1',
            color: 'white',
            background: '#1FC987',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(wx.getStorageSync('token') == ''){
      wx.showToast({
        title: '请登录后操作',
      })
    }
    
    console.log(options.user_id);
    this.setData({
      userId: options.user_id
    })
    this.getUser();
    this.getPost();

    var that =this;
    //获取当前登录用户id
    api.user_center({
      success: (res) => {
        that.setData({
          user_id: res.data.data.user_info.id
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})