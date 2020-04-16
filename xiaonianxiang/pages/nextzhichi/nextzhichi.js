// pages/nextzhichi/nextzhichi.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    name:'',
    phone:'',
    address:'',
    note:'',
    isShow:'',
    money:'',
    project_id:'',
    session_key:'',
    return_id:''
  },

  wxzhifu:function(arr){
    wx.requestPayment({
      timeStamp: arr.timeStamp,
      nonceStr: arr.nonceStr,
      package: arr.package,
      signType: arr.signType,
      paySign: arr.paySign,
      success:res=>{
        wx.navigateBack({
          delta: 2
        })
      },
      fail:err=>{
        wx.showToast({
          title: '支付失败',
        })
      }
    })
   
  },
  zhifu:function(){ //支付
    let ex = /^1[3-9]\d{9}$/
    console.log(this.data.isShow)
    if (this.data.isShow == '' || this.data.isShow==undefined){
      if (this.data.name == undefined) {
        wx.showToast({
          title: '姓名为空！',
        })
      } else if (!ex.test(this.data.phone)) {
        wx.showToast({
          title: '手机号不正确！',
        })
      } else if (this.data.address == undefined) {
        wx.showToast({
          title: '地址为空！',
        })
      } else {
        let url = app.globalData.url + 'api/project/support_project/'
        let data = {
          session_key: this.data.session_key,
          project_id: this.data.project_id,
          user_name: this.data.name,
          contact: this.data.phone,
          user_address: this.data.address,
          user_remark: this.data.note,
          return_id: this.data.return_id,
          amount:this.data.money
        }
        console.log(data)
        app.wxRequest('POST', url, data, res => { 
          console.log(res)
          
          if(res.code==200){
            this.wxzhifu(res.data)
          }else{
            wx.showToast({
              title: res.msg
            })
          }
           
          
        }, err => console.log(err))
      }     
    }else{
      let url = app.globalData.url + 'api/project/support_project/'
      let data = {
        session_key: this.data.session_key,
        project_id: this.data.project_id,
        contact: this.data.phone,
        return_id:this.data.return_id,
        amount: this.data.money
      }
      console.log(data)
      app.wxRequest('POST',url,data,res=>{
        console.log(res)
        
        if (res.code == 200) {
          this.wxzhifu(res.data)
        }else{
          wx.showToast({
            title: res.msg
          })
        }
      },err=>console.log(err))
    }
  },
  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onChange:function(e){
    console.log(e.currentTarget.id)
    if (e.currentTarget.id==1){
      this.setData({
        name:e.detail
      })
    }else if (e.currentTarget.id==2){
      this.setData({
        phone:e.detail
      })
    }else if (e.currentTarget.id==3){
      this.setData({
        address:e.detail
      })
    }else if (e.currentTarget.id==4){
      this.setData({
        note:e.detail
      })
    }
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    console.log(options)
    if (options.return_id == undefined || options.return_id==''){
      this.setData({
        isShow:'hidden'
      })
    }
    this.setData({
      money:options.zcmoney,
      return_id:options.return_id
    })
    console.log(this.data.return_id)
    wx.getStorage({
      key: 'user',
      success: (res)=> {
        this.setData({
          session_key:res.data.session_key,
          project_id:options.project_id
        })
        console.log(this.data.project_id)
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