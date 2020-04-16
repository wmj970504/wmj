// pages/mycollection/mycollection.js
import api from '../../utils/api.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    isFallow: ["关注", "已关注"],
		TabCur: 0,
		scrollLeft: 0,
		ask_nav: [
			{
				name: "全部"   
			},
			{
				name: "贴子"
			},
			{
				name: "问答"
			}
		],
    good: "../../img/good.png",
    good_select: "../../img/good-yellow.png",
    list:[]
	},
  showicon(e) {
    let that = this;
    //关注用户
    api.fallow_user({
      data: {
        "user_id": e.currentTarget.dataset.id,
      },
      success: (res) => {
        var info_id = e.currentTarget.dataset.cid;
        var lists = that.data.list;
        var _fallows = [];
        var is_status = 1;
        var _fallows = [];
        
        for (var i = 0; i < lists.length; i++) {
          for (var j = 0; j < lists[i]['list-'].length;j++){
            if (lists[i]['list-'][j].id == info_id) {
                lists[i]['list-'][j].is_fallow == 1 ? is_status = 0 : is_status = 1;
                that.setData({
                  ['list[' + i + '].list-.[' + j + '].is_fallow']:is_status,
                })
            }
            _fallows[lists[i]["list-"][j].id] = that.data.list[i]["list-"][j].is_fallow;
          }
          that.setData({
            fallows: _fallows
          })
        }
      }
    })
  },
	tabSelect(e) {
    var that = this;
    that.setData({
			TabCur: e.currentTarget.dataset.name,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
    api.favorite_list({
      data:{
        type: e.currentTarget.dataset.name
      },
      success: (res) => {
        that.setData({
          list: res.data.data
        })
      }
    })
	},
  changeimg: function (e) {
    var that = this;
    //点赞
    api.add_star({
      data: {
        "community_id": e.target.dataset.id,
      },
      success: (res) => {
        let info_id = e.target.dataset.id;
        let lists = that.data.list;

        for (var i = 0; i < lists.length; i++) {
          for (var j = 0; j < lists[i]['list-'].length;j++){
            if (lists[i]['list-'][j].id == info_id) {
              if (lists[i]['list-'][j].is_stared == 1) {
                that.setData({
                  ['list[' + i + '].list-.['+j+'].is_stared']: 0,
                  ['list[' + i + '].list-.[' + j + '].star_count']: lists[i]['list-'][j].star_count-1
                })

              } else {
                that.setData({
                  ['list[' + i + '].list-.[' + j +'].is_stared']: 1,
                  ['list[' + i + '].list-.[' + j +'].star_count']: lists[i]['list-'][j].star_count+1
                })
              }  
            }
          }
        }
      }
    })
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
      var that = this;
      api.favorite_list({
          success:(res)=>{
            //console.log(res.data.data[0]['list-']);
            that.setData({
                  list:res.data.data
              })
            var list = res.data.data;
            var _fallows = [];
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < list[i]['list-'].length; j++) {
                _fallows[list[i]['list-'][j].id] = list[i]['list-'][j].is_fallow;
              }
            }
            that.setData({
              fallows: _fallows
            })
            if (res.data.data == '') {
              wx.navigateTo({
                url: "/pages/nothing/nothing",
              })
            }
          }
      })
	},
  locationuserinfo:function(e){
      wx.navigateTo({
        url: '../personal -center/personal -center?user_id='+e.currentTarget.dataset.id,
      })
  },
  delete_fav:function(e){
    var that = this;
      api.add_favorite({
        data:{
          community_id: e.currentTarget.dataset.id,
        },
        success:(res)=>{
          if(res.data.code == 200){
             wx.showToast({
               title: '删除成功',
             })
            that.data.list.splice(e.currentTarget.dataset.index,1);
            that.setData({
              list:that.data.list
            })
          }
        }
      })
  }
})