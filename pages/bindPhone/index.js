// pages/bindPhone/index.js
var network = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  getPhoneNumber: function(e) {
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {
          wx.navigateTo({
            url: '../login/index',
          })
        }
      })
    } else {
      //同意获取手机号  校验用户当前sessionId是否有效
      wx.checkSession({
        success: function() {
          //session_key 未过期，并且在本生命周期一直有效
          var data = {
            isExpire: 1,
            sessionId: wx.getStorageSync('sessionId'),
            piv: e.detail.iv,
            pencryptedData: e.detail.encryptedData
          }
          network.requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/bind', data, "POST", "绑定手机号", function(res) {
            console.log(res)
            if (res.success) {
              wx.setStorageSync('phoneNumber', res.data.data.mobile)
              getApp().data.phoneNumber = res.data.data.mobile;
              wx.setStorageSync('isBind', true)
              if (res.data.data.clerKFlag) { //用户是店员
                //店员分指派的管理员和普通店员
                if (res.data.data.authFlag == 1) { //1为指派管理员
                  //console.log('你是指派管理员')
                  wx.setStorageSync('shopID', res.data.data.storeId);
                  wx.setStorageSync('dyId', res.data.data.dyId);
                  wx.setStorageSync('Jurisdiction', 1);
                  wx.switchTab({
                    url: '../commodity/index',
                  })
                } else {
                  //console.log('你是普通管理员')
                  wx.setStorageSync('shopID', res.data.data.storeId);
                  wx.setStorageSync('dyId', res.data.data.dyId);
                  wx.setStorageSync('Jurisdiction', 0);
                  wx.switchTab({
                    url: '../commodity/index',
                  })
                }
              } else if (!res.data.data.clerKFlag) { //用户是店主
                wx.setStorageSync('Jurisdiction', 1);
                wx.showToast({
                  icon: 'success',
                  title: '绑定成功',
                  success: function(res) {
                    wx.redirectTo({
                      url: '../apply/index'
                    })
                  }
                })
              }
            } else {
              wx.showToast({
                icon: 'none',
                title: '未成功',
              })
            }

          }, function(res) {
            wx.showToast({
              icon: 'none',
              title: '绑定失败',
            })

          })
        },
        fail: function() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
        }
      })
    }

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