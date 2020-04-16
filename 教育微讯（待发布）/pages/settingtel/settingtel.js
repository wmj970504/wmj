import api from '../../utils/api.js';

const app=getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		newPhone:'',
    mobile:'',
    code: '',
    second: 60,
    btnValue: '验证码',
    code1: '',
    second1: 60,
    btnValue1: '验证码'
	},
	getPhone: function () {
		var that = this;
		that.setData({
			olePhone: wx.getStorageSync('phone')
		})
	},
	bindNewPhone:function(e){
		this.setData({
			newPhone:e.detail.value
		})
	},
	handleSave: function () {
    //检查两次短信验证码是否匹配
		var that = this;

    console.log(that.data.code);
    console.log(that.data.code1);
    api.verify_code({
      data:{
        mobile: that.data.mobile_send,
        code: that.data.code
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code == 200){
          wx.showToast({
            title: res.data.msg
          })
            //判断新手机号
            api.verify_code({
              data: {
                mobile: that.data.newPhone,
                code: that.data.code1
              },
              success: (ress) => {
                if (ress.data.code == 200) {
                  wx.showToast({
                    title: ress.data.msg
                  })
                  wx.request({
                    url: app.globalData.url + 'api/user/save_user_info/?token=' + wx.getStorageSync('token'),
                    method: "post",
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    data: {
                      mobile: that.data.newPhone
                    },
                    success: function (res) {
                      if (res.data.code == 200) {
                        console.log(res);
                        wx.showToast({
                          title: res.data.msg,
                          icon: "none"
                        });
                        wx.removeStorageSync('phone');
                        wx.navigateBack({
                          delta: 1
                        })
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: "none"
                        });
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: ress.data.msg
                  })
                  return false;
                }
              }

            })
        }else{
          wx.showToast({
            title: res.data.msg
          })
          return false;
        }
      }
      
    })

		
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    var that = this;
      //获取当前用户信息
      api.user_info({
        success:(res)=>{
          console.log(res.data.data.mobile);
          that.setData({
            mobile: res.data.data.display_mobile,
            mobile_send: res.data.data.mobile,
          })
        }
      })

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getPhone();
	},

  bindphone: function (res) {
    this.setData({
      phone: res.detail.value
    })
    if (res.detail.value != '') {
      this.setData({
        hidden: false,
        btnValue: '验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  getCode(e) {
    var that = this;
    api.get_verify_code({
      data: {
        mobile: that.data.mobile_send
      }, success: (res) => {
        if (res.data.code == 200) {
          that.timer();
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  bindPass: function (res) {
    this.setData({
      pass: res.detail.value
    })
  },
  bindCodeInput: function (res) {
    this.setData({
      code: res.detail.value
    })
  },
  getCode1(e) {
    var that = this;
    api.get_verify_code({
      data: {
        mobile: that.data.newPhone
      }, success: (res) => {
        if (res.data.code == 200) {
          that.timer1();
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  timer1: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second1 = this.data.second1 - 1;
          this.setData({
            second1: second1,
            btnValue1: second1 + '秒',
            btnDisabled1: true
          })
          if (this.data.second1 <= 0) {
            this.setData({
              second1: 60,
              btnValue1: '验证码',
              btnDisabled1: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  bindCodeInput1: function (res) {
    this.setData({
      code1: res.detail.value
    })
  }
})