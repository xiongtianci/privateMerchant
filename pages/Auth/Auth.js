// pages/Auth/Auth.js
var network = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveShopLists:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          console.log("未授权")
        } else {
          console.log("已授权")
        }
      }
    })
  },
  //跳转店铺函数
  ToShop: function (e) {
    var that = this;
    var state = e.currentTarget.dataset.state;
    var shopId = e.currentTarget.dataset.shop;
    if (state == 0) {
      that.setData({
        haveShopLists: false,
        haveApplied: true,
      })
    } else if (state == 1) {
      wx.setStorageSync('shopID', e.currentTarget.dataset.shop)
      wx.switchTab({
        url: '../commodity/index'
      })
    } else if (state == 2) {
      wx.setStorageSync('shopID', e.currentTarget.dataset.shop)
      that.setData({
        applyFail: true,
      })
    }
  },
  //跳转修改店铺
  ToShopEdit: function () {
    wx.navigateTo({
      url: '../../pages/modifyshop/index',
    })
  },
  /**
   * 处理未绑定手机的情况
   */
  isApply: function(e) {
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log("不同意获取手机号")//此处的授权为手机号授权，若用户不同意，不必返回首页再次授权
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '未授权',
      //   success: function (res) {
      //     wx.navigateTo({
      //       url: '../login/index',
      //     })
      //   }
      // })
    } else {
      //同意获取手机号  校验用户当前sessionId是否有效
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          var data = {
            isExpire: 1,
            sessionId: wx.getStorageSync('sessionId'),
            piv: e.detail.iv,
            pencryptedData: e.detail.encryptedData
          }
          network.requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/bind', data, "POST", "绑定手机号", function (res) {
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
                  success: function (res) {
                    wx.redirectTo({
                      url: '../apply/index'
                    })
                  }
                })
              }
            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '小程序未授权',
                success: function (res) {
                  wx.redirectTo({
                    url: '../login/index',
                  })
                }
              })
            }
          }, function (res) {
            wx.showToast({
              icon: 'none',
              title: '绑定失败',
            })
          })
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
        }
      })
    }
  },

  /**
   * 跳转申请页面
   */
  toApply:function(e){
    var that = this;
    // 判断用户手机是否绑定
    var data = {
      sessionId: wx.getStorageSync("sessionId"),
    };
    network.requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/isBind', data, "POST", "正在提交", function (res) {
      if (res.success) {
        // 成功回调
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
          wx.navigateTo({
            url: '../apply/index',
          })
        }
      } else {
        that.isApply(e)
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },

  /**
   * 选择已有店铺
   */
  selectShopList: function() {
    var that = this;
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync("sessionId"),
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/listStore', data, function(res) {
      if (res.success) {
        //成功回调
        //缓存所有店铺信息到本地
        wx.setStorageSync('stores', res.data);
        that.setData({
          ShopLists: res.data,
          haveShopLists:true,
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  },

  /**
   * 关闭商铺列表蒙版
   */
  CloseMaskShopLists:function(){
    var that = this;
    that.setData({
      haveShopLists: false,
    })
  },
  /**
   * 关闭审批中蒙版
   */
  CloseMaskApplied: function () {
    var that = this;
    that.setData({
      haveApplied: false,
    })
  },
  /**
   * 关闭审批失败蒙版
   */
  CloseMaskFail: function () {
    var that = this;
    that.setData({
      applyFail: false,
    })
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