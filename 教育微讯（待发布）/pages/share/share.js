// pages/share/share.js
const app = getApp();
const api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    share: [{
        name: "分享小程序"
      },
      {
        name: "分享海报"
      }
    ],
    modalName:""
  },
  onLoad: function(options) {
    this.get_data();
    
  },

  // 获取初始数据
  get_data: function () {
    api.share_img({
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            share_data: res.data.data
          })


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1500
          })
        }
      }
    })
  },

  // 获取canvas节点的高宽
  get_canvas_size:function(){
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.canvas').boundingClientRect(function (rect) {
      console.log(rect)
      that.setData({
        canvas_width:rect.width,
        canvas_height: rect.height,
      })
      that.draw_share_poster()
    }).exec();
  },

  // 画整张海报
  draw_share_poster:function(){
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    var ctx = wx.createCanvasContext("shareCanvas"); //创建一个canvas实例对象;
    console.log(that.data.canvas_width, that.data.canvas_height)
    ctx.rect(0, 0, that.data.canvas_width, that.data.canvas_height)
    ctx.setFillStyle('white')
    ctx.fill();

    // ctx.fillStyle = "#FFFFFF";
    // ctx.fillRect(0, 0, this.data.canvas_width, this.data.canvas_height);//背景色
    that.draw_poster(ctx, that.data.share_data.poster);//背景
  },
  // 画背景
  draw_poster: function(ctx,poster_img) {
    var that = this;
    // 拿到图片资源获取起缓存地址
    wx.getImageInfo({
      src: poster_img,
      success: function(res) {
        that.roundRect(ctx, 0, 0, that.data.canvas_width, that.data.canvas_height, 10)
        ctx.drawImage(res.path, 0, 0, that.data.canvas_width, that.data.canvas_height*0.67 );
        console.log(res)
        ctx.restore();
        that.draw_qrcode(ctx, that.data.share_data.program);//二维码
      }
    })
  },

  //画二维码 和文字
  draw_qrcode: function (ctx,qrcode) {
    var that = this;
    console.log(that.data.canvas_width, that.data.canvas_height * 0.67)
    // 拿到图片资源获取起缓存地址
    wx.getImageInfo({
      src: qrcode,
      success: function (res) {
        ctx.drawImage(res.path, that.data.canvas_width * 0.34, that.data.canvas_height * 0.56 , that.data.canvas_width*0.295, that.data.canvas_height * 0.24);
        console.log(res)
        ctx.setFontSize(10);
        ctx.setFillStyle('black')
        // 测量文本宽度
        ctx.setTextAlign('center')
        const metrics = ctx.measureText(that.data.share_data.share_content)
        ctx.fillText(that.data.share_data.share_content, that.data.canvas_width * 0.5, that.data.canvas_height * 0.86, that.data.canvas_width * 0.67)
        ctx.fillText(' 教 / 育 / 微 / 讯 ', that.data.canvas_width * 0.5, that.data.canvas_height * 0.94);
        // that.roundRect(ctx,0,0, that.data.canvas_width, that.data.canvas_height,10)
        ctx.draw(false,()=>{
           // 导出图片
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success(res) {
              console.log(res)
              that.setData({
                temp_path: res.tempFilePath
              })
            },
            fail(res) {
              wx.showToast({
                title: '生成图片失败',
                icon: "none"
              })
            }
          }, that)
        });
        wx.hideLoading();
       

      }
    })
  },



  /**
    * 
    * @param {CanvasContext} ctx canvas上下文
    * @param {number} x 圆角矩形选区的左上角 x坐标
    * @param {number} y 圆角矩形选区的左上角 y坐标
    * @param {number} w 圆角矩形选区的宽度
    * @param {number} h 圆角矩形选区的高度
    * @param {number} r 圆角的半径
    */


  // 绘制圆角
  roundRect : function (ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.save();
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('transparent')
    // ctx.setStrokeStyle('transparent')

    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)

    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)

    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)

    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip();

  },

  // tab切换
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.get_canvas_size();//1.先得到尺寸
    // this.draw_share_poster();//2.画图
  },

// 隐藏
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 保存图片至相册
  save_to_album:function(){
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.temp_path,
      success(res) {
      },
      fail(res){
        // 如果已授权
        if (res.errMsg.split(":")[1] == "fail auth deny") {
          that.setData({
            is_opensetting: true,
            modalName: "DialogModal1"
          })

        } else {

          wx.showToast({
            title: "请重试",
            icon: "none"
          })
        }
      }
    })
  },

  // 检查是否有权限
  set_result: function (e) {
    console.log(e)
    if (e.detail.authSetting["scope.writePhotosAlbum"]){
      this.setData({
        modalName:""
      })
    }
  },

  // 分享至好友
  onShareAppMessage: function(ops) {
    var _type = 0;
    if (ops.from === 'button') {
      api.qr_share({
        data: {
          type:'program',
          },
        success:function(res){
          if(res.data.code == 200){
            console.log(222)
          }
        }
        })
      _type = 20;
    } else {
      _type = 10;
    }

    return {
      title: '教育微讯小程序',
      path: 'pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {

      }
    }

  }
})