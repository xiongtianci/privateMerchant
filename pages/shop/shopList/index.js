var network = require('../../../utils/util.js');
var app = getApp()
// pages/shop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化数据
    ShopLists:[],
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
    //加载店铺信息
    this.getStores();
  },
  //切换店铺
  TabShop: function (e) {
    var that = this;
    var state = e.currentTarget.dataset.state;
    var shopId = e.currentTarget.dataset.shop;
    console.log(e)
    if (state == 0) {
      //提示商铺未审核
      wx.showModal({
        title: '提示',
        content: '商铺未被审核，请耐心等候',
      })
    } else if (state == 1) {
      console.log(e.currentTarget.dataset.shop);
      wx.setStorageSync('shopID', e.currentTarget.dataset.shop);
      wx.switchTab({
        url: '../../../pages/shop/index',
      })
    } else if (state == 2) {
      wx.setStorageSync('shopID', e.currentTarget.dataset.shop);
     wx.navigateTo({
       url: '../../../pages/modifyshop/index',
     })
    }
  },
  //获取用户店铺信息列表
  getStores:function(){
    var that = this;
    //刷新商铺列表
    var sessionId = wx.getStorageSync('sessionId');
    wx.request({
      url: getApp().data.baseUrl + '/ztm/api/seller/listStore', //用户店铺列表
      data: {
        sessionId: sessionId,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.success) { //有店铺列表
          //缓存所有店铺信息到本地
          wx.setStorageSync('stores', res.data.data);
          that.setData({
            ShopLists: res.data.data,
          })
        }
      }
    })
    var ShopLists = wx.getStorageSync('stores');
    console.log(ShopLists);
    that.setData({
      ShopLists: ShopLists,
    })
    console.log(that.data.ShopLists.length);
  },
  //继续申请店铺
  KeepApply: function () {
    wx.navigateTo({
      url: '../../apply/index',
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

  },
})