var network = require('../../../utils/util.js');
var app = getApp()
// pages/shop/shopname/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化数据
    name: '',
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取商铺介绍信息
  getName: function () {
    var that = this;
    var sessionId = wx.getStorageSync("sessionId");
    var shopID = wx.getStorageSync("shopID");
    //整理请求参数
    var data = {
      sessionId: sessionId,
      id: shopID,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/get', data, function (res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          name: res.data.store.name,
        })
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },
  //绑定商铺介绍变量
  bindName: function (e) {
    var that = this;
    // console.log(e.detail.value);
    that.setData({
      name: e.detail.value,
    })
  },
  //更新商铺简介
  updateTel: function () {
    var that = this;
    var shopID = wx.getStorageSync("shopID");
    var sessionId = wx.getStorageSync("sessionId");
    //整理请求参数
    var data = {
      sessionId: sessionId,
      storeId: shopID,
      name: that.data.name,
    };
    network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/updateStore', data, "POST", "提示文本", function (res) {
      if (res.success) {
        //成功回调
        wx.navigateBack({
          delta: 1,
        });
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getName();
  },
})