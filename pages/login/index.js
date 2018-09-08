//登录获取应用实例    
var network = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    haveApplied: false,
    applyFail: false,
    haveShopLists: false,
    ShopLists: [],
    isBind: wx.getStorageSync('isBind'),
    isTap: false,
    locked: false
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
    var that = this;
    var sessionId = wx.getStorageSync('sessionId');
    that.checkSessionState();
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

  },

  /**
   * 检测sessionId，有则跳转页面
   */
  checkSessionState: function() {
    var that = this;
    wx.checkSession({
      success: function(res) {
        //session_key 未过期，并且在本生命周期一直有效
        var sessionId = wx.getStorageSync('sessionId');
        //校验sessionId是否过期
        try {
          var sessionId = wx.getStorageSync('sessionId')
          if (sessionId !== null && sessionId !== '') {
            var data = {
              sessionId: sessionId,
            }
            network.requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/isLogin', data, "POST", "正在验证身份", function(res) {
              if (res.success) {
                that.judgeShopNumber() //判断店铺数量
              } else {
                wx.showModal({
                  title: '提示',
                  content: '用户信息已经过期请重新登录',
                })
              }
            }, function(res) {
              wx.showToast({
                icon: 'none',
                title: '加载数据失败',
              })
            })
          } else {
            return false;
          }
        } catch (e) {
          console.log(e)
        }
      },
      fail: function() {
        that.setData({
          isTap: false
        });
      },
      complete() {}
    })
  },

  // 判断用户店铺数量
  judgeShopNumber: function () {
    var that = this;
    var data = {
      sessionId: wx.getStorageSync("sessionId"),
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/listStore', data, function (res) {
      if (res.success && res.data.length == 1 && res.data[0].state == 1) {
        // 若只有一个店铺且店铺状态为通过审核则跳转店铺详情页面
        wx.setStorageSync('stores', res.data);
        wx.setStorageSync('shopID', res.data[0].deptId)
        wx.switchTab({
          url: '../commodity/index'
        })
      } else {
        //跳转店铺选择页面
        wx.redirectTo({
          url: '../Auth/Auth',
        })
      }
    }, function (res) {
      console.log(res)
    })
  },

  bindGetUserInfo: function(e) {
    var that = this;
    if (that.data.locked) {
      return;
    }
    that.setData({
      locked: true,
    })
    var code = null;
    console.log("sessionId:=======>", wx.getStorageSync("sessionId"));
    // 防止重复弹出
    if (that.isTap === true) {
      return;
    } else {
      that.setData({
        isTap: true
      });
    }
    wx.login({
      success: res => {
        console.info(res);
        if (res.errMsg == "login:ok") {
          try {
            code = res.code;
            if (code != null) {
              var data = {
                code: code,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
              }
              console.log('进入授权', data)
              network.requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/oauth', data, "POST", "正在登录", function(res) {
                console.log('授权成功返回用户信息', res)
                if (res.success) {
                  console.log('成功登陆', data)
                  wx.setStorageSync('sessionId', res.data.sessionId);
                  // 判断是否是二次登陆（已有手机号）
                  console.log('手机号码', res.data.data.mobile)
                  if (res.data.data.mobile != null) {
                    wx.setStorageSync('phoneNumber', res.data.data.mobile);
                    wx.setStorageSync('clerKFlag', res.data.data.clerKFlag);
                    wx.setStorageSync('clerKId', res.data.data.id);
                    getApp().data.phoneNumber = res.data.data.mobile;
                    wx.setStorageSync('isBind', true);
                  } else {
                    wx.setStorageSync('clerKFlag', res.data.data.clerKFlag);
                    wx.setStorageSync('clerKId', res.data.data.id);
                  }
                  //跳转店铺选择页面
                  wx.redirectTo({
                    url: '../Auth/Auth',
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '店铺入驻请先授权登录',
                    duration: 2500
                  });
                  that.setData({
                    isTap: false
                  });
                }
              }, function(res) {
                wx.showToast({
                  icon: 'none',
                  title: '登录验证失败',
                });
                that.setData({
                  isTap: false
                });
              })
            }
          } catch (e) {
            console.log(e);
            that.setData({
              isTap: false
            });
          }
        }
      },
      complete(e) {
        that.setData({
          isTap: false,
          locked: false,
        });
      }
    });
  },
  ToShop: function(e) {
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
  ToShopEdit: function() {
    wx.navigateTo({
      url: '../../pages/modifyshop/index',
    })
  },
  CloseMaskApplied: function() {
    var that = this;
    that.setData({
      haveApplied: false,
    })
    //wx.setStorageSync('haveApplied', 'false')
  },
  CloseMaskFail: function() {
    var that = this;
    that.setData({
      applyFail: false,
    })
  },
  //继续申请
  KeepApply: function() {
    var that = this;
    that.setData({
      haveShopLists: false,
    })
    if (that.data.isBind) {
      wx.redirectTo({
        url: '../apply/index',
      })
    } else {
      wx.redirectTo({
        url: '../bindPhone/index',
      })
    }
  },
  //关闭商铺蒙版弹窗
  CloseMaskShopLists: function() {
    // console.log("关闭店铺蒙版弹窗");
    var that = this;
    that.setData({
      haveShopLists: false,
    })
  }

})