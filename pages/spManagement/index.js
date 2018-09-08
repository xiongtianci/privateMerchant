// pages/spManagement/index.js
var network = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: [], //临时图片地址
    shopPics: [], //新的图片地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
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

  },




  //添加图片
  addPhoto: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths.toString()
        var imgSrc = that.data.imgSrc

        if (imgSrc.length > 8) {
          wx.showToast({
            title: '不能多于9张',
            icon: 'none',
            duration: 2000
          })
        } else {
          imgSrc.unshift(tempFilePaths)
          that.setData({
            imgSrc: imgSrc
          })

          wx.uploadFile({
            url: getApp().data.baseUrl + '/ztm/api/file/upload',
            filePath: that.data.imgSrc[0],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              sessionId: wx.getStorageSync('sessionId'),
            },
            success: function(res) {
              console.log(res)
              var shopPics = that.data.shopPics
              var resNew = JSON.parse(res.data)
              shopPics.unshift(resNew.message)
              that.setData({
                shopPics: shopPics,
              })
              //console.log(that.data.shopPics)
            },
            fail: function(res) {
              console.log(res)
            }
          })

        }

      }
    })
  },
  //删除图片
  delPhoto: function(e) {
    var that = this;
    var idx = e.currentTarget.dataset.id;
    var arr = that.data.imgSrc;
    wx.showModal({
      title: '提醒',
      cancelColor: "#3CC51F",
      confirmColor: "#ff0000",
      content: '确定删除该照片吗？',
      success: function(res) {
        if (res.confirm) {
          arr.splice(idx, 1);
          that.setData({
            imgSrc: arr,
          })
        } else if (res.cancel) {
          return
        }
      }
    })

  },

  //预览
  // showPhoto: function() {
  //   var that = this;
  //   var imgArr = that.data.photoSrc;
  //   wx.previewImage({
  //     current: '', // 当前显示图片的http链接
  //     urls: that.data.abc // 需要预览的图片http链接列表
  //   })
  // },

  //取值
  getShopName: function(e) { //商品名称
    console.log(2)
    var that = this;
    that.setData({
      goodsNameCh: e.detail.value
    })
  },
  getPrice: function(e) { //原价
    var that = this;
    that.setData({
      price: e.detail.value
    })
  },
  getShopName: function(e) { //商品名称
    var that = this;
    that.setData({
      goodsNameCh: e.detail.value
    })
  },
  getDiscountPrice: function(e) { //折扣价
    var that = this;
    that.setData({
      discountPrice: e.detail.value
    })
  },
  getGroupPrice: function(e) { //团购价
    var that = this;
    that.setData({
      groupPrice: e.detail.value
    })
  },

  bindDateChangeS: function(e) {
    this.setData({
      dateStart: e.detail.value
    })
  },
  bindDateChangeE: function(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },

  getMaxBuy: function(e) { //活动数量限制
    var that = this;
    that.setData({
      maxBuy: e.detail.value
    })
  },

  //创建
  AddSP: function() {
    var that = this;
    console.log(that.data)
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      id: '',
      goodsNameCh: that.data.goodsNameCh,
      categoryId: 1,
      price: that.data.price,
      discountPrice: that.data.discountPrice,
      groupPrice: that.data.groupPrice,
      beginDate: that.data.dateStart,
      endDate: that.data.dateEnd,
      maxBuy: that.data.maxBuy,
      merchants: that.data.shopID,
      goodsPics: that.data.shopPics,
    };
    network.requestLoading(getApp().data.baseUrl + '/ztm/api/goods/add', data, "POST", "正在添加", function(res) {
      if (res.success) {
        //成功回调
        wx.showToast({
          title: '创建商品成功',
          duration: 2500,
          complete: function() {
            wx.switchTab({
              url: '../commodity/index',
            })
          }
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  }
})