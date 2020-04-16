// pages/renzheng/renzheng.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    session_key:'',
    value: '',
    columns: ['身份证', '护照', '其他'],
    zhengjian: '身份证',
    show: false,
    beimian: '../../images/WechatIMG18.jpeg',
    zhengmian: '../../images/WechatIMG19.jpeg',
    shouchi: '../../images/WechatIMG20.jpeg',
    phones: ['+86', '+852', '+853', '+886'],
    phone: '+86',
    uname: '',
    sfzid: '',
    phonenum: '',
    imgUrl:[],
    smstatus:false
  },

  onChange(e) {
    // event.detail 为当前输入的值
    if (e.currentTarget.id == 'uname') {
      this.setData({
        uname: e.detail
      })
    } else if (e.currentTarget.id == 'sfzid') {
      this.setData({
        sfzid: e.detail
      })
    } else {
      this.setData({
        phonenum: e.detail
      })
    }
  },
  onChance(event) {
    const { picker, value, index } = event.detail;
    if (event.currentTarget.id == 'zj') {
      this.setData({
        zhengjian: value
      })
    } else {
      this.setData({
        phone: value
      })
    }
    this.onClose()
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  shangchuan: function (e) {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success:  (res)=> {

        wx.uploadFile({
          url: 'https://xiaoniantou.acmgeek.com/api/project/upload_image/',
          filePath: res.tempFilePaths[0],
          name: 'image_file',
          formData: { session_key: this.data.session_key, dir: 'project' },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: (res) => {
            // 上传完成需要更新 fileList
            let req = JSON.parse(res.data)
            console.log(req)
            let arr = req.data.img_path;
            let arr2 = this.data.imgUrl;
            arr2.push(arr)
            console.log(arr2)
            this.setData({
              imgUrl: arr2
            })           
          },
          fail: function (err) {
            console.log(err)
          }
        });

        if (e.currentTarget.id == "beimian") {
          _this.setData({
            beimian: res.tempFilePaths[0]
          })
        } else if (e.currentTarget.id == "zhengmian") {
          _this.setData({
            zhengmian: res.tempFilePaths[0]
          })
        } else { 
          _this.setData({
            shouchi: res.tempFilePaths[0]
          })
        }
      }
    })
  },
  tijiao: function () {
    if (this.data.smstatus==1){
      return
    }
    var isSfz = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var isPhone = /^1[3456789]\d{9}$/;
    if (this.data.uname == '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1500
      })
    } else if (!isSfz.test(this.data.sfzid)) {
      wx.showToast({
        title: '证件号码不正确',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.beimian == '../../images/WechatIMG18.jpeg') {
      wx.showToast({
        title: '请上传证件背面照',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.zhengmian == '../../images/WechatIMG19.jpeg') {
      wx.showToast({
        title: '请上传证件正面照',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.shouchi == '../../images/WechatIMG20.jpeg') {
      wx.showToast({
        title: '请上传手持证件照',
        icon: 'none',
        duration: 1500
      })
    } else if (!isPhone.test(this.data.phonenum)) {
      wx.showToast({
        title: '手机号码不正确 ',
        icon: 'none',
        duration: 1500
      })
    } else {
      console.log(this.data.uname, this.data.sfzid, this.data.beimian, this.data.zhengmian, this.data.shouchi, this.data.phonenum)
      let img = this.data.imgUrl
       let str=img.toString()
      let url = app.globalData.url +'/api/add_verify/'
      let data = { 
        session_key:this.data.session_key,
        true_name: this.data.uname,
        card: this.data.sfzid,
        mobile: this.data.phonenum,
        images:str
        }
        app.wxRequest("POST",url,data,res=>{
          console.log(res)
          if(res.code==200){
            wx.showToast({
              title: '提交成功'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        },err=>{console.log(err)})
    }
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  shiming:function(){
    let url = app.globalData.url +"/api/get_userinfo/";
    let data = { session_key:this.data.session_key}
    app.wxRequest("POST",url,data,res=>{
      console.log(res)
      if (res.data.is_verify==1) {
        this.setData({
          smstatus: true
        })
      }
      },err=>{console.log(err)})
    
   
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
      success: (res)=>{
        this.setData({
          session_key:res.data.session_key
        })
        this.shiming()
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