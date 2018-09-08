var network = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    locked:false,
    flagStart:0,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    allSelect: false, //全选状态
    allSelectB: false, //全选状态
    temArr: [], //临时数组，存放选择或待下架商品
    onLineShop: [],
    downLineShop: [],
    newShop: [],
    imgSrc: [], //临时图片地址
    shopPics: [], //新的图片地址
    ClassifyArrayID: [], //商品分类(有id)
    ClassifyArray: [], //商品分类
    Company: ['件', '盒', '公斤', '瓶'], //单位待修改数据
    onLineNumber: 0,
    intro:'',
    // 新增商品数据字段
    commodityInfo: {
      name: "",
      original_price: "",
      getDiscountPrice: "",
      getGroupPrice: "",
      group_price: "",
      limit: ""
    },
    //初始化数据
    goodsType: "", // for show in the view
    now: network.GetFormatDate(),
    dateStart: "",
    dateEnd: "",
    categoryId: "",
    discountPrice: "",
    goodsNameCh: "",
    goodsPics: [],
    maxBuy: "",
    minBuy: "",
    price: "",
    stockNumber: "",
    //分页数据
    page: 1,
    rows: 1000,
    hasMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onShow: function() {
    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
    })
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync('sessionId'),
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
    //刷新商品列表
    if (that.data.flagStart>0){
      this.queryGoods();
    }
    that.setData({
      flagStart: that.data.flagStart + 1,
    })
  },
  //查询上下架商品
  queryGoods: function(flag) {
    var that = this;
    //查询在架、下架商品信息
    that.setData({
      page: 1,
      downLineShop: [],
    })
    this.queryonline();
    this.queryDownLine();
  },
  //查询上架
  queryonline: function() {
    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
    })
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync('sessionId'),
      onlineFlag: 1, //1为在架，2为下架
      page: 1,
      rows: 8,
      merchants: that.data.shopID,
    };
    network.request(getApp().data.baseUrl + '/ztm/api/goods/query', data, function(res) {
      if (res.success) {
        //成功回调
        console.log(res)
        that.setData({
          onLineShop: res.data,
          onLineNumber: res.data.length,
        })
        console.log(res.data.length)

      } else {
        that.setData({
          onLineNumber: 0,
          onLineShop: [],
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  },
  //查询下架
  queryDownLine: function() {
    var that = this;
    //判断是否还有数据
    if (!that.data.hasMore){
      wx.showToast({
        title: '已经没有数据了',
      })
      return;
    }
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      shopID: wx.getStorageSync('shopID'),
    })
    var that = this;
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync('sessionId'),
      onlineFlag: 2, //1为在架，2为下架
      page: that.data.page,
      rows: that.data.rows,
      merchants: that.data.shopID,
    };
    if (that.data.page == 1) {
      that.setData({
        downLineShop: [],
      })
    }
    network.request(getApp().data.baseUrl + '/ztm/api/goods/query', data, function(res) {
      if (res.success) {
        //成功回调
        //console.log(res)
        that.setData({
          downLineShop: that.data.downLineShop.concat(res.data),
        })
      } else {
        that.setData({
          hasMore:false,
        })
        // wx.showToast({
        //   title: '已经没有数据了',
        // })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  },
  onLoad: function(options) {
    var that = this;
    //获取商品列表
    that.queryGoods(true);
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

  loadMore: function() {
    var that = this;
    that.setData({
      page: that.data.page + 1,
    })
    that.queryDownLine();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //商品在架选择
  select: function(e) {
    var that = this;
    let arr2 = [];
    var arr = that.data.onLineShop;
    var index = e.currentTarget.dataset.id;
    arr[index].iconChecked = !arr[index].iconChecked;
    //console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].iconChecked) {
        arr2.push(arr[i])
      }
    };
    that.setData({
      onLineShop: arr,
      temArr: arr2
    })
  },
  //商品下架选择
  selectB: function(e) {
    var that = this;
    let arr2 = [];
    var arr = that.data.downLineShop;
    var index = e.currentTarget.dataset.id;
    arr[index].iconChecked = !arr[index].iconChecked;
    //console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].iconChecked) {
        arr2.push(arr[i])
      }
    };
    that.setData({
      downLineShop: arr,
      temArr: arr2
    })
  },
  //商品下架
  deleteitem: function() {
    var that = this;
    let arr = that.data.onLineShop;
    let arr2 = [];
    let arr_select = [];
    let spPickId = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].iconChecked == false) {
        arr2.push(arr[i]);
      }
      if (arr[i].iconChecked == true) {
        arr_select.push(arr[i]);
        spPickId.push(arr[i].id);
      }
    }
    that.setData({
      spPickId: spPickId,
    })
    console.log(spPickId.join(","))
    if (arr_select.length == 0) {
      wx.showToast({
        title: '请选择要下架的商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '提醒',
        content: '是否下架选中商品？',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              onLineShop: arr2,
              temArr: []
            })
            //整理请求参数
            var data = {
              sessionId: wx.getStorageSync('sessionId'),
              ids: that.data.spPickId.join(","),
              status: 2,
              merchants: that.data.shopID,
            };
            network.request(getApp().data.baseUrl + '/ztm/api/goods/updateGoodsStatus', data, function(res) {
              if (res.success) {
                //成功回调
                //console.log(res)
                wx.showToast({
                  title: res.message,
                })
                that.setData({
                  hasMore: true,
                })
              }
              that.queryGoods(false);
            }, function(res) {
              //失败回调
              console.log(res)
            })

          } else if (res.cancel) {
            return
          }
        }
      })
    }
  },
  uploadItem: function() {
    var that = this;
    let arr = that.data.downLineShop;
    let arr2 = [];
    let arr_select = [];
    let spPickId = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].iconChecked == false) {
        arr2.push(arr[i]);
      }
      if (arr[i].iconChecked == true) {
        arr_select.push(arr[i]);
        spPickId.push(arr[i].id);
      }
    }
    that.setData({
      spPickId: spPickId,
    })
    //console.log(spPickId.join(","))
    if (arr_select.length == 0) {
      wx.showToast({
        title: '请选择要上架的商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      var onLineNumber = parseInt(that.data.onLineNumber);
      if (onLineNumber + arr_select.length > 8) {
        wx.showToast({
          title: '在架商品不能多于8个',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.showModal({
        title: '提醒',
        content: '是否上架选中商品？',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              downLineShop: arr2,
              temArr: []
            })
            //整理请求参数
            var data = {
              sessionId: wx.getStorageSync('sessionId'),
              ids: that.data.spPickId.join(","),
              status: 1,
              merchants: that.data.shopID,
            };
            network.request(getApp().data.baseUrl + '/ztm/api/goods/updateGoodsStatus', data, function(res) {
              if (res.success) {
                //成功回调
                //console.log(res)
                wx.showToast({
                  title: res.message,
                })
              }
              that.queryGoods(false);
            }, function(res) {
              //失败回调
              console.log(res)
            })
          } else if (res.cancel) {
            return
          }
        }
      })
    }
  },
  //商品全选
  select_all: function() {
    let that = this;
    that.setData({
      allSelect: !that.data.allSelect
    })
    if (that.data.allSelect) {
      let arr = that.data.onLineShop;
      let arr2 = [];
      let spPickId = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].iconChecked == true) {
          arr2.push(arr[i]);
        } else {
          arr[i].iconChecked = true;
          arr2.push(arr[i]);
          spPickId.push(arr[i].id);
        }
      }
      that.setData({
        onLineShop: arr2,
        temArr: arr2,
        spPickId: spPickId,
      })
    }
  },
  select_allB: function() {
    let that = this;
    that.setData({
      allSelectB: !that.data.allSelectB
    })
    if (that.data.allSelectB) {
      let arr = that.data.downLineShop;
      let arr2 = [];
      let spPickId = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].iconChecked == true) {
          arr2.push(arr[i]);
        } else {
          arr[i].iconChecked = true;
          arr2.push(arr[i]);
          spPickId.push(arr[i].id);
        }
      }
      that.setData({
        downLineShop: arr2,
        temArr: arr2,
        spPickId: spPickId,
      })
    }
  },
  // 取消全选
  select_all_cancel: function() {
    let that = this;
    that.setData({
      allSelect: !that.data.allSelect
    })
    let arr = that.data.onLineShop;
    let arr2 = [];
    let spPickId = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].iconChecked = false;
      arr2.push(arr[i]);
      spPickId.push(arr[i].id);
    }
    that.setData({
      onLineShop: arr2,
      temArr: [],
      spPickId: spPickId,
    })
  },
  select_allB_cancel: function() {
    let that = this;
    that.setData({
      allSelectB: !that.data.allSelectB
    })
    let arr = that.data.downLineShop;
    let arr2 = [];
    let spPickId = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].iconChecked = false;
      arr2.push(arr[i]);
      spPickId.push(arr[i].id);
    }
    that.setData({
      downLineShop: arr2,
      temArr: [],
      spPickId: spPickId,
    })
  },
  //转到商品管理
  toManagement: function(e) {
    var spID = e.currentTarget.id;
    wx.navigateTo({
      url: '../spUpdate/index?spID=' + spID
    })
  },
  // ---------------------------------------------------
  //添加图片
  addPhoto: function() {
    var that = this
    //添加图片时锁住创建按钮
    
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var len = that.data.imgSrc.length;
        var imgLen = res.tempFilePaths.length;
        var remain = 9 - len;
        console.log("remain", remain)
        if (remain >= 0) {
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
  uploadCanvasImg: function (canvasImg,current,sum) {
    var that = this;
    let imgSrc = that.data.imgSrc;
    imgSrc.push(canvasImg);
    that.setData({
      imgSrc: imgSrc,
    })
    console.log(imgSrc)
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
      },
      complete:function(){
        if(current === sum) {
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
  delPhoto: function(event) {
    var that = this;
    var idx = event.currentTarget.dataset.id;
    var arr = that.data.imgSrc;
    var arr1 = that.data.shopPics;
    wx.showModal({
      title: '提醒',
      cancelColor: "#3CC51F",
      confirmColor: "#ff0000",
      content: '确定删除该照片吗？',
      success: function(res) {
        if (res.confirm) {
          //删除本地图片数组
          arr.splice(idx, 1);
          arr1.splice(idx, 1);
          that.setData({
            imgSrc: arr,
            shopPics: arr1,
          })
        } else if (res.cancel) {
          return
        }
      }
    })

  },
  //取值
  getShopName: function(e) { //商品名称
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
  getIntro: function (e) { //团购价
    var that = this;
    that.setData({
      intro: e.detail.value
    })
  },

  bindPickerChange: function(e) { //分类

    var idx = e.detail.value;
    var ClassifyArrayID = this.data.ClassifyArrayID;
    var ClassifyID = ClassifyArrayID[idx].id;

    this.setData({
      index: e.detail.value,
    })
    this.setData({
      ClassifyID: ClassifyID,
    })
    this.setData({
      goodsType: this.data.ClassifyArray[idx]
    })
    //console.log('商品分类的id', that.data.ClassifyID)
  },

  bindPickerChange1: function(e) { //单位

    var idx = e.detail.value;
    this.setData({
      index1: e.detail.value,
    })

    this.setData({
      CompanyName: this.data.Company[idx]
    })
  },

  getStockNumber: function(e) { //库存
    var that = this;
    that.setData({
      stockNumber: e.detail.value
    })
  },
  bindDateChangeS: function(e) { //开始时间
    this.setData({
      dateStart: e.detail.value,
      dateEnd: "",
    })
  },
  bindDateChangeE: function(e) { //结束时间
    this.setData({
      dateEnd: e.detail.value
    })
  },
  getMinBuy: function(e) { //活动数量最大限制
    var that = this;
    that.setData({
      minBuy: e.detail.value
    })
  },
  getMaxBuy: function(e) { //活动数量最大限制
    var that = this;
    that.setData({
      maxBuy: e.detail.value
    })
  },
  //清空
  clearSP: function() {
    var that = this;
    that.setData({
      ['commodityInfo.name']: '',
      ['commodityInfo.original_price']: '',
      ['commodityInfo.discount']: '',
      ['commodityInfo.group_price']: '',
      ['commodityInfo.stockNumber']: '',
      ['commodityInfo.limit']: '',
      maxBuy: '',
      minBuy: '',
      dateStart: '',
      dateEnd: '',
      imgSrc: [], //临时图片地址
      shopPics: [], //新的图片地址
    })
  },
  //创建
  AddSP: function() {
    var that = this;
    if (that.data.locked){
      console.log("未上传完")
      return;
    }
    var onLineNumber = parseInt(that.data.onLineNumber);
    if (onLineNumber + 1 > 8) {
      wx.showToast({
        title: '在架商品不能多于8个',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      goodsTypeControl: "",
      isclick:true
    });
    console.log("create")
    //return ;
    var that = this;
    var onLineNumber = parseInt(that.data.onLineNumber);
    if (onLineNumber > 8) {
      wx.showToast({
        icon: none,
        title: '在架商品不能多于8个',
      })
    } else {
      //添加非空校验
      if (that.data.goodsNameCh == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未填写商品名称',
        })
        return;
      }
      if (that.data.price == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未填写原价',
        })
        return;
      }
      // if (that.data.discountPrice == "") {
      //   wx.showModal({
      //     title: '温馨提示',
      //     content: '未填写折后价',
      //   })
      //   return;
      // }
      if (that.data.groupPrice == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未填写团购价',
        })
        return;
      }
      if (parseFloat(that.data.price) < parseFloat(that.data.groupPrice)) {
         wx.showModal({
           title: '温馨提示',
           content: '团购价不得大于原价',
         })
         return;
      }
      // if (parseFloat(that.data.price) < parseFloat(that.data.discountPrice)) {
      //   wx.showModal({
      //     title: '温馨提示',
      //     content: '折后价不得大于原价',
      //   })
      //   return;
      // }
      // if (parseFloat(that.data.discountPrice) < parseFloat(that.data.groupPrice)) {
      //   wx.showModal({
      //     title: '温馨提示',
      //     content: '团购价不得大于折后价',
      //   })
      //   return;
      // }

      if (that.data.ClassifyID == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未选择商品分类',
        })
        return;
      }
      if (that.data.stockNumber == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未填写库存数量',
        })
        return;
      }
      if (that.data.dateStart == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未选择活动开始时间',
        })
        return;
      }
      if (that.data.dateEnd == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未选择活动结束时间',
        })
        return;
      }
      if (that.data.intro == "") {
        wx.showModal({
          title: '温馨提示',
          content: '商品介绍不能为空',
        })
        return;
      }
      if (that.data.minBuy == "") {
        wx.showModal({
          title: '温馨提示',
          content: '未填写最小购买量',
        })
        return;
      }
      if (that.data.maxBuy == "") {
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
      if (parseInt(that.data.minBuy) > parseInt(that.data.maxBuy)) {
        wx.showModal({
          title: '温馨提示',
          content: '最小购买量不得大于最大购买量',
        })
        return;
      }
      //整理请求参数
      var data = {
        sessionId: wx.getStorageSync('sessionId'),
        goodsNameCh: that.data.goodsNameCh,
        categoryId: that.data.ClassifyID,
        price: that.data.price,
        discountPrice: that.data.discountPrice,
        groupPrice: that.data.groupPrice,
        stockNumber: that.data.stockNumber,
        beginDate: that.data.dateStart,
        endDate: that.data.dateEnd,
        minBuy: that.data.minBuy,
        maxBuy: that.data.maxBuy,
        merchants: that.data.shopID,
        goodsPics: that.data.shopPics,
        clertId: wx.getStorageSync('clerKId'),
        intro: that.data.intro,
      };
      network.requestLoading(getApp().data.baseUrl + '/ztm/api/goods/add', data, "POST", "正在添加", function(res) {
        if (res.success) {
          //成功回调
          wx.showToast({
            title: '创建商品成功',
            duration: 2500,
            complete: function() {
              that.queryGoods(false);
              wx.switchTab({
                url: '../commodity/index',
              })
            }
          })
          that.setData({
            currentTab: 0,
            imgSrc: [],
            shopPics:[],
            commodityInfo: {},
            ClassifyID: "",
            goodsType: "",
            dateStart: "",
            dateEnd: "",
            isclick: false,
            intro:'',
          });
        }
      }, function(res) {
        //失败回调
        console.log(res)
        that.setData({
          isclick:false,
        })
      })
    }
  }
})