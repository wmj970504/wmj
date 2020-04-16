// pages/choukuan/choukuan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    navH: null,
    value: '',
    radio: '1',
    message: '',
    plh: "font-size:12pt",
    num: 300,
    isShow: '',
    textContent:'',
    fileList: [],
    session_key:'',
    imgUrl:[],
    list:[]
  },
  
  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  onClick(event) {
    console.log(event)
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name+''
    });
  },

  onBlurtitle:function(e){
    this.setData({
      value:e.detail
    })
  },
  
  inputText: function (e) {
    var value = e.detail.value
    this.setData({
      num: 300 - value.length,
      textContent: value
    })
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  
  baocun:function(){
    var regs = /^[\s\S]*.*[^\s][\s\S]*$/;
    if(!regs.test(this.data.value)){
      wx.showToast({
        title: '筹款标题目的不能为空',
        icon:"none"
      })
    }else if(!regs.test(this.data.textContent)){
      wx.showToast({
        title: '详情不能为空',
        icon:"none"
      })
    }else{
     console.log(this.data.name)
      console.log(this.data.value)
      console.log(this.data.textContent)
      console.log(this.data.fileList)

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        p_title: this.data.value,
        p_content: this.data.textContent,
        image_urls: this.data.imgUrl,
        category_id: this.data.radio,
        ckms:'已添加'
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);

    }
  },
  
  
 getfl(){
   let url = app.globalData.url +'api/project/category_list/'
   app.wxRequest("POST",url,{},res=>{
     console.log(res)
     this.setData({
       list: res.data
     })
   },err=>{})
   
 },

  afterRead:function(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    console.log(file)
    wx.uploadFile({
      url: 'https://xiaoniantou.acmgeek.com/api/project/upload_image/',
      filePath: file.path,
      name: 'image_file',
      formData: { session_key: this.data.session_key, dir:'project' },
      header:{
        'Content-Type':'multipart/form-data'
      },
      success:(res)=> {
        // 上传完成需要更新 fileList
        let req=JSON.parse(res.data)
        console.log(req)
        let arr=req.data.img_path;
        let arr2=this.data.imgUrl;
        arr2.push(arr)
        console.log(arr2)
        this.setData({
          imgUrl:arr2
        })
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: req.data.img_url});
        this.setData({ fileList });
        console.log(this.data.fileList)      
      },
      fail: function (err) {
        console.log(err)
      }          
    });
  },
  del:function(e){
    console.log(e.detail.index)
    var id = e.detail.index;
    var arr = this.data.fileList;
    arr.splice(id, 1)
    let arr2= this.data.imgUrl
    arr2.splice(id,1)
    this.setData({
      fileList: arr,
      imgUrl:arr2,
    })
    console.log(this.data.fileList)
    console.log(this.data.imgUrl)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    this.getfl()
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