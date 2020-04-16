// pages/details/details.js
const app = getApp()

const wxGetImageInfo =app.promisify(wx.getImageInfo)
const wxCanvasToTempFilePath = app.promisify(wx.canvasToTempFilePath)
const wxSaveImageToPhotosAlbum = app.promisify(wx.saveImageToPhotosAlbum)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvas:true,
    session_key:'',
    navH: null,
    yc:"",
    gradientColor: {
      '0%': '#FCC635',
      '100%': '#FF9518'
    },
    hidden:"展开详情", 
    show: false,
    istrue:true,
    zan: 0,
    cai: 0,
    zanIcon: '../../images/zan.png',
    caiIcon: '../../images/cai.png',
    details:{},
    pl:[],
    showInput: false,
    inputMessage:'',
    project_id:'',
    color:'',
    comment_id:'',
    to_user_id: '',
    nickname:'',
    code:''
  },


  //点击出现输入框
  showInput: function () {
    this.setData({
      showInput: true
    })
    console.error('show+++++++++++')
  },
  //隐藏输入框
  onHideInput: function () {
    setTimeout(()=>{
      this.setData({
        showInput: false,
        comment_id: '',
        to_user_id: '',
        nickname: ''
      })
    },1000)
    
    console.error('hide+++++++++++')
  },
  inputtext:function(e){
    console.log(e)
    this.setData({
      inputMessage:e.detail.value
    })
  },
  showPopup() {
    this.setData({ 
      show: true ,
      yc:"hidden"
    });
  },
  bangzhu:function(){
    wx.navigateTo({
      url: '/pages/question/question',
    })
  },
  send:function(){ //发评论
    if(this.data.inputMessage!==undefined){
      let url = app.globalData.url +'/api/project/add_user_comment/'
      let data = { 
          session_key: this.data.session_key,
          project_id: this.data.project_id, 
          content:this.data.inputMessage,
          to_user_id:this.data.to_user_id,
          comment_id:this.data.comment_id
         }
         app.wxRequest('POST',url,data,res=>{
           console.log(res)
           if(res.code==200){
             this.getpl()
             wx.showToast({
               title: '评论成功',
             })
           }else{
             wx.showToast({
               title: res.msg,
             })
           }
         },err=>{})
    }else{
      wx.showToast({
        title: '内容不能为空',
      })
    }
  },
  setcomment_id:function(e){ //获取评论id
    console.log(e)
    this.setData({
      comment_id: e.currentTarget.dataset.comment_id
    })
    console.log(this.data.comment_id)
  },
  //回复他人
  pinglun:function(e){      
    let tid = e.currentTarget.dataset.tid
    console.log(tid)
    this.setData({
      to_user_id:tid.user_id,
      nickname:tid.nick_name
    })
    console.log(this.data)
    this.showInput()
  },
  onClose() {
    wx.hideLoading()
    this.setData({ 
      show: false ,
      yc: ""
    });
  },

 

  change:function(){
    if (this.data.hidden =="展开详情"){
      this.setData({
        hidden:"收起详情"
      })
    }else{
      this.setData({
        hidden:"展开详情"
      })
    }
  },

  fanhui:function(){
    
    if (this.data.code == 100){     
      wx.switchTab({
        url: '/pages/index/index',
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
    
  },

  toZhichi:function(){
    if(this.data.details.status==2){
      wx.showToast({
        title: '筹款已结束',
      })
    }else{
      wx.navigateTo({
        url: '../zhichi/zhichi?project_id=' + this.data.project_id + '&status=' + this.data.details.status,
      })
    }
    
  },

  toxinxi:function(){
    wx.navigateTo({
      url: '../others/others?user_id='+this.data.details.user.user_id
    })
  },

  click: function (e) {
    console.log(e.currentTarget)
    console.log(e)
    let comment_id=e.currentTarget.dataset.comment_id
    if (e.currentTarget.dataset.icon == "zan") {

      let url = app.globalData.url + '/api/favorite/do_favorite/'
      console.log(url)
      let data = { type: 'comment_top', association_id: comment_id , session_key: this.data.session_key }
      console.log(data)
      app.wxRequest('POST', url, data, res => { console.log(res); this.getpl() },err=>console.log(err))

      // if (this.data.zanIcon == "../../images/zan1.png") {
      //   var zan = this.data.zan - 1
      //   this.setData({
      //     zan: zan,
      //     zanIcon: '../../images/zan.png'
      //   })
      // } else {
      //   var zan = this.data.zan + 1
      //   this.setData({
      //     zan: zan,
      //     zanIcon: '../../images/zan1.png'
      //   })
      // }
    } else {
      let url = app.globalData.url + '/api/favorite/do_favorite/'
      let data = { type: 'comment_down', association_id: comment_id, session_key: this.data.session_key }
      console.log(data)
      app.wxRequest('POST', url, data, res => { console.log(res); this.getpl() }, err => console.log(err))
      // if (this.data.caiIcon == "../../images/cai1.png") {
      //   var cai = this.data.cai - 1
      //   this.setData({
      //     cai: cai,
      //     caiIcon: '../../images/cai.png'
      //   })
      // } else {
      //   var cai = this.data.cai + 1
      //   this.setData({
      //     cai: cai,
      //     caiIcon: '../../images/cai1.png'
      //   })
      // }
    }
  },
  shoucang:function(){ //收藏
     console.log(123)
    let url = app.globalData.url +'/api/favorite/do_favorite/';
    let data = { type:'project', association_id: this.data.details.project_id, session_key:this.data.session_key}
    app.wxRequest("POST",url,data,res=>{
      console.log(res)
      if (res.msg == "取消收藏成功"){
        this.setData({
          color:''
        })
      }else{
        this.setData({
          color: 'red'
        })
      }
      wx.showToast({
        title: res.msg,
      })
    },err=>{console.log(err)})
  },
  // 请求详情
  getdetails:function(){
    // 请求详情
    wx.getStorage({
      key: 'project_id',
      success: (res) =>{
       let id= res.data
        var xqURL = app.globalData.url + '/api/project/detail/'
        var xqdata = {
          project_id: id,
          session_key: this.data.session_key
        };
        app.wxRequest('POST', xqURL, xqdata, (res) => {
          console.log(res)
          if (res.code != 200) {
            wx.showToast({
              title: res.msg,
            })
          }
          if (res.data.is_favorite == 1) {
            this.setData({
              color: 'red'
            })
          }
          this.setData({
            details: res.data
          })
        }, (err) => {
          console.log(err.errMsg)
        })
      },
    })
   
  },
  //请求评论
  getpl:function(id){
    // 请求评论
    wx.getStorage({
      key: 'project_id',
      success: (res) =>{
        var plURL = app.globalData.url + '/api/project/get_user_comment/'
        var pldata = {
          session_key: this.data.session_key,
          project_id: res.data
        };
        app.wxRequest('POST', plURL, pldata, (res) => {
          console.log(res)
          if(res.code==100){
            this.setData({
              code:100
            })
          }
          this.setData({
            pl: res.data
          })
        }, (err) => {
          console.log(err.errMsg)
        })
      },
    })
   
  },
  ctx_img1(){
    wx.showLoading({
      title: '正在保存中。。',
    })
    wx.getImageInfo({
      src: 'https://xiaoniantou.acmgeek.com/upload/image/20200319213851.png',
      success:res=>{
        console.log(res)
        const ctx = wx.createCanvasContext('shareCanvas')
        ctx.drawImage(res.path, 37, 0, 600, 1000)
        this.ctx_img2(ctx)
      }
    })
  },
  ctx_img2(ctx){
    wx.getImageInfo({
      src: this.data.details.image[0],
      success:res=>{
        console.log(res)
        ctx.drawImage(res.path, 87, 150, 500, 300)
        this.ctx_img3(ctx)
      }
    })
  },
  ctx_img3(ctx){
    wx.getImageInfo({
      src: this.data.details.user.avatar_file,
      success: res => {
        console.log(res)
        ctx.drawImage(res.path, 87, 520, 50, 50)
        ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#999')  // 文字颜色：黑色
        ctx.setFontSize(22)         // 文字字号：22px
        
        ctx.fillText('发起人: ' + this.data.details.user.nick_name, 210, 550)

        // 小程序码
        // const qrImgSize = 180
        // ctx.drawImage(res[1].path, (600 - qrImgSize) / 2, 530, qrImgSize, qrImgSize)
        // ctx.stroke()
        // ctx.setTextAlign('center')    // 文字居中
        // ctx.setFillStyle('#000000')  // 文字颜色：黑色
        // ctx.setFontSize(22)         // 文字字号：22px
        // ctx.fillText(this.data.details.title, 338, 480)
          this.dealWords({
          ctx: ctx,//画布上下文
          fontSize: 20,//字体大小
          word: this.data.details.title,//需要处理的文字
          maxWidth: 500,//一行文字最大宽度
          x: 338,//文字在x轴要显示的位置
          y: 470,//文字在y轴要显示的位置
          maxLine: 2//文字最多显示的行数
        })
        ctx.draw()
        setTimeout(() => {
          wxCanvasToTempFilePath({
            canvasId: 'shareCanvas'
          }, this).then(res => {
            console.log(res.tempFilePath)
            return wxSaveImageToPhotosAlbum({
              filePath: res.tempFilePath
            })
          }).then(res => {

            this.setData({
              canvas: false
            })
            wx.hideLoading()
            wx.showToast({
              title: '已保存到相册！'
            })
          }).catch(err => {
            wx.hideLoading()
            this.setData({
              canvas: false
            })
          })
        }, 1000)
      
      }
    })
  },
  canvas(){
    this.setData({
      canvas: true
    })
   

    wx.showLoading({
      title: '正在保存中。。',
    })
    
    Promise.all([
      wxGetImageInfo({
        src: 'https://xiaoniantou.acmgeek.com/upload/image/20200319213851.png'
      }),
      wxGetImageInfo({
        src: this.data.details.image[0]
      }),
      wxGetImageInfo({
        src: this.data.details.user.avatar_file
      }),
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareCanvas')

      // 底图
      ctx.drawImage(res[0].path, 37, 0, 600, 1000)
      ctx.drawImage(res[1].path, 87, 150,500, 300)
      ctx.drawImage(res[2].path, 87, 520, 50, 50)
      // 作者名称
      ctx.setTextAlign('center')    // 文字居中
      ctx.setFillStyle('#999')  // 文字颜色：黑色
      ctx.setFontSize(22)         // 文字字号：22px
      ctx.fillText('发起人: ' +this.data.details.user.nick_name, 238, 550)

      // 小程序码
      // const qrImgSize = 180
      // ctx.drawImage(res[1].path, (600 - qrImgSize) / 2, 530, qrImgSize, qrImgSize)
      // this.dealWords({
      //     ctx: ctx,//画布上下文
      //     fontSize: 22,//字体大小
      //     word: this.data.details.title,//需要处理的文字
      //     maxWidth: 200,//一行文字最大宽度
      //     x: 338,//文字在x轴要显示的位置
      //     y: 480,//文字在y轴要显示的位置
      //     maxLine: 2//文字最多显示的行数
      //   })
      if (this.data.details.title.length>20){
      // var width=338;
      // var height=480;
      //  var str1= this.data.details.title.splice(0,20)
      //   var str2 = this.data.details.title.splice(20)
      //   ctx.stroke()
      //   ctx.setTextAlign('center')    // 文字居中
      //   ctx.setFillStyle('#000000')  // 文字颜色：黑色
      //   ctx.setFontSize(22)         // 文字字号：22px
      //   ctx.fillText(str1, width,height)
      //   ctx.stroke()
      //   ctx.setTextAlign('center')    // 文字居中
      //   ctx.setFillStyle('#000000')  // 文字颜色：黑色
      //   ctx.setFontSize(22)         // 文字字号：22px
      //   ctx.fillText(str2, width, height+25)
      }else{
        // ctx.stroke()
        // ctx.setTextAlign('center')    // 文字居中
        // ctx.setFillStyle('#000000')  // 文字颜色：黑色
        // ctx.setFontSize(22)         // 文字字号：22px
        // ctx.fillText(this.data.details.title, 338, 480)
      }
      
      

      ctx.draw()
      setTimeout(() => {
        wxCanvasToTempFilePath({
          canvasId: 'shareCanvas'
        }, this).then(res => {
          console.log(res.tempFilePath)
          return wxSaveImageToPhotosAlbum({
            filePath: res.tempFilePath
          })
        }).then(res => {
          
          this.setData({
            canvas:false
          })
          wx.hideLoading()
          wx.showToast({
            title: '已保存到相册！'
          })
        }).catch(err=>{
          wx.hideLoading()
          this.setData({
            canvas: false
          })
        })
      }, 1000)
    })

  },
  // 处理文字
  dealWords: function (options) {
    options.ctx.setFontSize(options.fontSize);//设置字体大小
    options.ctx.setFillStyle('#000')
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);
    //实际总共能分多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow;//实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
    var endPos = 0;//当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos);//当前剩余的字符串
      var rowWid = 0;//每一行当前宽度  
      if (options.ctx.measureText(nowStr).width > options.maxWidth) {//如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width;//当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 9);  //(j+1)*18这是每一行的高度    
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 9);
            }
            endPos += m;//下次截断点
            break;
          }
        }
      } else {//如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key: 'project_id',
      data: options.project_id,
    })
    if(options!=undefined){
      var id = options.project_id
      wx.getStorage({
        key: 'user',
        success: res => {
          this.setData({
            session_key: res.data.session_key,
            project_id: id
          })
          this.getdetails(id)
          this.getpl(id)
          console.log(this.data.session_key)
        },
      })
    }   
    this.setData({
      navH: app.globalData.navHeight
    });
  
    
   

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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // this.onLoad()
    this.getpl()
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
 
  
   
   
    
  },
  
})
