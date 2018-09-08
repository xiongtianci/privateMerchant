// pages/shopPhoto/index.js
var network = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopSrcArray: [], //店铺照片
    storePics: [],
    delArray: [],
  },
  //添加图片
  addPhoto: function(e) {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var len = that.data.shopSrcArray.length;
        var imgLen = res.tempFilePaths.length;
        var remain = 9 - len;
        console.log("remain", remain, len)
        if (remain > 0 && remain <= 9) {
          that.getCanvasImg(0, 0, res.tempFilePaths.slice(0, remain));    //进行压缩
        } else {
          wx.showToast({
            title: '不能多于9张',
            icon: 'fail',
            duration: 2000,
            mask: true
          });
        }
        return;
      }
    })
  },
  //压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
  getCanvasImg: function (index, failNum, tempFilePaths) {
    var that = this;
    if (index < tempFilePaths.length) {
      const ctx = wx.createCanvasContext('attendCanvasId');
      ctx.drawImage(tempFilePaths[index], 0, 0, 300, 150);
      ctx.draw(true, function () {
        index = index + 1;//上传成功的数量，上传成功则加1
        wx.canvasToTempFilePath({
          canvasId: 'attendCanvasId',
          success: function success(res) {
            that.uploadCanvasImg(res.tempFilePath);
            that.getCanvasImg(index, failNum, tempFilePaths);
          }, fail: function (e) {
            failNum += 1;//失败数量，可以用来提示用户
            that.getCanvasImg(inedx, failNum, tempFilePaths);
          }
        });
      });
    }
  },
  //上传图片
  uploadCanvasImg: function (canvasImg) {
    var that = this;
    let shopSrcArray = that.data.shopSrcArray;
    shopSrcArray.push(canvasImg);
    var tempImg = canvasImg;
    wx.uploadFile({
      url: getApp().data.baseUrl + '/ztm/api/file/upload',//文件服务器的地址
      filePath: tempImg,
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        sessionId: wx.getStorageSync('sessionId'),
      },
      name: 'file',
      success: function (res) {
        console.log(res)
        var storePics = that.data.storePics
        var resNew = JSON.parse(res.data)
        storePics.push(resNew.message)
        var tempPic = resNew.message;
        
        //console.log(that.data.shopPics)
        //更新图片
        //整理请求参数
        var data = {
          sessionId: that.data.sessionId,
          id: that.data.shopID,
          filePath: tempPic,
        };
        network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/gallery/add', data, "GET", "正在更新", function (res) {
          if (res.success) {
            //成功回调
            that.setData({
              storePics: storePics,
              shopSrcArray: shopSrcArray,
            })
          }
        }, function (res) {
          //失败回调
          console.log(res)
        })
      }
    })
  },
  //删除图片
  delPhoto: function(e) {
    var that = this;
    var shopID = wx.getStorageSync("shopID");
    // var sessionId = wx.getStorageSync("sessionId");
    var idx = e.currentTarget.dataset.id;
    var arr = that.data.shopSrcArray;
    var arr1 = that.data.storePics;
    wx.showModal({
      title: '提醒',
      cancelColor: "#3CC51F",
      confirmColor: "#ff0000",
      content: '确定删除该照片吗？',
      success: function(res) {
        if (res.confirm) {
          //删除商品照片
          var del = that.data.delArray;
          del.unshift(arr1[idx]);
          that.setData({
            delArray: del,
          });
          arr.splice(idx, 1);
          arr1.splice(idx, 1);
          //更新图片数组
          that.setData({
            shopSrcArray: arr
          })
          //整理请求参数
          var data = {
            sessionId: that.data.sessionId,
            id: that.data.shopID,
            filePath: that.data.delArray[0],
          };
          network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/gallery/delete', data, "GET", "正在更新", function(res) {
            if (res.success) {
              //成功回调
            }
          }, function(res) {
            //失败回调
            console.log(res)
          })
        } else if (res.cancel) {
          return
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.loginJudge() //检测登录状态

    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
    })

    //获取店铺照片
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      id: that.data.shopID,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/galleries', data, function(res) {
      if (res.success) {
        //成功回调
        // console.log(res)
        var shopImgArr = [];
        if (res.data.galleries){
         for (var i = 0; i < res.data.galleries.length; i++) {
           shopImgArr.push(res.data.galleries[i])
         }
       }
        // console.log('这是返回来的图片路径', shopImgArr)
        that.setData({
          shopSrcArray: shopImgArr,
          storePics: shopImgArr,
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