// pages/choukuanxq/choukuanxq.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    list:'',
    yc: "",
    shuju: 10,
    zctag:0,
    hbtag:1,
    dttag:0,
    show: false,
    gradientColor: {
      '0%': '#FCC635',
      '100%': '#FF9518'
    },
    project_id:'',
    session_key:''
  },
  tiaozhuan:function(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.url+'?project_id='+this.data.project_id
    })
  },  
  showPopup() {
    this.setData({ show: true, yc: "hidden"});
  },

  onClose() {
    this.setData({ show: false, yc: ""});
  },
    
  jieshu:function(){

    wx.showModal({
      title: '提示',
      content: '确定要结束吗',
      success:res=>{
        if (res.confirm) {
          let url = app.globalData.url + '/api/project/end_project/'
          let data = {
            project_id: this.data.project_id,
            session_key: this.data.session_key
          }
          app.wxRequest("POST", url, data, res => {
            console.log(res)
            wx.showToast({
              title: '筹款已结束'
            })
          }, err => { console.log(err) })
        }
      }
    }) 
  },
  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getdetails:function(){
    let url = app.globalData.url +'/api/project/detail/';
    let data = { session_key:this.data.session_key,project_id:this.data.project_id}
    app.wxRequest("POST",url,data,res=>{
      console.log(res)
      this.setData({
        list:res.data
      })
      },err=>{console.log(err)})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    let id=options.project_id
    console.log(id)
    wx.getStorage({
      key: 'user',
      success: (res)=> {
        this.setData({
          session_key: res.data.session_key,
          project_id: id
        })  
        this.getdetails()     
      },
    })
},  /**
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})