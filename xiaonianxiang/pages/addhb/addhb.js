// pages/addhb/addhb.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    session_key:'',
    num:300,
    textContent:"",
    moneyContent:0,
    shuliangContent:0,
    deadline_day:30,
    checked: true,
    project_id:''
  },

  onChange({ detail }) {
    this.setData({ checked: detail });
    console.log(detail)
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  inputText:function(e){
    var value=e.detail.value
    this.setData({
      num:300-value.length,
      textContent:value
    })
    console.log(this.data.textContent)
  }, 
  
  inputMoney:function(e){
    var value=e.detail
    this.setData({
      moneyContent:value
    })
    console.log(this.data.moneyContent)
  },
  
  inputShuliang:function(e){
    console.log(e)
    let value=parseInt(e.detail)
    console.log(typeof value)
    if(false){
      wx.showToast({
        title: '请输入数字'
      })
    }else{    
      this.setData({
        shuliangContent: value
      })
      console.log(this.data.shuliangContent)
    }  
  },
  inputday:function(e){
    let value = parseInt(e.detail)
    if (false) {
      wx.showToast({
        title: '请输入数字'
      })
    } else {
      this.setData({
        deadline_day: value
      })
      console.log(this.data.deadline_day)
    }  
  },
  
  save: function () {
    
    let is_express=this.data.checked ? 1:0
    let url = app.globalData.url + "/api/project/add_project_return/";
    let data = {
      session_key: this.data.session_key,
      content: this.data.textContent,
      amount: this.data.moneyContent,
      number: this.data.shuliangContent,
      deadline_day: this.data.deadline_day,
      is_express: is_express,
      project_id:this.data.project_id
    }
    app.wxRequest('POST',url,data,res=>{
      console.log(res)
      if(res.code==200){
        wx: wx.showToast({
          title: '保存成功'
        })
        setTimeout(()=>this.fanhui(),1000)
      }else{
        wx.showToast({
          title:res.msg
        })
      }
      
    },err=>{console.log(err)})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight,
      project_id:options.project_id
    });

    wx.getStorage({
      key: 'user',
      success: res => {
        this.setData({
          session_key: res.data.session_key
        })
        console.log(this.data.session_key)
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