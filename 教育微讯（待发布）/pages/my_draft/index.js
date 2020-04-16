// pages/my_draft/index.js
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_page:1,
    page_size:10,
    total_page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.init_data()
  },

  // 数据初始化
  init_data:function(){
    wx.showToast({
      title: '加载中',
      icon:'loading',
      mask:true,
      duration:10000,
    })
    var that = this;
    
    if (wx.getStorageSync('token') == '') {
      wx.showToast({
        title: '您还未登录',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../login/login',
        })
      }, 1500)
    }
    wx.request({
      url: app.globalData.url + 'api/community/drafts_list/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        page: that.data.cur_page,
        page_size: that.data.page_size,
      },
      success: function (res) {
        // 如果当前页面大于1，即可翻页

        if(res.data.code == 200){
          if (that.data.cur_page > 1) {
            var list = that.data.draft_list;
            list = list.concat(res.data.data.list)
            that.setData({
              draft_list: list,
              total_page: res.data.page_count,
            })
          }else if(that.data.cur_page == 1){
            that.setData({
              draft_list: res.data.data.list,
              total_page: res.data.page_count,
            })
          }
        }else if(res.data.code == 100){
          wx.showToast({
            title: '您还未登录',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 1500)
        }
        wx.hideToast()
      },
      fail: function () {
        console.log("file3333");
      },

    })
  },
  // 编辑草稿
  edit_draft:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/publish/index?id='+id,
    })
  },
  // 删除草稿
  del_draft:function(e){
    var that = this
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title
    wx.showModal({
      title: '删除草稿',
      content: '确认要删除"' + title +'"的草稿？',
      success(res) {
        if (res.confirm) {
          if (wx.getStorageSync('token') == '') {
            wx.showToast({
              title: '您还未登录',
              icon: 'none',
              duration: 1500
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }, 1500)
          }

          wx.request({
            url: app.globalData.url + 'api/community/_delete_drafts/?token=' + wx.getStorageSync('token'),
            method: "post",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: id
            },
            success: function (res) {
              // 如果当前页面大于1，即可翻页
              if (res.data.code == 200) {
                console.log(res.data)
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1500
                })
                setTimeout(function(){
                  that.init_data()
                },1500)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1500
                })
              }
            },
            fail: function () {
              console.log("file3333");
            },

          })
         

        } else if (res.cancel) {
         
        
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
    if(this.data.total_page> this.data.cur_page){
      var cur_page = this.data.cur_page;
      cur_page++;
      this.setData({
        cur_page:cur_page,
      })
      this.init_data()
    } else if(this.data.total_page = this.data.cur_page){
      wx.showToast({
        title: '页面已加载完',
        icon:'none',
        duration:1500
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})