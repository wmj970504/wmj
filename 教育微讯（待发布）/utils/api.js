var config = require('config.js')
const wxRequest = (params, url) => {
  var token = wx.getStorageSync('token') || '';
  wx.request({
    url: url + '?token=' + token,
    method: params.method || 'POST',
    data: params.data || {},
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: (res) => {
      // console.log(res)
      if(res.data.code == 100){
        wx.showToast({
          title: res.data.msg,
          icon:"none",
          duration:1500
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '/pages/login/login',
          })
        },1500)
      }
      params.success && params.success(res)
      //wx.hideToast()
    },
    fail: (res) => {
      params.fail && params.fail(res)
    },
    complete: (res) => {
      params.complete && params.complete(res)
    }
  })
}

//------首页 start ---------

//分享小程序、帖子/问答
const share = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/share/');
//添加收藏
const add_favorite = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/add_favorite/');
//投诉举报帖子/问答
const report_community = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/report_community/');
//删除评论下的讨论
const delete_discuss = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/delete_discuss/');
//评论详情及讨论列表
const comment_detail = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/comment_detail/');
//删除帖子评论
const delete_comment = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/delete_comment/');
//点赞评论
const add_comment_stars = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/add_comment_stars/');
//发表评论中讨论
const add_comment_discuss = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/add_comment_discuss/');
//搜索结果,用户查看更多
const search_history_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/search_history_list/');
//帖子列表
const community_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/community_list/');
//删除搜索历史记录
const delete_search_history = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/delete_search_history/');
//发布评论
const add_comment = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/add_comment/');
//关注/取消关注用户
const fallow_user = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/fallow_user/');
//帖子点赞/取消点赞
const add_star = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/add_star/');
//帖子详情
const community_detail = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/community_detail/');
//搜索结果，查看更多用户
const search_more_users = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/search_more_users/');



//------首页 end ---------



//------我的 start ---------

//我的积分
const my_integral = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/my_integral/');
//贡献值
const contribution_detail = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/contribution_detail/');
//积分明细
const my_integral_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/my_integral_list/');
//兑换商品
const add_save_order = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/add_save_order/');
//兑换预览页
const add_order = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/add_order/');
//商品详情
const goods_detail = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/goods_detail/');
//商品列表
const goods_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/goods_list/');
//领取额外积分奖励
const get_extra_integral = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/get_extra_integral/');
//我的签到列表
const my_sign_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/my_sign_list/');
//签到(操作)
const add_signin = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/add_signin/');
//上传头像图片
const upload_avatar = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/upload_avatar/');
//编辑保存我的信息
const save_user_info = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/save_user_info/');
//我的收藏
const favorite_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/favorite_list/');
//个人中心(我的,顶上的数据)
const user_center = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/user_center/');
const user_info = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/user_info/');

//------我的 end  ----------

//-----消息 start ------------

//用户消息中心
const message_center = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/message_center/');
//删除帖子消息
const delete_community_message = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/delete_community_message/');
//帖子、问答消息详情
const community_message_detail = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/community_message_detail/');
//消息列表 10系统消息,20置顶通知,30收藏通知,40审核通知，50分享通知，60删除通知
const get_message_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/get_message_list/');
//评论、点赞消息
const community_message_list = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/community_message_list/');
//删除消息
const delete_message = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/delete_message/');
//消息详情
const message_detail = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/message/message_detail/');

//-----消息 end --------------


//-----微信授权第三方 start
//关于我们或用户协议
const get_verify_code = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/get_verify_code/');
//获取短信验证码
const agreement_info = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/agreement_info/');
//短信授权注册
const register = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/register/');
//登录(短信验证/密码)
const login = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/login/');
//重新设置密码
const reset_password = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/reset_password/');
//验证验证码(重置密码时使用)
const verify_code = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/verify_code/');
//退出登录
const logout = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/logout/');

const qrcode_login = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/account/qrcode_login/');
//-----微信授权第三方  end

// 分享
const qr_share = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/community/share/');



// new  发布接口 

const upload_file = config.HTTP_BASE_URL + 'api/community/upload_file/' + '?token=' + wx.getStorageSync('token') || '';//上传文件
const province_list = config.HTTP_BASE_URL + 'api/community/province_list/';// 全部部分省列表
const city_list = config.HTTP_BASE_URL + 'api/community/city_list/';//当前的城市
const share_img = (params) => wxRequest(params, config.HTTP_BASE_URL + '/api/user/share_img/')

module.exports = {
  share,
  add_favorite,
  report_community,
  delete_discuss,
  comment_detail,
  delete_comment,
  add_comment_stars,
  add_comment_discuss,
  search_history_list,
  community_list,
  delete_search_history,
  add_comment,
  fallow_user,
  add_star,
  my_integral,
  contribution_detail,
  my_integral_list,
  add_save_order,
  add_order,
  goods_detail,
  goods_list,
  get_extra_integral,
  my_sign_list,
  add_signin,
  upload_avatar,
  save_user_info,
  message_center,
  delete_community_message,
  community_message_detail,
  get_message_list,
  community_message_list,
  delete_message,
  message_detail,
  community_detail,
  favorite_list,
  agreement_info,
  get_verify_code,
  register,
  login,
  reset_password,
  verify_code,
  search_more_users,
  user_center,
  logout,
  qrcode_login,
  user_info,
  upload_file,
  province_list,
  city_list,
  share_img,
  qr_share
}
