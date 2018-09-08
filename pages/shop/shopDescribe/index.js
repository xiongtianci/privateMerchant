var network = require('../../../utils/util.js');
var app = getApp()
// pages/shop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化数据
    describe:'',
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
  getDescribe:function(){
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
          describe: res.data.store.describe,
        })
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },
  //绑定商铺介绍变量
  bindDescribe:function(e){
    var that = this;
    that.setData({
      describe: e.detail.value,
    })
  },
  //更新商铺简介
  updateDescribe:function(){
    var that = this;
    var shopID = wx.getStorageSync("shopID");
    var sessionId = wx.getStorageSync("sessionId");
    //整理请求参数
    var data = {
      sessionId: sessionId,
      storeId: shopID,
      describe: that.data.describe,
    };
    network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/updateStore', data, "POST", "正在修改", function (res) {
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
    this.getDescribe();
  },
})