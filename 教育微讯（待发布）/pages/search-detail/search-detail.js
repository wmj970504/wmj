import api from '../../utils/api.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		atn: "关注",
		a: 1,
    list:[],
    search_user_info:[],
    isFallow: ["关注", "已关注"],
    good: "../../img/good.png",
    good_select: "../../img/good-yellow.png",
    keywords:''
	},

// 选择关注
  // selected: function (e) {
  //   var a = this.data.a;
  //   if (a == 1) {
  //     this.setData({
  //       atn: '已关注',
  //       'a': '2',
  //       color: '#999999',
  //       background: '#EDEDED',
  //     })
  //   }

  //   if (a == 2) {
  //     this.setData({
  //       atn: '关注',
  //       'a': '1',
  //       color: 'white',
  //       background: '#1FC987',
  //     })
  //   }

  //   var that = this;

  //   api.fallow_user({
  //     data: {
  //       user_id: e.currentTarget.dataset.id
  //     },
  //     success: (res) => {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon:"none"
  //       })
  //     }
  //   })
  // },

  // 点击关注,将data里面的值
  showicon(e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    //关注用户
    api.fallow_user({
      data: {
        "user_id": id,
      },
      success: (res) => {
        if (res.data.code == 200) {
          // 相关用户判断;
          if(that.data.search_user_info.id== id){
            var search_user_info = that.data.search_user_info
            var is_fallow = Math.abs(search_user_info.is_fallow - 1)
            console.log(is_fallow);
            search_user_info.is_fallow = is_fallow;
            that.setData({
              search_user_info: search_user_info
            })
            console.log(search_user_info)
          }
          // 相关帖子判断
          var list = that.data.list
          for (var item of list){
            if (item.user_id == id) {
              console.log(item)
              var is_fallow = Math.abs(item.is_fallow - 1)
              
              item.is_fallow = is_fallow;
              that.setData({
                list: list
              })
            }

          }


        } else if (res.data.code == 100) {
          wx.redirectTo({
            url: '../login/login',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    var that =  this;

    that.setData({
      keywords: options.keywords
    })
    api.community_list({
      data:{
        keywords: options.keywords,
        page:1,
        page_size:10
      },
       success: (res) =>{
         if(res.data.code == 200){
           var list = res.data.data.list;
           var search_user_info = res.data.data.search_user_info;
           var _fallows = [];
           var _fallowsUser = [];
           for (var i in list) {
             _fallows[list[i].id] = list[i].is_fallow;
           }
          //  for(var i in search_user_info){
          //    _fallowsUser[list[i].id] = list[i].is_fallow;
          //  }
           that.setData({
             list: list,
             fallows: _fallows,
             search_user_info: search_user_info,
            // fallowsUser:_fallowsUser
           })
         }
      }
    })
	},
  locUserInfo:function(e){
    wx.redirectTo({
      url: '../personal -center/personal -center?user_id=' + e.currentTarget.dataset.id,
    })
  },
  selectMore:function(e){
    api.search_more_users({
        
    })
  }
})