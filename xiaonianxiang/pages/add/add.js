// pages/add/add.js
const $time = require('../../utils/time.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ckms:'待添加',
    ckhb:'查看',
    money:'',
    time:"",
    show: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime() + 86400000,
    p_title:'',
    p_content:'', 
    image_urls:[],
    session_key:'',
    category_id:'',
    return_ids:[],
    userInfo:''
  },

  start:function(){
    if (this.data.money == '' || this.data.time == '请选择'  || this.data.ckms== '待添加'){
      wx.showToast({
        title: '请填写必填信息',
      })
    }else{

    }   
    this.sendProject()
  },

  moneychange:function(e){
    this.setData({
      money:e.detail
    })
  },


  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  showMap: function (picker) {
    
    var dateTime = $time.formatTime(this.data.currentDate, 'Y-M-D')
    console.log(dateTime)
    this.setData({
      time:dateTime
    })
    console.log(this.data.time)
    this.setData({ show: false });
  },

  jump: function(){
    console.log(this.data.time)
    wx.navigateTo({
      url:  '/pages/choukuanhb/choukuanhb?time='+this.data.time,
    })
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  gethblist: function () { //筹款回报列表
    let url = app.globalData.url + '/api/project/project_return_list/'
    let data = { session_key: this.data.session_key }
    app.wxRequest("POST", url, data, res => {
      console.log(res)
      if(res.code!=200){
        wx.showToast({
          title: res.msg,
        })
      }
      let list = res.data
      let arr = []
      for (let key in list) {
        arr.push(list[key].return_id)
      }
      this.setData({
        return_ids: arr
      })
      console.log(this.data.return_id)
    }, err => { console.log(err) })
  },
  sendProject:function(){ //发布项目
    if (this.data.session_key == undefined || this.data.session_key == '' || this.data.session_key == null){
      wx.showToast({
        title: '请登录！',
      })
    }else{
      let url = app.globalData.url + '/api/project/send_project/'
      let img = ''
      var id = this.data.return_ids
      var id1 = id.toString()
      console.log(id1)
      if (this.data.image_urls.length > 1) {
        for (let i = 0; i < this.data.image_urls.length; i++) {
          img += this.data.image_urls[i] + ','
        }
      } else {
        img = this.data.image_urls[0]
      }
      let data = {
        category_id: this.data.category_id,
        p_amount: this.data.money,
        p_title: this.data.p_title,
        p_content: this.data.p_content,
        session_key: this.data.session_key,
        image_urls: img,
        return_ids: id1,
        p_end_time: this.data.time
      }
      console.log(data)
      app.wxRequest("POST", url, data, res => {
        console.log(res)
        if (res.code == 200) {
          wx.showToast({
            title: '发布成功',
          })
          setTimeout(this.fanhui, 1000)
        }
        if (res.code != 200) {
          wx.showToast({
            title: res.msg,
          })
        }
      }, err => { console.log(err) })
    }
    
  },
  sumtime:function(){
    let time = new Date().getTime() + 259200000 
    let day=new Date(time).getDate()
    let month=new Date(time).getMonth()+1
    let year= new Date(time).getFullYear()
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    if (parseInt(month) < 10) {
      month = '0' + month;
    }
    console.log()
    let data=year+'-'+month+'-'+day
    console.log(data)
    this.setData({
      time:data
    })
  },
  // bindGetUserInfo: function (e) {
    
  //   if (e.detail.userInfo != undefined) {
  //     this.setData({
  //       canIUse: false,
  //       userInfo: e.detail.userInfo
  //     })
  //     console.log(this.data.userInfo)
  //     wx.getStorage({
  //       key: 'user',
  //       success: res => {
  //         var obj = res.data
  //         console.log(res.data)
  //         this.setData({
  //           session_key: res.data.session_key
  //         })


  //         var userURL = app.globalData.url + '/api/check_user_openid/'
  //         var userdata = {
  //           openid: obj.openid,
  //           session_key: obj.session_key,
  //           nick_name: this.data.userInfo.nickName,
  //           avatar: this.data.userInfo.avatarUrl,
  //           gender: this.data.userInfo.gender
  //         };

  //         console.log(userdata)

  //         app.wxRequest('POST', userURL, userdata, (res) => {//登录 注册
  //           console.log(res)
  //           wx.setStorage({
  //             key: 'queren',
  //             data: 1,
  //           })
  //         }, (err) => {
  //           console.log(err.errMsg)
  //         })
  //       },
  //     })
  //   }

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getStorage({
    //   key: 'queren',
    //   success: (res) => {
    //     console.log(res)
    //     if(res.data==1){
    //       this.setData({
    //         canIUse:false
    //       })
    //     }
    //   },
    // })
    this.sumtime()
    this.setData({
      navH: app.globalData.navHeight
    });
    console.log(this.data.p_title)
    wx.getStorage({
      key: 'user',
      success:res=> {
        this.setData({
          session_key:res.data.session_key
        })
        console.log(this.data.session_key)
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