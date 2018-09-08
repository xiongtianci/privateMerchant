var network = require('../../utils/util.js');
var app = getApp()
// pages/shop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clerKFlag: true,
    haveApplied: false,
    ShopLists: [],
    ShowLists: false,
    shopInfo: {},
    dyArray: [],
    dzArray:[],
    showAddDY: false,
    shopID: wx.getStorageSync('shopID'),
    Jurisdiction: 1, //修改店铺信息的权限 0为普通店员，1为指派管理权店员或店主
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
    var ShopLists = wx.getStorageSync('stores');
    var clerKFlag = wx.getStorageSync('clerKFlag');
    console.log(ShopLists)
    that.setData({
      ShopLists: ShopLists,
      clerKFlag: clerKFlag
    })
    //console.log(that.data.ShopLists)
    network.loginJudge() //检测登录状态
    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
    })
    //console.log(that.data.shopID)
    //获取店铺信息
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      id: that.data.shopID,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/get', data, function(res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          'shopInfo.shopName': res.data.store.name,
          'shopInfo.managerTel': res.data.store.managerTel,
          'shopInfo.address': res.data.store.address,
          'shopInfo.describe': res.data.store.describe,
          'shopInfo.latitude': res.data.store.latitude,
          'shopInfo.longgitude': res.data.store.longgitude,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
    //店长列表
    that.getListClerkAdmin();
    //店员列表
    that.getlistClerk();
  },
  //查询店长列表
  getListClerkAdmin: function () {

    var that = this;

    //整理请求参数
    var data = {
      sessionId: this.data.sessionId,
      storeId: this.data.shopID,
      stype: 0,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/clerk/listClerk', data, function (res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          dzArray: res.data
        })
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },
  //获取店员列表
  getlistClerk: function() {
    var that = this;
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      storeId: that.data.shopID,
      stype:1,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/clerk/listClerk', data, function(res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          dyArray: res.data,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
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
  //切换店铺显示
  TabShowLists: function() {
    var that = this;
    //跳转至店铺列表页面
    wx.navigateTo({
      url: '../shop/shopList/index',
    })
  },
  //跳转至修改店铺简介页面
  ToDescribe: function() {
    if (this.data.clerKFlag) {
      return;
    }
    wx.navigateTo({
      url: '../shop/shopDescribe/index',
    })
  },
  //跳转至修改店铺名称页面
  onProductsItemTap: function (event) {
    var id=null;
    wx.navigateTo({
      url: '../shop/shopname/index',
    })
  },
  //跳转至修改店铺电话页面
  ToTel: function() {
    if (this.data.clerKFlag) {
      return;
    }
    wx.navigateTo({
      url: '../shop/shopTel/index',
    })
  },
  HideLists: function() {
    var that = this;
    that.setData({
      ShowLists: false,
    })
  },
  //继续申请店铺
  KeepApply: function() {
    wx.navigateTo({
      url: '../apply/index',
    })
  },

  //切换店铺
  TabShop: function(e) {
    var that = this;
    var state = e.currentTarget.dataset.state;
    var shopId = e.currentTarget.dataset.shop;
    if (state == 0) {
      that.setData({
        haveApplied: true,
      })
    } else if (state == 1) {
      //console.log(e.currentTarget.dataset.shop);
      wx.setStorageSync('shopID', e.currentTarget.dataset.shop);
      that.setData({
        shopID: shopId,
      })
      //获取切换的店铺信息
      //整理请求参数
      var data = {
        sessionId: that.data.sessionId,
        id: that.data.shopID,
      };
      network.request(getApp().data.baseUrl + '/ztm/api/seller/get', data, function(res) {
        if (res.success) {
          //成功回调
          //console.log(res)
          that.setData({
            'shopInfo.shopName': res.data.store.name,
            'shopInfo.phone': res.data.store.phoneNumber,
            'shopInfo.address': res.data.store.address,
            'shopInfo.describe': res.data.store.describe,
          })
        }
      }, function(res) {
        //失败回调
        console.log(res)
      })


    }

  },

  CloseMask: function() {
    var that = this;
    that.setData({
      haveApplied: false,
    })
    //wx.setStorageSync('haveApplied', 'false')
  },
  //修改店铺信息
  toChangeInfo: function() {
    wx.navigateTo({
      url: '../changeInfo/index',
    })
  },

  //转到店铺照片管理
  toshopPhoto: function() {
    wx.navigateTo({
      url: '../shopPhoto/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //添加店员
  showAdd: function() {
    var that = this;
    that.setData({
      showAddDY: true,
    })
  },
  DYPhone: function(e) {
    var that = this;
    that.setData({
      DYPhone: e.detail.value
    })
  },
  hiddenMask: function() {
    var that = this;
    that.setData({
      showAddDY: false,
    })
  },
  //添加店员到服务
  AddDY: function() {
    var that = this;
    var DYName = that.data.DYName;
    var DYPhone = that.data.DYPhone;
    if (DYPhone == '' || DYPhone == undefined) {
      wx.showToast({
        icon: 'none',
        title: '请输入店员的手机号码',
      })
    } else {
      //整理请求参数
      var data = {
        sessionId: that.data.sessionId,
        storeId: that.data.shopID,
        mobile: that.data.DYPhone,
      };
      network.requestLoading(getApp().data.baseUrl + '/ztm/api/clerk/addClerk', data, "POST", "正在添加", function(res) {
        if (res.success) {
          //成功回调
          that.getlistClerk();
          that.setData({
            showAddDY: false,
          })
          wx.showToast({
            icon: 'success',
            title: res.message,
            duration: 2000,
          })
        } else {
          console.log(res)
          that.setData({
            showAddDY: false,
          })
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000
          })
        }
      }, function(res) {
        //失败回调
        console.log(res)
      })
    }
  },
  changeManage: function() {
    wx.navigateTo({
      url: '../changeManage/index'
    })
  },
  deleteClerk: function () {
    wx.navigateTo({
      url: '../deleteClerk/index'
    })
  },
  removeDY: function() {
    wx.navigateTo({
      url: '../removeDY/index'
    })
  },
  //在地图上查看商铺地址
  openMap: function() {
    var that = this
    if (this.data.clerKFlag) {
      return;
    }
    var shopID = wx.getStorageSync("shopID");
    var sessionId = wx.getStorageSync("sessionId");
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        var addressTemp = "shopInfo.address";
        that.setData({
          [addressTemp]: res.address,
        })
        //整理请求参数
        var data = {
          sessionId: sessionId,
          storeId: shopID,
          address: res.address,
          longitude: res.longitude,
          latitude: res.latitude,
        };
        network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/updateStore', data, "POST", " 正在修改", function(res) {
          if (res.success) {
            //成功回调
            wx.navigateBack({
              delta: 1,
            });
          }
        }, function(res) {
          //失败回调
          console.log(res)
        })
      },
      fail: function() {},
      complete: function() {

      }
    })

  },
})