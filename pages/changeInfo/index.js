// pages/changeInfo/index.js
var network = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ShopLists: [],
    shopInfo: {},
    address: '',
    dyArray: [],
    showAddDY: false,
    shopID: wx.getStorageSync('shopID'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var ShopLists = wx.getStorageSync('stores')
    that.setData({
      ShopLists: ShopLists.data,
    })
    network.loginJudge() //检测登录状态
    var that = this;
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
          'shopInfo.phone': res.data.store.phoneNumber,
          'shopInfo.address': res.data.store.address,
          'shopInfo.describe': res.data.store.describe,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
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
    var that = this;
    var ShopLists = wx.getStorageSync('stores')
    //console.log(ShopLists.data)
    that.setData({
      ShopLists: ShopLists.data,
    })
    //console.log(that.data.ShopLists)
    network.loginJudge() //检测登录状态
    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
    })
    //店员列表
    that.getListClerk();
  },
  //查询店员列表
  getListClerk: function() {
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      storeId: that.data.shopID,
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

  //在地图上显示并选择地址
  openMap: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          roomname: res.name,
          longitude: res.longitude,
          latitude: res.latitude,
          'shopInfo.address': res.address,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }],
        })
      },

      fail: function() {},
      complete: function() {

      }
    })
  },
  //转到店铺照片管理
  toshopPhoto: function() {
    wx.navigateTo({
      url: '../shopPhoto/index'
    })
  },
  //添加店员
  showAdd: function() {
    var that = this;
    that.setData({
      showAddDY: true,
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
      network.requestLoading(getApp().data.baseUrl + '/ztm/api/clerk/addClerk', data, "POST", "添加中", function(res) {
        if (res.success) {
          //成功回调
          //刷新店员列表
          that.getListClerk();
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
  removeDY: function() {
    wx.navigateTo({
      url: '../removeDY/index'
    })
  },

  // 修改信息
  // 取值
  getName: function(e) {
    var that = this;
    that.setData({
      abc: e.detail.value
    })
    console.log(that.data.abc)
  }
})