// pages/spManagement/index.js
var network = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locked:false,
    commodityInfo: {},
    ClassifyArrayID: [], //商品分类(有id)
    ClassifyArray: [], //商品分类
    imgSrc: [], //临时图片地址
    shopPics: [], //新的图片地址
    Company: ['件', '盒', '公斤', '瓶'], //单位待修改数据
    delArray:[],//删除图片数组
    intro:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/goods/listGoodsType', data, function(res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          ClassifyArrayID: res.data,
        })
        var strArr = [];
        for (var i = 0; i < res.data.length; i++) {
          strArr.push(res.data[i].typeName)
        }
        that.setData({
          ClassifyArray: strArr,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })

    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
      spID: options.spID,
    })
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync('sessionId'),
      id: that.data.spID,
      merchants: wx.getStorageSync('shopID'),
    };
    network.request(getApp().data.baseUrl + '/ztm/api/goods/get', data, function(res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          commodityInfo: res.data.goodsInfo,
          imgSrc: res.data.goodsInfo.rollPicAry,
          shopPics: res.data.goodsInfo.rollPicAry,
        })
        var cid = res.data.goodsInfo.categoryId;
        //设置原来商品分类ID
        that.setData({
          'commodityInfo.ClassifyID': cid,
        })
        var cids = that.data.ClassifyArrayID;
        console.log(cid);
        console.log(cids[0].id);
        //循环找出商品分类id的索引
        for (var i = 0; i < cids.length; i++) {
          if (cid == cids[i].id) {
            console.log(i);
            that.setData({
              index: i,
            })
            break;
          }
        }
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
    var that = this;

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

  bindPickerChange1: function (e) { //单位

    var idx = e.detail.value;
    this.setData({
      index1: e.detail.value,
    })

    this.setData({
      CompanyName: this.data.Company[idx]
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

  //添加图片
  addPhoto: function() {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var len = that.data.imgSrc.length;
        var imgLen = res.tempFilePaths.length;
        var remain = 9 - len;
        console.log("remain", remain)
        if (remain > 0) {
          that.setData({
            locked: true
          })
          that.getCanvasImg(0, 0, res.tempFilePaths.slice(0, remain));    //进行压缩
        } else {
          wx.showToast({
            title: '不能多于9张',
            icon: 'none',
            duration: 2000
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
            that.uploadCanvasImg(res.tempFilePath, index, tempFilePaths.length);
            that.getCanvasImg(index, failNum, tempFilePaths);
          }, fail: function (e) {
            failNum += 1;//失败数量，可以用来提示用户
            // that.getCanvasImg(inedx, failNum, tempFilePaths);
          }
        });
      });
    }
  },
  //上传图片
  uploadCanvasImg: function (canvasImg, current, sum) {
    var that = this;
    let imgSrc = that.data.imgSrc;
    imgSrc.push(canvasImg);
    that.setData({
      imgSrc: imgSrc,
    })
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
        var shopPics = that.data.shopPics
        var resNew = JSON.parse(res.data)
        shopPics.push(resNew.message)
        that.setData({
          shopPics: shopPics,
        })
        //console.log(that.data.shopPics)
        //更新图片
        //整理请求参数
        var data = {
          sessionId: that.data.sessionId,
          storeId: that.data.shopID,
          shopPics: that.data.shopPics,
        };
        network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/updateStore', data, "POST", "正在更新", function (res) {
          if (res.success) {
            //成功回调
          }
        }, function (res) {
          //失败回调
          console.log(res)
        })
      },
      complete: function () {
        if (current === sum) {
          // console.log("解锁")
          // 递归返回时解锁按钮
          that.setData({
            locked: false
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
    var arr1 = that.data.shopPics
    wx.showModal({
      title: '提醒',
      cancelColor: "#3CC51F",
      confirmColor: "#ff0000",
      content: '确定删除该照片吗？',
      success: function(res) {
        if (res.confirm) {
          var del = that.data.delArray;
          if (arr[idx].indexOf("/pics/goodsInfo/")>-1){
            del.push(arr[idx]);
            that.setData({
              delArray: del,
            })
          }
          arr.splice(idx, 1);
          arr1.splice(idx,1);
          that.setData({
            shopPics: arr1,
            imgSrc:arr
          })
        } else if (res.cancel) {
          return
        }
      }
    })

  },
  //点击放大图片
  previewPhoto:function(e){
    var that = this;
    var idx = e.currentTarget.dataset.id;
    console.log(idx);
    var arr = [];
    arr.push(that.data.imgSrc[idx]);
    wx.previewImage({
      urls: arr // 需要预览的图片http链接列表
    })
  },
  //商品下架
  DelSP: function() {
    var that = this;
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      ids: that.data.spID,
      status: 2,
      merchants: that.data.shopID,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/goods/updateGoodsStatus', data, function(res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        wx.switchTab({
          url: '../commodity/index',
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  },
  //商品上架
  AddSP: function() {
    var that = this;
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      onlineFlag: 1, //1为在架，2为下架
      page: 1,
      rows: 8,
      merchants: that.data.shopID,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/goods/query', data, function (res) {
      if (res.success) {
        //成功回调
        console.log(res)
        that.setData({
          onLineNumber: res.data.length,
        })
        console.log(res.data.length)
      } else {
        that.setData({
          onLineNumber: 0,
        })
      }
      if (that.data.onLineNumber + 1 > 8) {
        wx.showToast({
          title: '在架商品不能多于8个',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      //整理请求参数
      var data = {
        sessionId: that.data.sessionId,
        ids: that.data.spID,
        status: 1,
        merchants: that.data.shopID,
      };
      network.request(getApp().data.baseUrl + '/ztm/api/goods/updateGoodsStatus', data, function (res) {
        if (res.success) {
          //成功回调
          //console.log(res)
          wx.switchTab({
            url: '../commodity/index',
          })
        }
      }, function (res) {
        //失败回调
        console.log(res)
      })
    }, function (res) {
      //失败回调
      console.log(res)
    })
    
  },
  // --------------------------------------------------------
  //更新修改值
  getShopName: function(e) { //商品名称
    var that = this;
    that.setData({
      'commodityInfo.goodsNameCh': e.detail.value
    })
  },
  getPrice: function(e) { //原价
    var that = this;
    that.setData({
      'commodityInfo.price': e.detail.value
    })
  },
  getDiscountPrice: function(e) { //折扣价
    var that = this;
    that.setData({
      'commodityInfo.discountPrice': e.detail.value
    })
  },
  getGroupPrice: function(e) { //团购价
    var that = this;
    that.setData({
      'commodityInfo.groupPrice': e.detail.value
    })
  },
  getIntro: function (e) { //团购价
    var that = this;
    that.setData({
      'commodityInfo.intro': e.detail.value
    })
  },

  bindPickerChange: function(e) { //分类
    var that = this;
    var idx = e.detail.value;
    var ClassifyArrayID = that.data.ClassifyArrayID;
    var ClassifyID = ClassifyArrayID[idx].id;

    this.setData({
      index: e.detail.value,
    })
    that.setData({
      'commodityInfo.ClassifyID': ClassifyID,
    })
    //console.log('商品分类的id', that.data.commodityInfo.ClassifyID)
  },
  getStockNumber: function(e) { //库存
    var that = this;
    that.setData({
      'commodityInfo.stockNumber': e.detail.value
    })
  },
  bindDateChangeS: function(e) { //开始时间
    this.setData({
      'commodityInfo.beginDateStr': e.detail.value
    })
  },
  bindDateChangeE: function(e) { //结束时间
    this.setData({
      'commodityInfo.endDateStr': e.detail.value
    })
  },
  getMinBuy: function(e) { //活动数量最大限制
    var that = this;
    that.setData({
      'commodityInfo.minBuy': e.detail.value
    })
  },
  getMaxBuy: function(e) { //活动数量最大限制
    var that = this;
    that.setData({
      'commodityInfo.maxBuy': e.detail.value
    })
  },



  SaveSP: function() {
    var that = this;
    //添加非空校验
    if (that.data.commodityInfo.goodsNameCh == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写商品名称',
      })
      return;
    }
    if (that.data.commodityInfo.price == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写原价',
      })
      return;
    }
    if (that.data.commodityInfo.discountPrice == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写折后价',
      })
      return;
    }
    if (that.data.commodityInfo.groupPrice == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写团购价',
      })
      return;
    }
    if (parseFloat(that.data.commodityInfo.price) < parseFloat(that.data.commodityInfo.discountPrice)) {
      wx.showModal({
        title: '温馨提示',
        content: '折后价不得大于原价',
      })
      return;
    }
    if (parseFloat(that.data.commodityInfo.discountPrice) < parseFloat(that.data.commodityInfo.groupPrice)) {
      wx.showModal({
        title: '温馨提示',
        content: '团购价不得大于折后价',
      })
      return;
    }

    if (that.data.commodityInfo.ClassifyID == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未选择商品分类',
      })
      return;
    }
    if (that.data.commodityInfo.stockNumber == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写库存数量',
      })
      return;
    }
    if (that.data.commodityInfo.beginDateStr == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未选择活动开始时间',
      })
      return;
    }
    if (that.data.commodityInfo.endDateStr == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未选择活动结束时间',
      })
      return;
    }
    if (that.data.commodityInfo.intro == "") {
      wx.showModal({
        title: '温馨提示',
        content: '商品详情不能为空',
      })
      return;
    }
    if (that.data.commodityInfo.minBuy == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写最小购买量',
      })
      return;
    }
    if (that.data.commodityInfo.maxBuy == "") {
      wx.showModal({
        title: '温馨提示',
        content: '未填写允许的最大购买量',
      })
      return;
    }
    if (that.data.shopPics == []) {
      wx.showModal({
        title: '温馨提示',
        content: '商品图片数量不能小于1',
      })
      return;
    }
    if (parseInt(that.data.commodityInfo.minBuy) > parseInt(that.data.commodityInfo.maxBuy)) {
      wx.showModal({
        title: '温馨提示',
        content: '最小购买量不得大于最大购买量',
      })
      return;
    }
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      id: that.data.spID,
      goodsNameCh: that.data.commodityInfo.goodsNameCh,
      categoryId: that.data.commodityInfo.ClassifyID,
      price: that.data.commodityInfo.price,
      discountPrice: that.data.commodityInfo.discountPrice,
      groupPrice: that.data.commodityInfo.groupPrice,
      stockNumber: that.data.commodityInfo.stockNumber,
      beginDate: that.data.commodityInfo.beginDateStr,
      endDate: that.data.commodityInfo.endDateStr,
      maxBuy: that.data.commodityInfo.maxBuy,
      minBuy: that.data.commodityInfo.minBuy,
      merchants: that.data.shopID,
      goodsPics: that.data.shopPics,
      clertId: wx.getStorageSync('clerKId'),
      intro:that.data.commodityInfo.intro,
    };
    network.requestLoading(getApp().data.baseUrl + '/ztm/api/goods/add', data, "POST", "正在更新", function(res) {
      if (res.success) {
        //成功回调
        wx.showToast({
          title: '修改成功',
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  }
})