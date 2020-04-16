//index.js 
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    // 新增
    topic_list: [{
      type: 'txt',
      content: '',
      sort: 0
    }], //帖子列表
    region: ['', ''],
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列表下标,
    avatarUrl: [],
    gallery: [],
    province: "",
    city: "",
    radios: [{
        name: 1,
        value: "贴子"
      },
      {
        name: 2,
        value: "问答"
      }
    ],
    id:0,
    valueIndex: [0, 0],
    multiIndex: [], //省下标
    cityIndex: [], //市下标
    multiArr_index: [], //全部省
    multiArray: [
      [],
      []
    ], //全部省
    objectMultiArray: [4, 5, 6], //根据选择的省去获取市
    release_btn:false,
    gallery_pics:[],
    gallery_pics_1: []
  },


  //获取标题的输入 
  bindTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindSourceInput: function (e) {
    this.setData({
      source: e.detail.value
    })
  },
  // 点击选择帖子还是问答
  radioChange: function(e) {
    this.setData({
      type: e.detail.value
    })
  },

  // 选择分类
  selectTap() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'api/community/get_community_category_list/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        session_key: wx.getStorageSync('sessionKey')
      },
      success: function(res) {
        var selectData = res.data.data.list;
        that.setData({
          selectData: selectData,
        })
      },
      fail: function() {
        console.log("获取分类失败");
      },
    })
    that.setData({
      show: !that.data.show
    });
  },

  // 点击下拉列表
  optionTap(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id; //获取点击的下拉列表的id
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标

    console.log(id, Index)
    this.setData({
      select_id:id,
      index: Index,
      show: !this.data.show
    });

  },

  // 新增封面
  add_img:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        console.log(typeof res.tempFilePaths[0]);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          tem_file: tempFilePaths[0]
        })
        wx.uploadFile({
          url: app.globalData.url + 'api/community/upload_file/?token=' + wx.getStorageSync('token'),
          filePath: tempFilePaths[0],
          name: 'file',

          success(res) {
            console.log(res)
            const data = JSON.parse(res.data)
            var gallery_pics = that.data.gallery_pics;
            var gallery_pics_1 = that.data.gallery_pics_1;
            gallery_pics.push(data.data.file_url);
            gallery_pics_1.push(data.data.file);
            that.setData({
              gallery_pics:gallery_pics,
              gallery_pics_1: gallery_pics_1
            })
          }
        })
      }
    })
  },
  // 删除封面
  del_img:function(e){
    var index = e.currentTarget.dataset.index;
    var gallery_pics = this.data.gallery_pics;
    var gallery_pics_1 = this.data.gallery_pics_1;
    gallery_pics.splice(index,1);
    gallery_pics_1.splice(index, 1);
    this.setData({
      gallery_pics:gallery_pics,
      gallery_pics_1: gallery_pics_1
    })
  },
  // 获取全部省
  get_province: function () {

    wx.request({
      url: api.province_list,
      success: res => {
        console.log(res)
        if (res.data.code == 200) {
          var multiArray = this.data.multiArray
          // 先查第一位的省市

          wx.request({
            url: api.city_list,
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
              province_id: res.data.data.list[0].id,
            },
            success: (res) => {
              if (res.data.code == 200) {
                var multiArray = this.data.multiArray;
                var cityIndex = new Array();
                for (var item of res.data.data.list) {
                  multiArray[1].push(item.title);
                  cityIndex.push(item.id)
                }
                this.setData({
                  multiArray: multiArray,
                  cityIndex: cityIndex,
                })
              }
            }
          })


          var multiIndex = new Array()
          for (var item of res.data.data.list) {
            multiArray[0].push(item.title);
            multiIndex.push(item.id)
          }
          this.setData({
            multiArr_index: res.data.data.list, //数组和id 对象
            multiArray: multiArray, //省
            multiIndex: multiIndex, //下标
          })

        }

        console.log(this.data.multiArray)
      }
    })
  },

  //多列改变点击确认 
  bindMultiPickerChange: function (e) {
    this.setData({
      valueIndex: e.detail.value
    })
  },

  //列改变 
  bindMultiPickerColumnChange: function (e) {
    console.log(e)
    var that = this;
    that.data.multiArray[1] = new Array()
    var index = that.data.valueIndex
    if (e.detail.column == 0) {
      var id = that.data.multiIndex[e.detail.value];
      index[0] = e.detail.value
      that.setData({
        valueIndex: index,
      })
      wx.request({
        url: api.city_list,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          province_id: id,
        },
        success: function (res) {
          if (res.data.code == 200) {
            var multiArray = that.data.multiArray;
            var cityIndex = new Array();
            for (var item of res.data.data.list) {
              multiArray[1].push(item.title);
              cityIndex.push(item.id)
            }
            if (res.data.data.list.length > index[1]) {

            } else {
              index[1] = 0
            }
            that.setData({
              multiArray: multiArray,
              cityIndex: cityIndex,
              valueIndex: index
            })
          }
        }
      })
    } else if (e.detail.column == 1) {
      index[1] = e.detail.value;
      that.setData({
        valueIndex: index
      })
    }

  },

  //事件处理函数
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 发布
  release: function() {
    var that = this;

    if (wx.getStorageSync('token') == '') {
      wx.showToast({
        title: '您还未登录',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.redirectTo({
          url: '../login/login',
        })
      }, 1500)
    }
    var type = that.data.type;
    var save_type = "post";
    var category_id = that.data.select_id;
    var province_id = that.data.multiIndex[that.data.valueIndex[0]];
    var city_id = that.data.cityIndex[that.data.valueIndex[1]];
    var title = that.data.title;
    var content = JSON.stringify(that.data.topic_list) ;
    var id = that.data.id;
    var source = that.data.source;
    var gallery = "";
    if (that.data.gallery_pics_1.length > 0) {
      for (var item of that.data.gallery_pics_1) {
        gallery =gallery + item + ','
      }
    }
    // console.log(type, save_type, category_id, province_id, city_id, title, content,id)
    if (!title){
      wx.showToast({
        title: '请输入标题',
        icon:'none',
        duration:1500
      })
      return;
    }
    if (!category_id) {
      wx.showToast({
        title: '请输入分类',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!province_id) {
      wx.showToast({
        title: '请选择省份',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!city_id) {
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!type) {
      wx.showToast({
        title: '请选择发帖类型',
        icon: 'none',
        duration: 1500
      })
      return;
    } 

    // return ;
    // console.log(type, save_type, category_id, province_id, city_id, title, content,)
    that.setData({
      release_btn: true
    })
    wx.request({
      url: app.globalData.url + 'api/community/publish_community/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type : that.data.type,
        save_type : "post",
        category_id: that.data.select_id,
        province_id : that.data.multiIndex[that.data.valueIndex[0]],
        city_id : that.data.cityIndex[that.data.valueIndex[1]],
        title : that.data.title,
        content : JSON.stringify(that.data.topic_list) ,
        id: that.data.id,
        source,
        gallery,
      },
      success: function(res) {
        var msg = res.data.msg
        wx.showToast({
          title: msg,
          icon: 'none',
          mask: true
        })
        if (res.data.code == 200) {
          //跳转到发布成功页面
          wx.redirectTo({
            url: '../publish/success',
          })
        } else if (res.data.code == 100) {
          that.setData({
            release_btn: false
          })
          wx.showToast({
            title: '您还未登录',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '../login/login',
            })
          }, 1500)
        }

      },
      fail: function() {
        console.log("file3333");
      },

    })
  },

  // 保存草稿
  save_draft:function(){
    var that = this;
    // that.setData({
    //   release_btn:true
    // })
    if (wx.getStorageSync('token') == '') {
      wx.showToast({
        title: '您还未登录',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../login/login',
        })
      }, 1500)
    }
    var type = that.data.type;
    var save_type = "save";
    var category_id = that.data.select_id;
    var province_id = that.data.multiIndex[that.data.valueIndex[0]];
    var city_id = that.data.cityIndex[that.data.valueIndex[1]];
    var title = that.data.title;
    var content = JSON.stringify(that.data.topic_list);
    var source = that.data.source;
    var gallery = "";
    if (that.data.gallery_pics_1.length>0){
      for (var item of that.data.gallery_pics_1) {
        gallery = gallery + item+','
      }
    }

    wx.request({
      url: app.globalData.url + 'api/community/publish_community/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: that.data.type,
        save_type: "save",
        category_id: that.data.select_id,
        province_id: that.data.multiIndex[that.data.valueIndex[0]],
        city_id: that.data.cityIndex[that.data.valueIndex[1]],
        title: that.data.title,
        content: JSON.stringify(that.data.topic_list),
        source,
        gallery,
      },
      success: function (res) {
        var msg = res.data.msg

        if (res.data.code == 200) {
          wx.showToast({
            title: msg,
            icon: 'none',
            mask: true,
            duration: 1500
          })
          setTimeout(function () {
            //跳转到发布成功页面
            wx.redirectTo({
              url: '../publish/index',
            })
          }, 1500)

        } else if (res.data.code == 100) {
          that.setData({
            release_btn: false
          })
          wx.showToast({
            title: '您还未登录',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../login/login',
            })
          }, 1500)
        }

      },
      fail: function () {
        console.log("file3333");
      },

    })
  },

  // 跳转编辑草稿
  edit_draft:function(){
    wx.navigateTo({
      url: '/pages/my_draft/index',
    })
  },
  
  // 草稿详情
  draft_detail:function(id){
    wx.showToast({
      title: '加载中，请稍候',
      icon:'loading',
      mask:true,
      duration:10000
    })
    var that = this;
    if (wx.getStorageSync('token') == '') {
      wx.showToast({
        title: '您还未登录',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../login/login',
        })
      }, 1500)
    }

    wx.request({
      url: app.globalData.url + 'api/community/drafts_detail/?token=' + wx.getStorageSync('token'),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id
      },
      success: function (res) {
        // 如果当前页面大于1，即可翻页
        if (res.data.code == 200) {
          
          // 分类
          var category_id = res.data.data.category_id
          wx.request({
            url: app.globalData.url + 'api/community/get_community_category_list/?token=' + wx.getStorageSync('token'),
            method: "post",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              session_key: wx.getStorageSync('sessionKey')
            },
            success: function (res) {
              var selectData = res.data.data.list;
              for(var index in selectData){
                if (selectData[index].id == category_id){
                  that.setData({
                    selectData: selectData,
                    index: index,
                    select_id: selectData[index].id 
                  })
                  
                }
              }
            },
            fail: function () {
              console.log("获取分类失败");
            },
          })
          // 区域
          var province_id = res.data.data.province_id;
          var city_id = res.data.data.city_id;
          wx.request({
            url: api.province_list,
            success: res => {
              console.log(res)
              if (res.data.code == 200) {
                var multiArray = that.data.multiArray
                // 查固定省市

                wx.request({
                  url: api.city_list,
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  data: {
                    province_id: province_id,
                  },
                  success: (res) => {
                    if (res.data.code == 200) {
                      var multiArray = that.data.multiArray;
                      var cityIndex = new Array();
                      for (var item of res.data.data.list) {
                        multiArray[1].push(item.title);
                        cityIndex.push(item.id)
                      }
                      that.setData({
                        multiArray: multiArray,
                        cityIndex: cityIndex,
                      })
                    }
                  }
                })


                var multiIndex = new Array()
                for (var item of res.data.data.list) {
                  multiArray[0].push(item.title);
                  multiIndex.push(item.id)
                }
                that.setData({
                  multiArr_index: res.data.data.list, //数组和id 对象
                  multiArray: multiArray, //省
                  multiIndex: multiIndex, //下标
                })

              }
              var valueIndex = new Array();
              for (var i in that.data.multiIndex){
                if (that.data.multiIndex[i] == province_id){
                  valueIndex[0] = i
                }
              }
              if (that.data.cityIndex.length > 1){
                for (var i in that.data.cityIndex) {
                  console.log(city_id, that.data.cityIndex)
                  if (that.data.cityIndex[i] == city_id) {
                    valueIndex[1] = i
                  }
                }
              }else{
                valueIndex[1] = 0
              }

              that.setData({
                valueIndex: valueIndex,// 地区选择下标
              })
              wx.hideToast()
              console.log(that.data.multiIndex, that.data.cityIndex, that.data.multiArr_index, that.data.multiArray)
            }
          })
          var valueIndex = new Array();
          valueIndex[0] = res.data.data.province_id;
          valueIndex[1] = res.data.data.city_id;
          if (res.data.data.content.length > 0){
            that.setData({
              topic_list: res.data.data.content
            })
          }
          that.setData({
            title: res.data.data.title,//标题
            type: res.data.data.type,// 类型
            // category_id: res.data.data.category_id,// 分类
            valueIndex:valueIndex,// 地区选择下标
            // province_id: res.data.data.province_id,// 区域
            // city_id: res.data.data.city_id,// 区域
            topic_list:res.data.data.content,//标题内容
            source: res.data.data.source,// 来源
            gallery_pics_1: res.data.data.gallery_arr,// 封面无域名
            gallery_pics: res.data.data.cover// 封面
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 如有id则是从草稿页跳转过来
    if(options.id){
      // // 获取全部的省
      // this.get_province()
      this.draft_detail(options.id)
      this.setData({
        id: options.id
      })
    }else{
      this.setData({
        id: 0
      })
      if (wx.getStorageSync('token') == '') {
        wx.redirectTo({
          url: '../login/login',
        })
        return;
      }
      // 获取全部的省
      this.get_province()
    }
    
  },

  /**
   * 新增事件绑定
   **/
  // 增加文字
  event_text: function(e) {
    var list = this.data.topic_list;
    list.push({
      type: "txt",
      content: '',
      sort: list.length
    })
    this.setData({
      topic_list: list,
    })
  },

  // 增加图片
  event_gallery: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        console.log(res, api.upload_file)
        // 需调上传的接口
        wx.uploadFile({
          url: app.globalData.url + 'api/community/upload_file/?token=' + wx.getStorageSync('token'), //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = JSON.parse(res.data)
            console.log(data)
            if (data.code == 200) {
              var list = that.data.topic_list
              list.push({
                type: "img",
                content: data.data.file,
                url: tempFilePaths,
                sort: list.length
              })
              that.setData({
                topic_list: list,
              })
              wx.showToast({
                title: '上传图片成功',
                icon: 'success',
                duration: 1500
              })
            } else if (data.code == 100) {
              wx.showToast({
                title: '您还未登录',
                icon: 'none',
                duration: 1500
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              }, 1500)
            }

          }
        })

      }
    })

  },

  // 增加视频
  event_video: function() {

    var that = this;


    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePath
        // 需调上传的接口
        wx.uploadFile({
          url: app.globalData.url + 'api/community/upload_file/?token=' + wx.getStorageSync('token'), //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = JSON.parse(res.data)
            if (data.code == 200) {
              wx.showToast({
                title: '上传视频成功',
                icon: 'success',
                duration: 1500
              })
            } else if (data.code == 100) {
              wx.showToast({
                title: '您还未登录',
                icon: 'none',
                duration: 1500
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              }, 1500)
            }
          }
        })
        var list = that.data.topic_list
        list.push({
          type: "video",
          content: tempFilePaths,
          url: tempFilePaths,
          sort: list.length
        })
        that.setData({
          topic_list: list,
        })
      }
    })
  },

  // 排序
  event_rank: function() {
    var list = this.data.topic_list;
    list = JSON.stringify(list);
    wx.navigateTo({
      url: '/pages/rank/index?list=' + list,
    })
  },

  // 删除编辑的内容
  del_item: function(e) {
    var del_id = e.currentTarget.dataset.id;
    var list = this.data.topic_list;
    // 删除指定的元素
    if(list.length>1){
      list.splice(del_id, 1)
      for (var i = del_id; i < list.length; i++) {
        list[i].sort -= 1
      }
      this.setData({
        topic_list: list
      })
    } else if (list.length == 1){
      wx.showToast({
        title: '最后一个模块了哦',
        icon:"none",
        duration:1500
      })
      return;
    }


  },

  // 输入时存储内容
  save_value: function(e) {
    var id = e.currentTarget.dataset.id;
    var list = this.data.topic_list;
    list[id].content = e.detail.value;
    this.setData({
      topic_list: list
    })
  },

  /**
   * 新增事件绑定 结束
   **/



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      release_btn: false,
    })
  },
})