
import api from '../../utils/api.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    list:[],
    hotList:[],
    keywords_input:''
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    let that = this;
    //获取历史搜索
    api.search_history_list({
      success:(res) => {
        if(res.data.code == 200){
          that.setData({
            list: res.data.data.list,
            hotList: res.data.data.hot_kewords
          })
        }
      }
    })
	},
  bindkeywords:function(e){
    this.setData({
        keywords_input:e.detail.value
    })
  },
  searchdetail:function(){
    var that = this;
    if(that.data.keywords_input == ''){
      wx.showToast({
        title: '内容不能为空',
      })
    }else{
      wx.redirectTo({
        url: '../search-detail/search-detail?keywords=' + that.data.keywords_input,
      })
    }
  },
  clearHistory:function(){
    var that = this;
    api.delete_search_history({
      success:function(res){
        if(res.data.code == 200){
          wx.showToast({
            title: '删除成功',
          })
          that.setData({
            list:[]
          })
        }
      }
    })
  },
  clearHistoryId:function(e){
    console.log(e.currentTarget.dataset.index);
    console.log('-------');
    console.log(this.data.list);
    var that =this;
    
    api.delete_search_history({
      data:{
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
          })
          that.data.list.splice(e.currentTarget.dataset.index,1);

          console.log(that.data.list);
          //改变list数据
          that.setData({
            list: that.data.list
          })
        }
      }
    })
  },
  locaInfo:function(e){
    
    wx.redirectTo({
      url:"../search-detail/search-detail?keywords="+e.currentTarget.dataset.id
    })
  }

})