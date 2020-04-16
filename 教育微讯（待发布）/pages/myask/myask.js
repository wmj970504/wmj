// pages/mypost/myask.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
	data: {
		TabCur: 0,
		scrollLeft: 0,
    is_nothing: false,
    page: 1,
    page_size: 10
	},
	tabSelect: function (e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
      page: 1,
      page_size: 10,
      is_nothing:false,
      
		})
		this.getMyAsk()
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
      title: '删除问答',
      content: '确认要删除"' + title + '"的问答？',
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
                  that.getMyAsk()
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



	getMyAsk: function () {
		var that = this;
		if (this.data.TabCur == 0) {
			wx.request({
				url: app.globalData.url + 'api/user/my_community_list/?token=' + wx.getStorageSync('token'),
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					type: 2,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
            }
            if (that.data.page > 1) {
              var list = that.data.askList;
              list = list.concat(res.data.data.list)
              that.setData({
                askList: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                askList: res.data.data.list,
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
		} else if (this.data.TabCur == 30) {
			wx.request({
				url: app.globalData.url + 'api/user/my_community_list/?token=' + wx.getStorageSync('token'),
				method: 'post',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					status: 30,
					type: 2,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {

          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
            }
            if (that.data.page > 1) {
              var list = that.data.askList_30;
              list = list.concat(res.data.data.list)
              that.setData({
                askList_30: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                askList_30: res.data.data.list,
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
					type: 2,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {

          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
            }
            if (that.data.page > 1) {
              var list = that.data.askList_40;
              list = list.concat(res.data.data.list)
              that.setData({
                askList_40: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                askList_40: res.data.data.list,
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
					type: 2,
          page: that.data.page,
          page_size: that.data.page_size,
				},
				success: function (res) {

          if (res.data.code == 200) {
            if (res.data.data.list == '') {
              that.setData({
                is_nothing: true
              })
            }
            if (that.data.page > 1) {
              var list = that.data.askList_10;
              list = list.concat(res.data.data.list)
              that.setData({
                askList_10: list,
                total_page: res.data.page_count
              })
            } else {
              that.setData({
                askList_10: res.data.data.list,
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
	onLoad: function (options) {
		this.getMyAsk();
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
      that.getMyAsk()
    }
	},

  /**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {

	}
})