//index.js
import api from '../../utils/api.js';
//获取应用实例
const app = getApp()

Page({
  data: {
      data_count : []
  },
  //事件处理函数
  onShow: function () {
    if (wx.getStorageSync('token') == '') {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    //数据统计
    api.message_center({
      success:(res) => {
        console.log(res);
        if(res.data.code == 200){
            this.setData({
                data_count:res.data.data
            })
        }
      }
    })
  },
  
  location_to_system: function () {//跳转到系统通知
    //获取系统通知数据
    api.get_message_list({
      data: {
        type: 10,
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          }else{
            wx.navigateTo({
              url: "/pages/system/system",
            })
          }
        }
      }
    })
  },
  
  location_to_shenhe: function () {//跳转到审核
    //获取系统通知数据
    api.get_message_list({
      data: {
        type: 40,
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/examine/examine",
            })
          }
        }
      }
    })
  },
  
  location_to_punlun: function () {//跳转到评论
    api.community_message_list({
      data: {
        type: 'comments',
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/commentreply/commentreply",
            })
          }
        }
      }
    })
  },
  
  location_go_top: function () {//跳转到置顶
    api.get_message_list({
      data: {
        type: 20,
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/gotop/gotop"
            })
          }
        }
      }
    })
  },

  location_fabulous:function(){//点赞
    api.community_message_list({
      data: {
        type: 'stars',
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/fabulous/fabulous"
            })
          }
        }
      }
    })
  },
  location_share:function(){//分享
    api.get_message_list({
      data: {
        type: 50,
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/shareattend/shareattend"
            })
          }
        }
      }
    })
  },
  location_collection:function(){//收藏
    api.get_message_list({
      data: {
        type: 30,
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/collection/collection"
            })
          }
        }
      }
    })
  },
  //删除
  location_del:function(){
    api.get_message_list({
      data: {
        type: 60,
        page: 1,
        page_size: 10
      },
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            })
          } else {
            wx.navigateTo({
              url: "/pages/delete/delete"
            })
          }
        }
      }
    })
  }

})
