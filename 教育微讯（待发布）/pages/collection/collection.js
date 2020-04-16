// pages/collection/collection.js
import api from '../../utils/api.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    list: [],
    is_edit: 0,
    id_str: '',
    page: 1,
    page_size: 10
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var query = wx.createSelectorQuery();
		var that = this;
		query.select('.system-container').boundingClientRect(function (rect) {
			//console.log(rect.height)
			that.setData({
				height: rect.height
			})
		}).exec();
    that.get_data()
    // api.get_message_list({
    //   data: {
    //     type: 30,
    //     page: 1,
    //     page_size: 10
    //   },
    //   success: (res) => {
    //     if (res.data.code == 200) {
    //       if (res.data.data.list == '') {
    //         wx.navigateTo({
    //           url: "/pages/nothing/nothing",
    //         })
    //       }
    //       var lists = res.data.data.list;
    //       for (var i = 0; i < lists.length; i++) {
    //         lists[i]['checked'] = false;
    //       }

    //       this.setData({
    //         list: lists
    //       })
    //     }
    //   }
    // })
	},
  // 获取数据
  get_data: function () {
    api.get_message_list({
      data: {
        type: 30,
        page: this.data.page,
        page_size: this.data.page_size
      },
      success: (res) => {
        if (res.data.code == 200) {
          // 等于0  跳转缺省页
          if (res.data.data.list == '') {
            wx.navigateTo({
              url: "/pages/nothing/nothing",
            });
            return;
          }

          if (this.data.page > 1) {
            var lists = res.data.data.list;
            for (var i = 0; i < lists.length; i++) {
              lists[i]['checked'] = false;
            }
            var comment_list = this.data.list
            lists = comment_list.concat(lists)
            this.setData({
              list: lists,
              total_page: res.data.page_count
            })
          } else {
            var lists = res.data.data.list;
            for (var i = 0; i < lists.length; i++) {
              lists[i]['checked'] = false;
            }
            this.setData({
              list: lists,
              total_page: res.data.page_count
            })
          }

        }
      }
    })
  },
  select: function (e) {

    let selectValue = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;

    var lists = this.data.list;
    for (var i = 0; i < lists.length; i++) {
      if (i == index) {
        lists[i]['checked'] = !lists[i]['checked'];
      }
    }
    this.setData({
      list: lists
    })

  },
  edit: function (e) {
    this.setData({
      is_edit: 1
    })
  },
  selectAll: function (e) {
    var lists = this.data.list;
    for (var i = 0; i < lists.length; i++) {
      lists[i]['checked'] = !lists[i]['checked'];
    }
    this.setData({
      list: lists
    })
  },
  deletes: function (e) {
    //统计当前有多少个一选择
    let lists = this.data.list;
    let id_str = '';
    let list_new = [];

    for (var i = 0; i < lists.length; i++) {
      if (lists[i]['checked']) {
        if (id_str == '') {
          id_str = lists[i]['id'];
        } else {
          id_str = id_str + ',' + lists[i]['id'];
        }
      } else {
        list_new.push(lists[i])
      }
    }

    if (id_str == '') {
      wx.showToast({
        title: '请选择删除项',
      })
      return false;
    }

    this.setData({
      list: list_new
    })

    api.delete_message({
      data: {
        id_str: id_str,
        type: 30
      },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
          })
        }
      }
    })
  },
  // 下拉刷新加载下一页
  onReachBottom: function () {
    var that = this;

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
      that.get_data()
    }
  },
})