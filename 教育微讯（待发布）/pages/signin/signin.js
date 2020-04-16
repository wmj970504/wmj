// pages/signin/signin.js 
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    sign_days_style: [],
    is_sign:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.get_sign_list(this.data.year,this.data.month)
  },

  //获取签到列表
  get_sign_list: function (year, month) {
    this.setData({
      sign_days_style: [],
    })
    api.my_sign_list({
      data: {
        year: year,
        month: month,
      },
      success: (res) => {
        console.log(res.data.data );
        var sign_list = new Array()
        for (var item of res.data.data.list) {
          var list = new Object()
          list.month = 'current';
          list.day = item.day;
          list.color = "white";
          list.background = "#1FC987";
          sign_list.push(list)
        }

        console.log(sign_list)
        this.setData({
          reward_list: res.data.data.reward,//签到奖励
          days: res.data.data.days,//连续签到
          total_days: res.data.data.total_days,//累计签到
          date_list: res.data.data.list,//签到日期
          is_sign: res.data.data.is_sign,//是否签到
          sign_days_style: sign_list,//签到后的日期
          sign_cover: res.data.data.sign_cover // 签到背景图
        })
      }
    })
  },
  // 月份切换
  dateChange: function (e) {
    var year = e.detail.currentYear;
    var month = e.detail.currentMonth;
    this.get_sign_list(year, month)
  },
  // 当天签到
  add_signin: function() {
    var that = this;
    api.add_signin({
      data: {
        year: that.data.year,
        month: that.data.month,
        day: that.data.day
      },
      success: (res) => {
        if (res.data.code == 200) {
          that.setData({
            is_sign:true
          })
          wx.showToast({
            title: res.data.msg,
            icon:"none",
            duration:1500
          })
          setTimeout(function(){
            that.get_sign_list()
          },1500)
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
  // 领取签到奖励
  getpoin: function(e) {
    var that = this;
    api.get_extra_integral({
      data: {
        signin_id: e.currentTarget.dataset.id
      },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '领取成功',
          })
          
          var id = e.currentTarget.dataset.id
          var list = that.data.reward_list;
          for (var item of list) {
            if (item.id == id) {
              item.status = 30
            }
          }
          that.setData({
            reward_list: list
          })
        }
      }
    })
  }
})