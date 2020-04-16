import api from '../../utils/api.js';

const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    attention: "已关注",
    status: 1,
    showeValuate:"",//判断评论是否显示
    // evaluate_list:{"list":[],"count":0},//评论列表
    evaluate_list:new Object(),
    color:"",//点赞的颜色
    comment_text:'',//评论文字
    userinfo:null,
    type:'',
    cid:'',
    id:''

	},

/*海报开始 */

  // 获取初始数据
  get_data: function () {
    api.share_img({
      success: (res) => {
        if (res.data.code == 200) {
          console.log(res)
          this.setData({
            share_data: res.data.data
          })
          this.get_canvas_size()

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
  get_canvas_size: function () {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.canvas').boundingClientRect(function (rect) {
      console.log(rect)
      that.setData({
        canvas_width: rect.width,
        canvas_height: rect.height,
      })
      that.draw_share_poster()
    }).exec();
  },

  // 画整张海报
  draw_share_poster: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    var ctx = wx.createCanvasContext("shareCanvas"); //创建一个canvas实例对象;
    ctx.rect(0, 0, that.data.canvas_width, that.data.canvas_height)
    ctx.setFillStyle('white')
    ctx.fill();
    that.draw_poster(ctx, that.data.share_data.poster);
  },
  // 第一部分
  draw_poster: function (ctx, poster_img) {
    var that = this;
    // 拿到图片资源获取起缓存地址
    wx.getImageInfo({
      src: poster_img,
      success: function (res) {
        ctx.drawImage(res.path, 0, 0, that.data.canvas_width, that.data.canvas_height * 0.22);
        ctx.restore();
        // 画文字
        ctx.setFontSize(15);
        ctx.setFillStyle('black');
        // 拿到标题
        var title = that.data.list.title;
        that.dealWords({
          ctx: ctx,//画布上下文
          fontSize: 16,//字体大小
          word: title,//需要处理的文字
          maxWidth: that.data.canvas_width*0.85,//一行文字最大宽度
          x: that.data.canvas_width * 0.07,//文字在x轴要显示的位置
          y: that.data.canvas_width * 0.05,//文字在y轴要显示的位置
          maxLine: 2//文字最多显示的行数
        })
        that.draw_content(ctx, that.data.list.avatar);//二维码
      }
    })
  },

  //画二维码 和文字
  draw_content: function (ctx, avatar) {
    var that = this;
    // 拿到图片资源获取起缓存地址;头像
    wx.getImageInfo({
      src: avatar,
      success: function (res) {
        // 头像
        ctx.drawImage(res.path, that.data.canvas_width * 0.07, that.data.canvas_height * 0.25, 44, 44);
        // 名字
        ctx.setFontSize(13);
        ctx.setFillStyle('black');
        var name = ctx.measureText(that.data.list.user_name)
        ctx.fillText(that.data.list.user_name, that.data.canvas_width * 0.1+44, that.data.canvas_height * 0.25+35);
        // 标签
        var cat = ctx.measureText(that.data.list.category_text)
        ctx.setFillStyle('#F5F5F5')
        ctx.fillRect(that.data.canvas_width * 0.5 + 44 + name.width, that.data.canvas_height * 0.25+20, cat.width+10, 20);

        ctx.setFillStyle('black');
        console.log(that.data.list,that.data.list.category_text,name)
        ctx.fillText(that.data.list.category_text+'>', that.data.canvas_width * 0.5 + 44+name.width, that.data.canvas_height * 0.25+35);

        // 拿到标题
        var content = that.data.list.content;
        var content_txt ='';
        for(var item of content){
          if(item.type == 'txt'){
            content_txt+=item.content;
          }
        }
        that.dealWords({
          ctx: ctx,//画布上下文
          fontSize: 14,//字体大小
          word: content_txt,//需要处理的文字
          maxWidth: that.data.canvas_width * 0.8,//一行文字最大宽度
          x: that.data.canvas_width * 0.07,//文字在x轴要显示的位置
          y: that.data.canvas_width * 0.45,//文字在y轴要显示的位置
          maxLine: 5//文字最多显示的行数
        })



        that.draw_qrcode(ctx, that.data.share_data.program);//二维码
      }
    })
  },

  //画二维码 和文字
  draw_qrcode: function (ctx, qrcode) {
    var that = this;
    // 拿到图片资源获取起缓存地址;头像
    wx.getImageInfo({
      src: qrcode,
      success: function (res) {
        ctx.drawImage(res.path, that.data.canvas_width * 0.13, that.data.canvas_height * 0.70, that.data.canvas_width * 0.25, that.data.canvas_width * 0.25);
        ctx.setFontSize(16);
        ctx.setFillStyle('black');
        ctx.fillText('长按识别二维码', that.data.canvas_width * 0.40 , that.data.canvas_height * 0.80);
        ctx.fillText('进入教育微讯小程序', that.data.canvas_width * 0.40, that.data.canvas_height * 0.85);

        ctx.draw(false, () => {
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

// 处理文字
  dealWords: function (options) {
    options.ctx.setFontSize(options.fontSize);//设置字体大小
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
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 18);  //(j+1)*18这是每一行的高度    
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18);
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
  save_to_album: function () {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.temp_path,
      success(res) {
      },
      fail(res) {
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
    if (e.detail.authSetting["scope.writePhotosAlbum"]) {
      this.setData({
        modalName: ""
      })
    }
  },
/*海报结束 */

	showModal:function(e) {
		
    if(e.currentTarget.dataset.type == 'small'){
        this.setData({
          type: e.currentTarget.dataset.type,
          cid: e.currentTarget.dataset.id
        })
    }

		this.setData({
			modalName: e.currentTarget.dataset.target,
		})
    if ("sharewxfirend" == e.currentTarget.dataset.target ){
      this.get_data();
    }
	},
	// hideModal:function(e) {
  //   this.setData({
  //     modalName: null
  //   })
  // },
  // 点赞
   links(e){
     // 获取当前点击下标
     var that = this
     var index = e.currentTarget.dataset.index;
     //点赞
     var cid = e.currentTarget.dataset.id;
     api.add_comment_stars({
       data:{
         comment_id:cid
       },
       success:(res)=>{
           wx.showToast({
             title: res.data.msg,
             icon:"none"
           })
       }
     })
     console.log(index,"这是一个发表页面")
     // data中获取列表
     var message = this.data.evaluate_list;
     
     for (let i in message.list) { //遍历列表数据
       if (i == index) { //根据下标找到目标
         var collectStatus = false
        
      //  标杆用来表示是否点击
         var num = 0
         if (message.list[i].is_stared == 0) { //如果是没点赞+1
           collectStatus = true
            // 是否点赞
           message.list[i].is_stared++
           message.list[i].stars_count = parseInt(message.list[i].stars_count) + 1
           
         } else {
           collectStatus = false
           num=0
           console.log(message.list[i].stars_count)
           message.list[i].stars_count = parseInt(message.list[i].stars_count) - 1
           // 是否点赞
           message.list[i].is_stared--
          
         }
        //  wx.showToast({
        //    title: collectStatus ? '点赞成功' : '取消点赞' ,
        //  })
       }
     }
     this.setData({
       evaluate_list: message
     }) 
   }  ,
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    var community_id = options.id;
    this.setData({
      id:community_id
    })

    //获取当前用户信息
    this.getlist();
    // 
	},
  deleteComment:function(e){
    var that =this;

    api.delete_comment({
      data:{
        comment_id:e.currentTarget.dataset.id
      },
      success:(res)=>{
        if(res.data.code == 200){
          //删除数据
          that.data.evaluate_list.list.splice(e.currentTarget.dataset.index,1);

          that.setData({
            evaluate_list: that.data.evaluate_list
          })
          wx.showToast({
            title: '删除成功',
            icon: "none"
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  // 相关帖子
	showicon(e) {
    let that = this;
    //关注用户
    api.fallow_user({
      data: {
        "user_id": e.currentTarget.dataset.id,
      },
      success: (res) => {
        wx.showToast({
          title: res.data.code,
          icon: "none"
        })
        if (res.data.code == 200){
          console.log(that.data.status);
          if (that.data.attention == "关注") {
            that.setData({
              status: 0,
              attention: "已关注"
            })
          } else {
            that.setData({
              status: 1,
              attention: "关注"
            })
          }
        }else{
          wx.showToast({
            title : res.data.msg,
            icon : 'none'
          })
        }
        
        
      }
    })
	},
// 	相关用户
selectd(e) {
    let that = this;
    //关注用户
    api.fallow_user({
      data: {
        "user_id": e.currentTarget.dataset.id,
      },
      success: (res) => {
        wx.showToast({
          title: res.data.code,
          icon:"none"
        })
        if (res.data.code == 200){
          console.log(that.data.status);
          if (that.data.status == 1) {
            that.setData({
              status: 0,
              attention: "已关注"
            })
          } else {
            that.setData({
              status: 1,
              attention: "关注"
            })
          }
        }else{
          wx.showToast({
            title : res.data.msg,
            icon : 'none'
          })
        }
        
        
      }
    })
	},


  //点赞
  changeimg: function (e) {
    console.log(e);
    var that = this;
    //点赞
    api.add_star({
      data: {
        "community_id": e.currentTarget.dataset.id,
      },
      success: (res) => {
        if(res.data.code == 200){
            wx.showToast({
              title: res.data.msg,
              icon:"none",
              duration:1500
            })
            let info_id = e.currentTarget.dataset.id;
            let lists = that.data.list;

            if (lists.is_stared == 1) {
              that.setData({
                ['list.is_stared']: 0,
              })
            } else {
              that.setData({
                ['list.is_stared']: 1,
              })
            }
        }else{
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
        }
        
      }
    })
  },
  //收藏接口
  collection_add:function(e){
    console.log(e);
    var that = this;
    var status = 0;
    api.add_favorite({
      data:{
        'community_id': e.currentTarget.dataset.id
      },
      success:(res)=>{
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration: 1500
        })
        if(res.data.code == 200){
          that.data.list.is_favorite ? status = 0 : status = 1;
          that.setData({
            ['list.is_favorite']: status
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        
      }
    })
  }, 
  //绑定评论文字
  comment_text:function(e){
    this.setData({
        comment_text:e.detail.value
    })
  },
  //发布评论
  publish_common:function(e){
    var that = this;
    if (e.currentTarget.dataset.type == 'small') {
      api.add_comment_discuss({
        data: {
          comment_id: e.currentTarget.dataset.cid,
          content: that.data.comment_text
        },
        success: function (res) {
          if (res.data.code == 200) {
            //改变list数据
            wx.showToast({
              title: '评论成功1',
            })
            // that.hideModal()
            // if (that.data.evaluate_list.list == '') {
            //   that.data.evaluate_list.push({ list: res.data.data });
            //   that.setData({
            //     evaluate_list: that.data.evaluate_list,
            //   })
            // } else {
            //   that.data.evaluate_list.list.push(res.data.data);
            //   that.setData({
            //     evaluate_list: that.data.evaluate_list,
            //   })
            // }
           
            that.setData({
              modalName: "",
              comment_text: ' '
            })
            console.log(that.data.modalName,'ssss')
            that.getlist();
            

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }

        }
      })
    }else{
      api.add_comment({
        data: {
          community_id: e.currentTarget.dataset.id,
          content: that.data.comment_text
        },
        success: function (res) {
          if (res.data.code == 200) {
            //改变list数据
            wx.showToast({
              title: '评论成功'
            })
            //刷新数据
            // 如果是第一条
            if (!that.data.evaluate_list) {
              // var evaluate_list = that.data.evaluate_list;
              var evaluate_list =new Object();
              evaluate_list.list = new Array();
              evaluate_list.count = new Object()
              evaluate_list.list.push(res.data.data);
              evaluate_list.count = 1;
              that.setData({
                evaluate_list: evaluate_list,
              })
            } else {
              that.data.evaluate_list.list.push(res.data.data);
              that.data.evaluate_list.count = that.data.evaluate_list.list.length+1
              that.setData({
                evaluate_list: that.data.evaluate_list,
              })
            }

            that.setData({
              modalName: '',
              comment_text: ' '
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }

        }
      })
    }

    
  },

  community_detail:function(){
    var that = this;
    var community_id = that.data.id;
    wx.request({
      url: app.globalData.url + 'api/community/community_detail/?token=' + wx.getStorageSync('token'), //接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        community_id
      },
      success: function (res) {
        if (res.data.code == 200) {
          var navlist = res.data.data.list;
          that.setData({
            navlist: navlist
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }

      }
    })
  },
  onShareAppMessage: function (ops) {
    var _type = 0;
    var type;
    if (ops.from === 'button') {
      if (this.data.type == 1){
        type = 'community';
      }
      if (this.data.type == 2){
        type = 'qa'
      }
      // 设置隐藏遮罩层；
      
      api.qr_share({
        data: {
          type: type,
          community_id: this.data.id
        },
        success: function (res) {
          if (res.data.code == 200) {
            console.log(222)
          }
        }
      })
        _type = 20;
    }else{
        _type = 10;
    }
    
    return {
      title: '教育微讯小程序',
      path: 'pages/postdetail/postdetail?id='+this.data.id,
      success: function (res) {
        api.share({
          data: {
            type: _type,
            community_id: this.data.id
          },
          success: (ae) => {

          }
        })
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
  getlist:function(){
    
    api.user_center({
      success: (res) => {
        if (res.data.code == 200) {
          that.setData({
            userinfo: res.data.data.user_info
          })
          wx.setStorageSync('user_info', res.data.data.user_info);
        }
      }
    })

    var that = this;
    wx.request({
      url: app.globalData.url + 'api/community/community_detail/?token=' + wx.getStorageSync('token'), //接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        //session_key: wx.getStorageSync('sessionKey'),
        community_id: that.data.id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          var list = res.data.data;
          var status = 0;
          var status_desc = '';
          res.data.data.is_fallow == 1 ? status = 0 : status = 1;
          res.data.data.is_fallow == 1 ? status_desc = '已关注' : status_desc = '关注';
          that.setData({
            list: list,
            status: status,
            attention: status_desc,
            type:res.data.data.type
          })
        }

      }
    })


    //评论列表
    wx.request({
      url: app.globalData.url + 'api/community/comment_list/?token=' + wx.getStorageSync('token'), //接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        //session_key: wx.getStorageSync('sessionKey'),
        community_id: that.data.id,
      },
      success: function (res) {

        if (res.data.code == 200) {
          // 判断后端传来的数据当大于三条就显示两条然后增加更多回复
          for (var i = 0; i < res.data.data.list.length; i++) {
            if (res.data.data.list[i].discuss_list.length > 2) {
              res.data.data.list[i].discuss_list = res.data.data.list[i].discuss_list.slice(0, 2)
              res.data.data.list[i].Reply = 0
              var evaluate_list = res.data.data;
            }
            else {
              var evaluate_list = res.data.data;
            }
          }

          // 判断评论是否显示
          that.setData({
            evaluate_list: evaluate_list,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }

      }
    })
  }


})