// pages/zhanghao/zhanghao.js
var area=require('../../utils/area.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    areaList:{},
    show:false,
    dizhi:"请选择",
    myphone:"去绑定",
    myschool:"去添加",
    mycompany:"去添加",
    myjianjie:'去添加',
    mylabel:'去添加',
    area:[]
  },
  getjianjie:function(){
    let url = app.globalData.url +'/api/show_profile/'
    let data = { session_key:this.data.session_key}
    app.wxRequest("POST",url,data,res=>{
      console.log(res)
      if(res.data.content!=undefined){
        this.setData({
          myjianjie: res.data.content
        })
      }
      
    },err=>{console.log(err)})
  },
  getlabel: function () {
    let url = app.globalData.url + '/api/show_profile/'
    let data = { session_key: this.data.session_key }
    app.wxRequest("POST", url, data, res => {
      console.log(res)
      this.setData({
        myjianjie: res.data.content
      })
    }, err => { console.log(err) })
  },
  showMap: function(picker){
    let diqu = picker.detail.values;
    console.log(diqu);
    if(diqu[0].code==""){
      this.onClose();
    }else{
      let b ="";
      for(let a=0;a<diqu.length;a++){
        b+=diqu[a].name+" "
      }
      this.addStation(diqu)
      this.setData({
        dizhi:b
      })
     
    }
    console.log(this.data.dizhi)
    this.onClose();
   
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  addStation:function(d){//地区提交
    wx.getStorage({
      key: 'user',
      success: (res)=> {
        console.log(res)
        let url = app.globalData.url +'/api/add_address/'
        let data = { session_key: res.data.session_key, province_id: d[0].code, city_id: d[1].code, area_id: d[2].code}
        app.wxRequest("post",url,data,res=>{
          console.log(res)
        },err=>{console.log(err)})
      },
    })
},

  getuserinfo:function(){ //获取基础信息
    wx.getStorage({ 
      key: 'user',
      success: (res)=>{
        let url = app.globalData.url + '/api/get_user_info/'
        let data = { session_key: res.data.session_key}
        app.wxRequest("POST",url,data,res=>{
          console.log(res)
          if(res.data.mobile!=undefined){
              this.setData({
                myphone: res.data.mobile
              })
          }
          if (res.data.loction != undefined || res.data.loction != ""){
            this.setData({
              dizhi: res.data.loction,
            })
          }
          if(res.data.company!=undefined){
            this.setData({
              dizhi: res.data.compan,
            })
          }
          if (res.data.school != undefined || res.data.school !=""){
            this.setData({
              myschool: res.data.school,              
            })
          }if(res.data.label[0]!=undefined){
            this.setData({
              mylabel: res.data.label
            })
          }
         
          
        },err=>{consle.log(err)})
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      areaList: area.default,
      navH: app.globalData.navHeight
    })
    wx.getStorage({
      key: 'user',
      success: (res)=>{
        this.setData({
          session_key:res.data.session_key
        })
       this.getjianjie()
      },
    })
    this.getuserinfo()
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