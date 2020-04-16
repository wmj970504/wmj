// pages/fbdongtai/fbdongtai.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: null,
    plh: "font-size:12pt",
    num: 300,
    textContent:'',
    fileList: [],
    session_key:'',
    project_id:'',
    imgUrl:[]
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

  baocun: function () {
    var regs = /^[\s\S]*.*[^\s][\s\S]*$/;
    if (!regs.test(this.data.textContent)) {
      wx.showToast({
        title: '内容不能为空',
        icon: "none"
      })
    } else {
      console.log(this.data.value)
      console.log(this.data.textContent)
      console.log(this.data.fileList)
      this.fanbu()
    }
  },
  fanbu(){
    var img = this.data.imgUrl
  
    var str = img.toString()
    // for (var i = 0; i < img.length; i++) {
    //   str += img[i].path + ','
    // }  
    var url = app.globalData.url + '/api/project/add_project_news/' //发布动态
    var data = {
      project_id: this.data.project_id,
      content: this.data.textContent,
      image_urls: str,
      session_key: this.data.session_key
    }
    console.log(data)
 
    app.wxRequest('POST', url, data, res => {
      console.log(res)
      wx.showToast({
        title: '发布成功', 
      })
      setTimeout(this.fanhui, 1000)

    }, err => { console.log(err) })
  },
  afterRead: function (event) {
    const { file } = event.detail;

    console.log(file)
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

    // console.log(event.detail)
    // const { fileList = [] } = this.data;
    // fileList.push({ ...file, url: event.detail.file.path });
    // this.setData({ fileList });
    // console.log(this.data.fileList)
  },
  del: function (e) {
    console.log(e.detail.index)
    var id = e.detail.index;
    var arr = this.data.fileList;
    arr.splice(id, 1)
    var img = this.data.imgUrl
    img.splice(id,1)
    this.setData({
      fileList: arr,
      imgUrl:img
    })
    console.log(this.data.fileList)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    let id = options.project_id
    console.log(id)
    wx.getStorage({
      key: 'user',
      success: (res) =>{
        this.setData({
          session_key:res.data.session_key,
          project_id:id
        })
      }
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