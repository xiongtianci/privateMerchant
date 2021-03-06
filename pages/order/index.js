var network = require('../../utils/util.js');
Page({

      /**
       * 页面的初始数据
       */
      data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        WeiTiHuo: []
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
          var that = this;

          /** 
           * 获取系统信息 
           */
          wx.getSystemInfo({

            success: function(res) {
              that.setData({
                winWidth: res.windowWidth,
                winHeight: res.windowHeight
              });
            }

          });
        },
        bindChange: function(e) {

          var that = this;
          that.setData({
            currentTab: e.detail.current
          });

        },
        swichNav: function(e) {

          var that = this;

          if (this.data.currentTab === e.target.dataset.current) {
            return false;
          } else {
            that.setData({
              currentTab: e.target.dataset.current
            })
          }
        },

        dealWith: function(){
          wx.navigateTo({
            url: '../unsubscribe/index'
          })
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
        scanCode: function(){
          wx.scanCode({
            success: (res) => {
              console.log(res)
            }
          })
        }
      })