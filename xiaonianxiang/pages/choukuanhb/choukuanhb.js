// pages/choukuanhb/choukuanhb.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    list:[],
    session_key:'',
    new_time:'',
    return_id:[]
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  //  wx.navigateTo({
  //    url: '/pages/add/add',
  //  })
  },

  gethblist:function(){ //筹款回报列表
    let url = app.globalData.url +'/api/project/project_return_list/'
    let data = { session_key: this.data.session_key}
    app.wxRequest("POST",url,data,res=>{
      console.log(res)
      let list=res.data
      let arr = []
      for(let key in list){
        list[key].deadline_day=this.exchangetime(list[key].deadline_day)
        arr.push(list[key].return_id)
      }     
      this.setData({
        list:list,
        return_id:arr
      })
      console.log(this.data.return_id)
    },err=>{console.log(err)})
  },
  exchangetime:function(day){
    var t = this.data.new_time
    var t1=t.replace(/-/g,' ')  
    var t2=Date.parse(t1)
    var t = t2 + day*86400000;
    console.log(new Date(t).getFullYear() + '-' + (new Date(t).getMonth()+1)+ '-' + new Date(t).getDate())
    return  new Date(t).getFullYear() +'-'+(new Date(t).getMonth()+1)+'-'+new Date(t).getDate()    
  },
  del:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.return_id
    let url = app.globalData.url +'/api/project/delete_project_return/'
    let data = { session_key:this.data.session_key,return_id:id}
    app.wxRequest('POST',url,data,res=>{
      console.log(res)
      let list1=this.data.list
      list1.splice(e.currentTarget.dataset.index,1)
      this.setData({
        list:list1
      })
    },err=>{console.log(err)})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options !== undefined){
      this.setData({
        new_time: options.time
      })
      this.exchangetime()
    }
    
    this.setData({
      navH: app.globalData.navHeight
    });
    wx.getStorage({
      key: 'user',
      success: res => {
        this.setData({
          session_key:res.data.session_key
        })
        this.gethblist()
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
    this.onLoad()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})