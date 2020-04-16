 // pages/more/more.js
const app = getApp()
import api from '../../utils/api.js';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    user_id:'',
    list:[],
    num:0,
    type:'',
    content:'',
    parent_id:''
  },
	onLoad: function (options) {
    var that = this
    //获取用户ID
    that.setData({
      user_id: wx.getStorageSync('user_info')['id'],
      num: Number(options.index)+1
    })
    
    var community_id = options.user_id
    // 获取点击的index
    var num = options.index;
    // console.log(community_id,"上一个的id",options.index,"获取点击的index")
    //评论列表
    console.log(options.id);
    api.comment_detail({
      data:{
        comment_id:options.id
      },
      success:(res)=>{
        that.setData({
          list: res.data.data
        })
      }
    })
    // wx.request({
    //   url: app.globalData.url + 'api/community/comment_list/?token=' + wx.getStorageSync('token'), //接口地址
    //   method: 'post',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: {
    //     //session_key: wx.getStorageSync('sessionKey'),
    //     community_id:100,
    //   },
    //   success: function (res) {

    //     if (res.data.code == 200) {
    //       //  把第一条评论数据取出来
    //      var evaluate_list = res.data.data;
    //      // 判断评论是否显示
    //       that.setData({
    //         more_list: evaluate_list.list[num],
    //       })
    //     }

    //   }
    // })

	},
  selectthis:function(res){
    this.setData({
      is_select:!this.data.is_select
    })
  },
  replay_comment:function(e){
    console.log(e.currentTarget.dataset.id);
    //回复评论
    api.add_comment_discuss({
      data:{
        comment_id: e.currentTarget.dataset.id,
        content:''
      },
      success:(res)=>{
        
      }
    })
  },
  showModal(e) {

    if (e.currentTarget.dataset.type == 'small') {
      this.setData({
        type: e.currentTarget.dataset.type,
        parent_id: e.currentTarget.dataset.id
      })
    }
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  comment_text:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  publish_common:function(e){
    var that = this;
    if (e.currentTarget.dataset.type == 'small') {
      api.add_comment_discuss({
        data: {
          comment_id: e.target.dataset.cid,
          content: that.data.content,
          parent_id: that.data.parent_id
        },
        success: function (res) {
          if (res.data.code == 200) {
            //改变list数据
            wx.showToast({
              title: '评论成功'
            })
            that.setData({
              modalName: null,
              content: ' '
            })
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }

        }
      })
    } else {
      api.add_comment_discuss({
        data: {
          comment_id: e.target.dataset.cid,
          content: that.data.content,
          parent_id: e.target.dataset.id
        },
        success: function (res) {
          if (res.data.code == 200) {
            //改变list数据
            wx.showToast({
              title: '评论成功'
            })
            that.setData({
              modalName: null,
              content: ' '
            })
            
          } else {
            wx.showToast({
              title: res.data.msg,
            })
          }

        }
      })
  }
  }
})