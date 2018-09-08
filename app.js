//app.js
App({
  data: {
   // baseUrl:'http://192.168.0.4:8083',
    //swagger-ui.html
    //baseUrl: 'https://zhaotemai.net'
    //测试服务器
    //baseUrl: 'http://203.195.209.148:8089',

    baseUrl: 'https://zhaotemai.net',
    //本地测试
   // baseUrl: 'http://192.168.0.4:8083'
   // baseUrl:'http://192.168.0.10:8090'
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null
  }
})