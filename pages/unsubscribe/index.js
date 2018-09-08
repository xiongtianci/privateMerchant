// pages/unsubscribe/index.js
var network = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    TdInfo: {
      id: 1,
      imgSrc: '../resources/shop/tea.png',
      name: '武夷山玫瑰花茶1',
      specifications: '5g*10包礼盒罐装',
      price: '500',
      original_price: '1000',
      count: '1',
      real_pay: '500',
      cancel_order: false
    },
    ResultInfo: {
      id: 1,
      title: '买家申请退款',
      date: '2018/07/10 10:20:02',
      apply: '仅退款',
      state: '未提货',
      reason: '不想要了',
      tkMoney: '500'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  rejectTK: function() {
    wx.navigateTo({
      url: '../reject/index'
    })
  },

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