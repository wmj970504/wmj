// pages/xmzhichizhe/xmzhichizhe.js
// import Dialog from '../../@vant/weapp/dialog/dialog';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    activeNames: ['1'],
    show: false,
    actions: [
      {name: '确认兑现'}
    ],
    zc:'',
    session_key:''
  },
  getUserInfo(event) {
    console.log(event);
  },
  duihuanhb: function (e){
    console.log(e)
    if (e.currentTarget.dataset.return_status==0){ 
    let user_id = e.currentTarget.dataset.id
      let user_return_id = e.currentTarget.dataset.return_id
      
    wx.showModal({
      title: '',
      content: '兑现回报后，支持者将收到确认短信，如未确认，7天后自动确认',
      success:res=>{
        if (res.confirm){
          let url = app.globalData.url + '/api/project/cash_project_return/'
          let data = { session_key: this.data.session_key, user_id: user_id, user_return_id: user_return_id }
          console.log(data)
          app.wxRequest("POST", url, data, res => {
            console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '兑换成功',
              })
            }else{
              wx.showToast({
                title: res.msg,
              })
            }
          }, err => console.log(err))
        }     
      }
    })
    }
  },
  setshow:function(){
    this.setData({show:true})
  },
  onClose() {
    this.setData({ close: false });
  },
  showPopup() {
    this.setData({ show: true });

  },

  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
    this.setData({ show: false });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    wx.getStorage({
      key: 'user',
      success: (res) => {
        console.log(res)
        this.setData({
          session_key: res.data.session_key
        })
        var zcURL = app.globalData.url + '/api/project/user_project_return/'
        var zcdata = {
          session_key: this.data.session_key,
          project_id: options.project_id,
        };
        app.wxRequest('POST', zcURL, zcdata, (res) => {
          console.log(res)
          this.setData({
            zc: res.data
          })
        }, (err) => {
          console.log(err.errMsg)
        })
      },
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})