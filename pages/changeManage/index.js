// pages/changeManage/index.js
var network = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dyArray: [],
    temArr: [],
    pickId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //店员列表
    that.getListClerk();
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
  //查询店员列表
  getListClerk: function() {
   var that=this;
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync('sessionId'),
      storeId: wx.getStorageSync('shopID'),
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
  //选中店员
  select: function(e) {
    var that = this;
    let arr2 = [];
    var arr = that.data.dyArray;
    var index = e.currentTarget.dataset.id;

    for (var i = 0; i < arr.length; i++) {
      arr[i].Checked = false;
    }
    arr[index].Checked = !arr[index].Checked;
    if (arr[index].Checked) {
      arr2 = [];
      arr2.push(arr[index]);
    }
    that.setData({
      dyArray: arr, //显示选中
      temArr: arr2, //取出选中
      pickId: arr2[0].id,
    })
    console.log(that.data.temArr)
  },
  //转让管理
  changeManage: function() {
    var that = this;
    var DY = that.data.temArr; //取出选中的店员 arr 单选
    if (DY == '') {
      wx.showToast({
        icon: 'none',
        title: '请选择店员',
      })
    } else {
      //整理请求参数
      var data = {
        sessionId: wx.getStorageSync('sessionId'),
        storeId: wx.getStorageSync('shopID'),
        clerkId: that.data.pickId,
      };
      network.requestLoading(getApp().data.baseUrl + '/ztm/api/clerk/assign', data, "POST", "提示文本", function(res) {
        if (res.success) {
          //成功回调
          wx.switchTab({
            url: '../shop/index',
          })
          wx.showToast({
            icon: 'success',
            title: '转让管理成功',
            duration: 2500,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '未成功',
          })
        }
      }, function(res) {
        //失败回调
        console.log(res)
      })
    }

  }
})