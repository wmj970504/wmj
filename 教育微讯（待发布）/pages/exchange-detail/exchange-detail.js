// pages/exchange-detail/exchange-detail.js
var address = require("../../utils/moke.js")
import api from '../../utils/api.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
      info:[],
      animationAddressMenu: {},
      addressMenuIsShow: false,
      value: [0, 0, 0],
      provinces: [],
      citys: [],
      areas: [],
      areaInfo: '',
      phone:'',
      type: '',//10实物  20 话费
      addressdetail:'',//详细地址
      username:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
      type:options.type 
    })

    //兑换预览页面
    api.add_order({
      data:{
        goods_id:options.goods_id
      },
      success:(res)=>{
          this.setData({
             info:res.data.data
          })
      }
    })
	},
  select: function (e) {
    // 如果已经显示，不在执行显示动画
    if (this.data.addressMenuIsShow) {
      return false
    } else {
      // 执行显示动画
      this.startAddressAnimation(true)
    }
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      this.animation.translateY(0 + 'vh').step()
    } else {
      this.animation.translateY(40 + 'vh').step()
    }
    this.setData({
      animationAddressMenu: this.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    this.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
    })
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation
  },
  bindphone:function(e){
      this.setData({
        phone: e.detail.value
      })
  },
  changeSub:function(e){
    var _address = '';
    console.log(this.data.addressdetail);
    if (this.data.addressdetail == ''){
      _address = this.data.areaInfo + ' (充话费)'
    }else{
      _address = this.data.areaInfo + ' (实物收件地址)';
    }

    api.add_save_order({
      data:{
        goods_id: e.currentTarget.dataset.id,
        mobile:this.data.phone,
        address: _address,
        user_name: this.data.username,
        detail:this.data.addressdetail
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code == 200){
            wx.showToast({
              title: '兑换成功',
            })
            this.setData({
              phone:'',
              areaInfo: '',
              addressdetail: '',//详细地址
              username: ''
            })
            wx.navigateBack({
              delta:1
            })
        }
      }
    })
  },
  bindAddrDetail:function(e){
      this.setData({
        addressdetail:e.detail.value
      })
  },
  bindName:function(e){   
      this.setData({
          username: e.detail.value
      })
  }
})