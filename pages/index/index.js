//登录获取应用实例    
var network = require('../../utils/util.js');
var app = getApp()
Page({
  data: {

  },
  bindGetUserInfo: function(e) {
    var that = this;
    var code = null;
    wx.login({
      success: res => {
        code = res.code;
        //console.log(code)
        wx.getSetting({
          success: function(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  //console.log(res)
                  var data = {
                    code: code,
                    iv: res.iv,
                    encryptedData: res.encryptedData,
                  }
                  console.log(data);
                  network.requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/oauth', data, "POST", "正在登录", function(res) {
                    console.log(res)
                    if (res.success) {
                      try {
                        wx.setStorageSync('sessionId', res.data.sessionId)
                        wx.setStorageSync('isBind', res.data.isBind)
                        wx.setStorageSync('clerKFlag', res.data.data.clerKFlag)
                        wx.setStorageSync('clerKId', res.data.data.id)
                        getApp().data.sessionId = res.data.sessionId;
                        getApp().data.isBind = res.data.isBind;
                        if (!res.isBind) {
                          wx.showModal({
                            title: '提示',
                            content: '授权登录成功,为了您的微信账号安全，暂不能进行绑定手机操作，请在入驻申请中绑定您的手机号',
                            confirmText: '马上绑定',
                            success: function(res) {
                              if (res.cancel) {
                                wx.redirectTo({
                                  url: '../index/index',
                                })
                              } else if (res.confirm) {
                                wx.redirectTo({
                                  url: '../bindPhone/index',
                                })
                              }
                            }
                          })
                        } else {
                          wx.redirectTo({
                            url: '../apply/index',
                          })
                        }
                      } catch (e) {}
                    } else {
                      wx.showToast({
                        title: '',
                      })
                    }

                  }, function(res) {
                    wx.showToast({
                      icon: 'none',
                      title: '登录验证失败',
                    })

                  })


                }
              })
            }
          }
        })
      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})