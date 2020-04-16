// pages/zhichi/zhichi.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    money: null,
    zcmoney: 0,
    radio: '',
    project_id:'',
    hb:'',
    session_key:'',
    return_id:''
  },

  inputMoney:function(e){
    var money=e.detail
    this.setData({
      money:money
    })
  },

  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  onClick(event) {
    console.log(event)
    const { name, money, return_id,number} = event.currentTarget.dataset;
    console.log(name)
    if(number<=0){
      wx.showToast({
        title: '剩余份数不足！',
      })
    }else{
      if (name == 0) {
        this.setData({
          radio: name,
          money: 0,
          zcmoney: 0,
          return_id: ''
        });
      } else {
        let n = '' + name
        this.setData({
          radio: n,
          money: money,
          return_id: return_id,
          zcmoney: money
        });
      }
    }
    
  },

  toNextzhichi:function(){
    if (this.data.money == null || this.data.money<=0){
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
    }
    else if(this.data.money<this.data.zcmoney){
      wx.showToast({
        title: '小于回报金额',
      })
    }
    else{
      wx.navigateTo({
        url: '../nextzhichi/nextzhichi?return_id=' + this.data.return_id + "&zcmoney=" + this.data.money+"&project_id="+this.data.project_id,
      })
    }
  },
  gethblist:function(){
    var hbURL = app.globalData.url + '/api/project/return_raised/'
    var hbdata = {
      project_id: this.data.project_id
    };
    app.wxRequest('POST', hbURL, hbdata, (res) => {
      console.log(res.data)
      this.setData({
        hb: res.data
      })
    }, (err) => {
      console.log(err.errMsg)
    })
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
      success: (res)=> {
        this.setData({
          session_key:res.data.session_key,
          project_id: options.project_id
        })
        console.log(this.data.project_id)
        this.gethblist()
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