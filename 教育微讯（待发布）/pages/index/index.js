import api from '../../utils/api.js';
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'P22BZ-YQJ6I-EK2GW-5ZARD-DI5GK-T4BVC'
});
Page({
  data: {
    isFallow: ["关注", "已关注"],
    id: '',
    TabCur: 0,
    cardCur: 0, 
    bannerList: [],
    list: [],
    good: "../../img/good.png",
    good_select: "../../img/good-yellow.png",
    page: 1,
    total: 0,
    hot_user_list: [],
    listzero: [],
    is_show:false,
    fallowss:[],
    ccc:'',
    is_empty:false,
    category_id:-3,
    is_more:1
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },

//跳转图片上的链接
  go_detail:function(e){
    
    var link_url = e.currentTarget.dataset.link_url;
    console.log(link_url)
    wx.navigateTo({
      url: link_url,
    })
  }, 


// 获取地理位置
get_loc:function(){

  var that = this;
  wx.getLocation({
    type: "wgs84",
    success: (res) => {
      var latitude = res.latitude;
      var longitude = res.longitude;
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        }, success: function (res) {
          //console.log(res['result']['address_component']['city']);
        }, fail: function (res) {
          console.log(res);
        }, complete: function (res) {
          wx.setStorageSync('province', res['result']['address_component']['province'])
          wx.setStorageSync('city', res['result']['address_component']['city']);
          that.init_data()
        }
      })
    }
  })

},



  //初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },

  onLoad: function (options) {
    this.get_loc()
    console.log(wx.getStorageSync('city'));
  },

  onShow:function(){
    console.log(111)
    if(this.data.category_id == 0){
      
      this.init_data();
    }else{
      this.get_simple()
    }

  },
  // 数据初始化
  init_data:function(){
    console.log(this.data.category_id)
    var that = this;

    wx.request({
      url: app.globalData.url + '/api/index_info/?token=' + wx.getStorageSync('token'), //接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        //session_key: wx.getStorageSync('sessionKey'),
        province_name: wx.getStorageSync('province'),
        city_name: wx.getStorageSync('city')
      },
      success: function (res) {

        if (res.data.code == 200) {
          var navlist = res.data.data.list;
          that.setData({
            navlist: navlist
          });
          that.get_simple();
        }

      }
    })

    
  },


  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  tabSelect(e) {
    var city_id;
    var index = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.city_id !=''){
      city_id =  e.currentTarget.dataset.city_id
    }else{
      city_id = ''
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      page:1
    })
      this.setData({
        list: []
      })
      wx.showLoading({
        title: '加载中...',
      })

      var that = this;
      
      that.setData({
        category_id: e.currentTarget.dataset.cid,
      })
      api.community_list({
        data: {
          category_id: e.currentTarget.dataset.cid,
          city_id: city_id,
          page:that.data.page
        },
        success: (res) => {
          wx.hideLoading()
          if (res.data.code == 200) {
            // list
              if (res.data.data.list.length) {
                that.setData({
                  is_empty: false
                })
              } else {
                that.setData({
                  is_empty: true
                })
              }
           

            // 热门
            if (res.data.data.hot_user_list || res.data.data.banner_list){
              this.setData({
                list: res.data.data.list,
                swiperList: res.data.data.banner_list,
                hot_user_list: res.data.data.hot_user_list,
                is_more:res.data.is_more,
              })
            }else{
              this.setData({
                list: res.data.data.list,
                is_more: res.data.is_more,
              })
            }

          }else{
            wx.showToast({
              title: res.data.msg,
            })
          }
        }
      })

    
  },
  // 点击关注,将data里面的值
  showicon(e) {
    let that = this;
    //关注用户
    api.fallow_user({
      data: {
        "user_id": e.currentTarget.dataset.id,
      },
      success: (res) => {
        if (res.data.code == 200) {
          // 这是热门用户列表
          if (e.currentTarget.dataset.type == 'hot'){
              let info_id = e.currentTarget.dataset.cid;
              let lists = that.data.hot_user_list;
              let is_statuss = 1;
              for (var i = 0; i < lists.length; i++) {
                if (lists[i].id == info_id) {
                  lists[i].is_fallow == 1 ? is_statuss = 0 : is_statuss = 1;
                  that.setData({
                    ['hot_user_list[' + i + '].is_fallow']: is_statuss,
                  })
                }
              }
          }else{
            // 非热门用户
              let info_id = e.currentTarget.dataset.cid;
              let lists = that.data.list;
              let is_status = 1;
              for (var i = 0; i < lists.length; i++) {
                if (lists[i].id == info_id) {
                  lists[i].is_fallow == 1 ? is_status = 0 : is_status = 1;
                  that.setData({
                    ['list[' + i + '].is_fallow']: is_status,
                  })
                }
              }
          }
          

          // 再请求一次数据
          that.get_simple()
          // api.community_list({
          //   data: {
          //     category_id: that.data.category_id,
          //   },
          //   success: (res) => {
          //     if (res.data.code == 200) {
          //       if (res.data.data.list.length) {
          //         that.setData({
          //           is_empty: false
          //         })
          //       } else {
          //         that.setData({
          //           is_empty: true
          //         })
          //       }
          //       if (res.data.data.hot_user_list) {
          //         this.setData({
          //           list: res.data.data.list,
          //           hot_user_list: res.data.data.hot_user_list
          //         })
          //       } else {
          //         this.setData({
          //           list: res.data.data.list,
          //         })
          //       }

          //     } else {
          //       wx.showToast({
          //         title: res.data.msg,
          //       })
          //     }
          //   }
          // })



        } else if (res.data.code == 100) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },

  // 单独拿去数据
  get_simple:function(){
    var that = this
    api.community_list({
      data: {
        category_id: that.data.category_id,
        page:that.data.page
      },
      success: (res) => {
        if (res.data.code == 200) {

          if (res.data.data.list.length) {
            that.setData({
              is_empty: false
            })
          } else {
            that.setData({
              is_empty: true
            })
          }
          if (that.data.is_more == 1){
            if (that.data.page > 1) {
              if (res.data.data.hot_user_list || res.data.data.banner_list) {
                that.setData({
                  list: that.data.list.concat(res.data.data.list),
                  swiperList: res.data.data.banner_list || '',
                  hot_user_list: res.data.data.hot_user_list || '',
                  is_more: res.data.is_more,
                })
              } else {
                console.log(that.data.list, res.data.data.list.concat(that.data.list))
                that.setData({
                  list: that.data.list.concat(res.data.data.list),
                  is_more: res.data.is_more,
                })

              }
            } else {
              if (res.data.data.hot_user_list || res.data.data.banner_list) {
                this.setData({
                  list: res.data.data.list,
                  swiperList: res.data.data.banner_list || '',
                  hot_user_list: res.data.data.hot_user_list || '',
                  is_more: res.data.is_more,
                })
              } else {
                this.setData({
                  list: res.data.data.list,
                  is_more: res.data.is_more,
                })
              }
            }
          }



        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  // 搜索
  searched(e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 点赞
  changeimg: function (e) {
    var that = this;
    // that.setData({
    // 	good: "../../img/good-yellow.png"
    // })

    //点赞
    api.add_star({
      data: {
        "community_id": e.target.dataset.id,
      },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon:"none",
            duration:1500,
          })
          let info_id = e.target.dataset.id;
          let lists = that.data.list;
          for (var i = 0; i < lists.length; i++) {
            if (lists[i].id == info_id) {
              if (lists[i].is_stared == 1) {
                that.setData({
                  ['list[' + i + '].is_stared']: 0,
                  ['list[' + i + '].star_count']: lists[i].star_count - 1
                })

              } else {
                that.setData({
                  ['list[' + i + '].is_stared']: 1,
                  ['list[' + i + '].star_count']: lists[i].star_count + 1
                })
              }

            }
          }
        } else if (res.data.code == 100) {
          console.log(11)
          wx.navigateTo({

            url: '/pages/login/login',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }

      }
    })
  },

  // 点击发布
  onTabItemTap(item) {
      if(item.text == '发布'){
          this.setData({
              is_show:true
          })
      }else{
        this.setData({
          is_show: false
        })
      }
  },

  quit:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })

  },

  onReachBottom:function(){
    console.log('到底')
    let that = this;
    //获取下拉数据
    if(that.data.is_more == 1){
      var page = that.data.page;
      page++;
      console.log(page)
      that.setData({
        page:page
      })
      that.get_simple();
    }else{
      wx.showToast({
        title: '已加载完毕~',
        icon:"none",
        duration:1500
      })
    }
   
  },
  // getgoods:function(){
  //   var that = this;

  //   var limit = 5;
  //   var offset = that.data.offset;
  //   if (!offset) offset = 1;
  //   var startpage = limit * offset;

  //   wx.request({
  //     url: app.globalData.url + '/api/community/community_list/?token=' + wx.getStorageSync('token'),
  //     method: "post",
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       page: 1,
  //       page_size: startpage,
  //     },
  //     success: function (res) {
  //       var len = res.data.data.banner_list.length
  //       var is_more = res.data.is_more
  //       var swiperList =  res.data.data.banner_list;
  //       if (len == 0) {
  //         that.setData({
  //           title: "已经到底了~",
  //           hidden: true
  //         });
  //         return false;

  //       } else if (is_more == 0) {

  //         var list = res.data.data.list
          
  //         that.setData({
  //           bannerList : res.data.data.banner_list,
  //           list : res.data.data.list,
  //           hot_user_list : res.data.data.hot_user_list,
  //           title: "已经到底了~",
  //           swiperList: swiperList,
  //           listzero: list,
  //           hidden: true
  //         });
  //       } else {
  //         var list = res.data.data.list


  //         that.setData({
  //           offset: offset + 1,
  //           bannerList : res.data.data.banner_list,
  //           list : res.data.data.list,
  //           listzero: list,
            
  //         });

  //         that.setData({
  //           swiperList: swiperList
  //         })
  //       }


  //     }
  //   })
  // },
  onPullDownRefresh:function(){
    if(this.data.is_more_page){
      that
    }else{
      wx.showToast({
        title: '已加载完毕！',
        icon:"none",
        duration:1500
      })
    }
  },
})
