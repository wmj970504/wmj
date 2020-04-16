App({
    onLaunch: function () {
        console.log('App Launch')
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false,
        userInfo: null,
        url: "https://wz.jiaoyuweixun.com/"
        //url:"http://ecuca.net:10229/",
        // url: "http://10229.demoby.com/", 
        //url: "http://192.168.0.15:10229",; 
    }
});