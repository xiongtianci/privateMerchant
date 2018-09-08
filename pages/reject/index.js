// pages/reject/index.js
var network = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TdInfo: {
      id: 1,
      imgSrc: '../resources/shop/tea.png',
      name: '【八马茶叶】八马茶业 如意大红袍  56克武夷岩茶礼品礼盒包邮',
      price: '500',
      count: '1',
    },
    shopState: ['状态1', '状态2', '状态3', '状态4'],
    rejectReason: ['状态1', '状态2', '状态3', '状态4'],
    shopSrcArray: [] //店铺照片
  },
  //货物状态选择
  state_Change: function (e) {
    this.setData({
      lbIdx: e.detail.value
    })
  },
  //驳回原因选择
  rejectReason: function (e) {
    this.setData({
      resIdx: e.detail.value
    })
  },

  shopIMG: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths.toString()
        var shopSrcArray = that.data.shopSrcArray
        if (shopSrcArray.length > 2) {
          wx.showToast({
            title: '不能多于3张',
            icon: 'none',
            duration: 2000
          })
        } else {
          shopSrcArray.unshift(tempFilePaths)
          that.setData({
            shopSrcArray: shopSrcArray
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  }
})