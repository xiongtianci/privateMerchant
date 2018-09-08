// pages/shopLB/index.js
var network = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopLB: [],
    iconChecked:[],
    temArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoreType();
  },
  //获取商铺类别
  getStoreType:function(){
    var that = this;
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/listStoreType', data, function (res) {
      if (res.success) {
        //成功回调
        // console.log(res.data)
        var Checked = [];
        for(var i=0;i<res.data.length;i++){
          Checked.push(false);
        }
        that.setData({
          shopLB: res.data,
          iconChecked:Checked,
        })
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },
  //保存
  save: function () {
    var that = this;
    wx.setStorageSync("shopLBIds", that.data.temArr);
    wx.setStorageSync("shopLBNames", that.data.temNameArr);
    wx.navigateBack({
      delta: 1,
    })
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
  
  },
  select: function (e) {
    var that = this;
    var arr2 = [];
    var arr3 = '';
    var arr = that.data.shopLB;
    var index = e.currentTarget.dataset.id;
    arr[index].iconChecked = !arr[index].iconChecked;
    //console.log(arr);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].iconChecked) {
        arr2.push(arr[i].id)
        arr3 = arr3 + " " + arr[i].typeName
      }
    };
    that.setData({
      shopLB: arr,
      temArr: arr2,
      temNameArr: arr3,
    })
  }
})