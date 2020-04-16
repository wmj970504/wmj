// pages/leixing/leixing.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    num: 300,
    textContent: '',
    fileList: [],
    session_key:'',
    imgUrl:[]
  },

  inputText: function (e) {
    var value = e.detail.value
    this.setData({
      num: 300 - value.length,
      textContent: value
    })
  },

  fabu: function () {
    console.log(this.data.textContent)
  },

  fanhui: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  baocun: function () {
    var regs = /^[\s\S]*.*[^\s][\s\S]*$/;
    if (!regs.test(this.data.textContent)) {
      wx.showToast({
        title: '详情不能为空',
        icon: "none"
      })
    } else {
      console.log(this.data.textContent)
      console.log(this.data.fileList)
      let img =this.data.imgUrl;
      var str=img.toString();
      console.log(str)
      let url = app.globalData.url + '/api/project/add_confirm_raised/'
      let data = { session_key: this.data.session_key, content: this.data.textContent, project_id: this.data.project_id, image_urls: str }
      console.log(data)
      app.wxRequest("POST", url, data, res => {
        console.log(res)
        if(res.code=200){
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(this.fanhui,1000)
        }     
      },
        err => { console.log(err) })
    }
    
  },

  afterRead: function (event) {
    const { file } = event.detail;
    wx.uploadFile({
      url: 'https://xiaoniantou.acmgeek.com/api/project/upload_image/',
      filePath: file.path,
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
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: req.data.img_url });
        this.setData({ fileList });
        console.log(this.data.fileList)
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  del: function (e) {
    console.log(e.detail.index)
    var id = e.detail.index;
    var arr = this.data.fileList;
    arr.splice(id, 1)
    let arr2 = this.data.imgUrl
    arr2.splice(id, 1)
    this.setData({
      fileList: arr,
      imgUrl: arr2,
    })
    console.log(this.data.imgUrl)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    if (options.id==1){
      this.setData({
        title:"大病救助"
      })
    }else if (options.id==2){
      this.setData({
        title:"动物保护"
      })
    }else if (options.id==3){
      this.setData({
        title:"灾难救助"
      })
    }
    let id=options.project_id
    wx.getStorage({
      key: 'user',
      success: (res) => {
        this.setData({
          session_key: res.data.session_key,
          project_id:id
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