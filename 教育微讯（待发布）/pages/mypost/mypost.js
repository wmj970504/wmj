// pages/mypost/mypost.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    is_nothing:false,
    page:1,
    page_size:10
  },
  tabSelect: function(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      page: 1,
      page_size: 10,
      is_nothing: false
    })
    this.getMyPost()
  },

  // 编辑草稿
  edit_draft: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/publish/index?id=' + id,
    })
  },
  // 删除草稿
  del_draft: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title
    wx.showModal({
      title: '删除帖子',
      content: '确认要删除"' + title + '"的帖子？',
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
                setTimeout(function () {
                  that.setData({
                    page: 1,
                    page_size: 10,
                  })
                  that.getMyPost()
                }, 1500)
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




  getMyPost: function() {
    var that = this;
    if (this.data.TabCur == 0) {
      wx.request({
        url: app.globalData.url + 'api/user/my_community_list/?token=' + wx.getStorageSync('token'),
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          type: 1,
          page: that.data.page,
          page_size: that.data.page_size,
        },
        success: function(res) {
          if(res.data.code == 200){
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
              // wx.navigateTo({
              //   url: "/pages/nothing/nothing",
              // })
            }
            if(that.data.page>1){
              var list = that.data.postList;
              list = list.concat(res.data.data.list)
              that.setData({
                postList: list,
                total_page: res.data.page_count
              })
            }else{
              console.log(res.data.page_count)
              that.setData({
                postList: res.data.data.list,
                total_page: res.data.page_count
              })
            }
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:"none"
            })
          }

        }
      })
		} else if (this.data.TabCur == 30) {
			wx.request({
				url: app.globalData.url + 'api/user/my_community_list/?token=' + wx.getStorageSync('token'),
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					status: 30,
					type: 1,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
              // wx.navigateTo({
              //   url: "/pages/nothing/nothing",
              // })
            }
            if (that.data.page > 1) {
              var list = that.data.postList_30;
              list = list.concat(res.data.data.list)
              that.setData({
                postList_30: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                postList_30: res.data.data.list,
                total_page: res.data.page_count
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }

				}
			})
		} else if (this.data.TabCur == 40) {
			wx.request({
				url: app.globalData.url + 'api/user/my_community_list/?token=' + wx.getStorageSync('token'),
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					status: 40,
					type: 1,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
              // wx.navigateTo({
              //   url: "/pages/nothing/nothing",
              // })
            }
            if (that.data.page > 1) {
              var list = that.data.postList_40;
              list = list.concat(res.data.data.list)
              that.setData({
                postList_40: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                postList_40: res.data.data.list,
                total_page: res.data.page_count
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }

				}
			})
		} else if (this.data.TabCur == 10) {
			wx.request({
				url: app.globalData.url + 'api/user/my_community_list/?token=' + wx.getStorageSync('token'),
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					status: 10,
					type: 1,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
              // wx.navigateTo({
              //   url: "/pages/nothing/nothing",
              // })
            }
            if (that.data.page > 1) {
              var list = that.data.postList_10;
              list = list.concat(res.data.data.list)
              that.setData({
                postList_10: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                postList_10: res.data.data.list,
                total_page: res.data.page_count
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }

				}
			})
		}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyPost();
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
    var that = this;
    console.log(that.data.page, that.data.total_page)

    if (that.data.page >= that.data.total_page) {
      wx.showToast({
        title: '已加载完毕',
        icon: "none",
        duration: 1500
      })
    } else {
      var page = that.data.page;
      page++;
      that.setData({
        page: page
      })
      that.getMyPost()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})