// pages/user/ShareCircleOfFriends.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {

      sharebg: 'https://shadoushoutest.zwyxit.com/Images/ShareImage/share3.png', // 分享底部背景图

      shareTitle: '互联网+深度分类回收=啥都收 电器回收，生活废品回收，工厂废料 企业转行 酒楼设备 企业设备，库存货物等等，有偿服务和无偿服务', // 分享标题

      shareCoverImg: 'https://shadoushoutest.zwyxit.com/Images/ShareImage/share1.png', // 分享封面图

      shareQrImg: 'https://shadoushoutest.zwyxit.com/Images/ShareImage/share2.png', // 分享小程序二维码

      userInfo: {

        headImg: 'http://shadoushou.zwyxit.com/Images/User/0515100040529.jpg', //用户头像

        nickName: '打豆豆', // 昵称

      },

      seeDate: '2018-12-04', //看视频日期

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;

    var UserName = app.globalData.login_sj[0];

    wx.setNavigationBarTitle({

      title: '分享到朋友圈',

    })

    var time = util.formatTime(new Date());

    var UserImage = app.globalData.login_sj[2];



    var timestamp = Date.parse(new Date());

    var date = new Date(timestamp);

    //获取年份  

    var Y = date.getFullYear();

    //获取月份  

    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

    //获取当日日期 

    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();



    var time1 = Y + "-" + M + "-" + D





    that.data.userInfo.nickName = UserName;

    that.data.userInfo.headImg = UserImage;

    that.setData({

      nickName: that.data.userInfo,

      headImg: that.data.userInfo,

      seeDate: time1

    })



    console.log(that.data.userInfo.nickName);





    // 创建画布

    const ctx = wx.createCanvasContext('shareCanvas')

    // 白色背景

    ctx.setFillStyle('#fff')

    ctx.fillRect(0, 0, 300, 380)

    ctx.draw()

    // 下载底部背景图

    wx.getImageInfo({

      src: that.data.sharebg,

      success: (res1) => {

        ctx.drawImage(res1.path, 0, 250, 300, 130)

        // 下载视频封面图

        wx.getImageInfo({

          src: that.data.shareCoverImg,

          success: (res2) => {

            ctx.drawImage(res2.path, 0, 0, 300, 168)

            // 分享标题

            // ctx.setTextAlign('center')    // 文字居中

            ctx.setFillStyle('#000')  // 文字颜色：黑色

            ctx.setFontSize(20)         // 文字字号：20px

            if (that.data.shareTitle.length <= 14) {

              // 不用换行

              ctx.fillText(that.data.shareTitle, 10, 200, 280)

            } else if (that.data.shareTitle.length <= 28) {

              // 两行

              let firstLine = that.data.shareTitle.substring(0, 14);

              let secondLine = that.data.shareTitle.substring(14, 27);

              ctx.fillText(firstLine, 10, 200, 280)

              ctx.fillText(secondLine, 10, 224, 280)

            } else {

              // 超过两行

              let firstLine = that.data.shareTitle.substring(0, 14);

              let secondLine = that.data.shareTitle.substring(14, 27) + '...';

              ctx.fillText(firstLine, 10, 200, 280)

              ctx.fillText(secondLine, 10, 224, 280)

            }



            // 下载二维码

            wx.getImageInfo({

              src: that.data.shareQrImg,

              success: (res3) => {

                let qrImgSize = 70

                ctx.drawImage(res3.path, 212, 256, qrImgSize, qrImgSize)

                ctx.stroke()

                ctx.draw(true)



                // 用户昵称

                ctx.setFillStyle('#000')  // 文字颜色：黑色

                ctx.setFontSize(14) // 文字字号：16px

                ctx.fillText(that.data.userInfo.nickName, 38, 284)

                // 观看日期

                ctx.setFillStyle('#999')  // 文字颜色：黑色

                ctx.setFontSize(10)       // 文字字号：16px

                ctx.fillText('在' + that.data.seeDate + '分享到朋友圈', 38, 298)



                // 下载用户头像

                wx.getImageInfo({

                  src: that.data.userInfo.headImg,

                  success: (res4) => {

                    // 先画圆形，制作圆形头像(圆心x，圆心y，半径r)

                    ctx.arc(22, 284, 12, 0, Math.PI * 2, false)

                    ctx.clip()

                    // 绘制头像图片

                    let headImgSize = 24

                    ctx.drawImage(res4.path, 10, 272, headImgSize, headImgSize)

                    // ctx.stroke() // 圆形边框

                    ctx.draw(true)



                    // 保存到相册

                    wx.canvasToTempFilePath({

                      canvasId: 'shareCanvas',

                      success: function (res) {

                        wx.saveImageToPhotosAlbum({

                          filePath: res.tempFilePath,

                          success: function (res) {

                            wx.showToast({

                              title: '分享图片已保存到相册,请到朋友圈选择图片发布'

                            })

                          }

                        })

                      }

                    }, this)

                  }

                })

              }

            })

          }

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