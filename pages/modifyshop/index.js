// pages/apply/index.js
var network = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    locked: false,
    //初始化数据
    phoneNumber: '',
    shopLB: [],
    shopLBPick: [],
    roomname: '', //地址
    address: '', //详细地址
    businessLicense: '',
    certDown: '',
    certUp: '',
    describe: '',
    latitude: '',
    legalRepr: '',
    legalReprTel: '',
    longitude: '',
    managerName: '',
    managerTel: '',
    name: '',
    orgName: '',
    telNb: '',
    workInfos: '',
    shopPL: [],
    shopPLPick: [],
    licenseSrc: '../resources/shop/license.png', //营业执照
    card_positiveSrc: '../resources/shop/add_pic.png', //身份证正面
    card_backSrc: '../resources/shop/add_pic.png', //身份证反面
    shopSrcArray: [], //店铺照片
    storePics: [],
    shopOffLine: false // 线上线下店铺 分类信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      sessionId: wx.getStorageSync('sessionId'),
      managerTel: wx.getStorageSync('phoneNumber')
    })
    //店铺类型 商户类别
    //整理请求参数
    var data = {
      sessionId: wx.getStorageSync('sessionId')
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/listStoreType', data, function(res) {
      if (res.success) {
        //成功回调
        // console.log(res.data)
        that.setData({
          shopLB: res.data,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
    that.getStoreInfo();
  },
  //加载原本信息
  getStoreInfo: function () {
    var that = this;
    //整理请求参数
    var data = {
      sessionId: that.data.sessionId,
      id: wx.getStorageSync("shopID")
    };
    network.request(getApp().data.baseUrl + '/ztm/api/seller/get', data, function (res) {
      if (res.success) {
        //成功回调
        console.log(res.data)
        var store = res.data.store;
        var types = res.data.types;
        var typesTemp = '';
        //获取店铺类型
        for (var i = 0; i < types.length-1;i++){
          typesTemp = typesTemp + types[i].typeName+','
        }
        typesTemp = typesTemp.substring(0, typesTemp.length-1);
        // console.log(typesTemp)
        that.setData({
          orgName: store.orgName,
          legalRepr: store.legalRepr,
          legalReprTel: store.legalReprTel,
          telNb: store.phoneNumber,
          name: store.name,
          describe: store.describe,
          managerName: store.managerName,
          managerTel: store.managerTel,
          roomname: store.address,
          address:store.address,
          licenseSrc: store.businessLicence,
          businessLicense:store.businessLicence,
          card_positiveSrc: store.certUp,
          certUp: store.certUp,
          card_backSrc: store.certDown,
          certDown: store.certDown,
          shopSrcArray: store.storePics,
          storePics: store.storePics,
          shopLBNames:typesTemp,
          shopLBPick: store.storeType.split(','),
        })
      }
    }, function (res) {
      //失败回调
      console.log(res)
    })
  },
  //切换实体或线上店铺事件
  changeShop(event) {
    parseInt(event.currentTarget.dataset.type) === 1 ? this.setData({
      shopOffLine: false
    }) : this.setData({
      shopOffLine: true
    });
  },
  //商户类别选择
  pickLB: function(e) {
    var that = this;
    var arr = that.data.shopLB;
    var arr2 = [];
    var index = e.currentTarget.dataset.id;
    arr[index].Checked = !arr[index].Checked;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Checked == true) {
        arr2 = [];
        arr = that.data.shopLB;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].Checked) {
            arr2.push(arr[i].id);
          }
        }
      }
    }
    if (arr2.length > 6) {
      wx.showToast({
        icon: 'none',
        title: '商户类别选择不能多于6项',
      })
      arr[index].Checked = !arr[index].Checked
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].Checked == true) {
          arr2 = [];
          arr = that.data.shopLB;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].Checked) {
              arr2.push(arr[i].id);
            }
          }
        }
      }

    }
    that.setData({
      shopLB: arr,
      shopLBPick: arr2
    })
    // console.log(that.data.shopLBPick)
  },
  //在地图上显示并选择地址
  openMap: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          roomname: res.name,
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }],
        })
      },
      fail: function() {},
      complete: function() {}
    })
  },
  //选择上传营业执照图片
  chooseImg: function(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths.toString();
        var arr = [];
        arr.push(tempFilePaths);
        //console.log(arr)
        that.setData({
          //设置营业执照路径
          licenseSrc: arr
        })
        //console.log(that.data.licenseSrc[0])
        //上传营业执照
        wx.uploadFile({
          url: getApp().data.baseUrl + '/ztm/api/file/upload',
          filePath: that.data.licenseSrc[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            sessionId: wx.getStorageSync('sessionId'),
          },
          success: function(res) {
            console.log(res)
            var resNew = JSON.parse(res.data)
            that.setData({
              businessLicense: resNew.message,
            })
            console.log(that.data.businessLicense)
          },
          fail: function(res) {
            console.log(res)
          }
        })

      }
    })
  },
  //选择上传身份证正面图片
  IdCardZ: function(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          //设置身份证正面路径
          card_positiveSrc: tempFilePaths
        })

        wx.uploadFile({
          url: getApp().data.baseUrl + '/ztm/api/file/upload',
          filePath: that.data.card_positiveSrc[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            sessionId: wx.getStorageSync('sessionId'),
          },
          success: function(res) {
            console.log(res);
            var resNew = JSON.parse(res.data)
            //console.log(resNew.message)
            that.setData({
              certUp: resNew.message,
            })
          },
          fail: function(res) {
            console.log(res)
          }
        })

      }
    })
  },
  //选择上传身份证反面图片
  IdCardF: function(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          //设置身份证反面路径
          card_backSrc: tempFilePaths
        })
        wx.uploadFile({
          url: getApp().data.baseUrl + '/ztm/api/file/upload',
          filePath: that.data.card_backSrc[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            sessionId: wx.getStorageSync('sessionId'),
          },
          success: function(res) {
            console.log(res);
            var resNew = JSON.parse(res.data)
            that.setData({
              certDown: resNew.message,
            })
          },
          fail: function(res) {
            console.log(res)
          }
        })
      }
    })
  },
  //选择上传商铺图片
  shopIMG: function(e) {
    var that = this;
    if (that.data.shopSrcArray.length >= 9) {
      return;
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var len = that.data.shopSrcArray.length;
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
    let shopSrcArray = that.data.shopSrcArray;
    shopSrcArray.push(canvasImg);
    that.setData({
      shopSrcArray: shopSrcArray,
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
        var storePics = that.data.storePics;
        var resNew = JSON.parse(res.data);
        storePics.push(resNew.message);
        that.setData({
          storePics: storePics,
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
  //获取data里需要的各种value
  getOrgName: function(e) {
    var that = this;
    that.setData({
      orgName: e.detail.value
    })
  },
  getlegalRepr: function(e) {
    var that = this;
    that.setData({
      legalRepr: e.detail.value
    })
  },
  getlegalReprTel: function(e) {
    var that = this;
    that.setData({
      legalReprTel: e.detail.value
    })
  },
  getTelNb: function(e) {
    var that = this;
    that.setData({
      telNb: e.detail.value
    })
  },
  getDescribe: function(e) {
    var that = this;
    that.setData({
      describe: e.detail.value
    })
  },
  getName: function(e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  getManagerName: function(e) {
    var that = this;
    that.setData({
      managerName: e.detail.value
    })
  },
  getManagerTel: function(e) {
    var that = this;
    that.setData({
      managerTel: e.detail.value
    })
  },
  //提交入驻申请
  submitApply: function(e) {
    var that = this;
    if (that.data.locked) {
      console.log("未上传完")
      return;
    }
    that.setData({
      sessionId: wx.getStorageSync('sessionId')
    })
    //提交前进行非空校验
    if (that.data.orgName == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写工商注册店铺名',
      })
      return;
    }
    if (that.data.legalRepr == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写法人代表',
      })
      return;
    }
    if (that.data.legalReprTel == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写法人代表联系电话',
      })
      return;
    }
    if (that.data.address == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写详细地址',
      })
      return;
    }
    if (that.data.telNb == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写商户电话',
      })
      return;
    }
    if (that.data.telNb) {
      //手机正则表达式
      var m_reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      //座机正则表达式
      var p_reg = /0\d{2}-\d{7,8}/;
      var isMobile = m_reg.test(that.data.telNb);
      var isPhone = p_reg.test(that.data.telNb);
      if(!isPhone&&!isMobile){
        wx.showModal({
          title: '温馨提示',
          content: '请输入有效商铺电话',
        })
        return;
      }
    }
    
    if (that.data.businessLicense == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未上传营业执照',
      })
      return;
    }
    if (that.data.certUp == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未上传身份证正面',
      })
      return;
    }
    if (that.data.certDown == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未上传身份证反面',
      })
      return;
    }
    if (that.data.storePics == []) {
      wx.showModal({
        title: '温馨提示',
        content: '店铺图片不能少于一张',
      })
      return;
    }
    if (that.data.name == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写线上店铺名',
      })
      return;
    }
    if (that.data.describe == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写商户简介',
      })
      return;
    }
    if (that.data.managerName == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写负责人姓名',
      })
      return;
    }
    if (that.data.managerTel == '') {
      wx.showModal({
        title: '温馨提示',
        content: '未填写负责人电话',
      })
      return;
    }
    //整理请求参数
    var data = {
      storeType: that.data.shopLBPick,
      operationType: that.data.shopPLPick,
      sessionId: that.data.sessionId,
      storeId: wx.getStorageSync("shopID"),
      orgName: that.data.orgName,
      legalRepr: that.data.legalRepr,
      legalReprTel: that.data.legalReprTel,
      workInfos: that.data.workInfos,
      address: that.data.address,
      telNb: that.data.telNb,
      describe: that.data.describe,
      name: that.data.name,
      managerName: that.data.managerName,
      managerTel: that.data.managerTel,
      businessLicense: that.data.businessLicense,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      certUp: that.data.certUp,
      certDown: that.data.certDown,
      storePics: that.data.storePics,
    };
    network.requestLoading(getApp().data.baseUrl + '/ztm/api/seller/updateStore', data, "POST", "正在提交", function(res) {
      if (res.success) {
        //成功回调
        wx.setStorageSync('haveApplied', 'true')
        wx.redirectTo({
          url: '../login/index',
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
    }, function(res) {
      //失败回调
      console.log(res)
    })
  },
  //删除商铺图片
  delPhoto(event) {
    var index = event.currentTarget.dataset.id;
    var shopSrcArray = this.data.shopSrcArray;
    var storePics = this.data.storePics;
    shopSrcArray.splice(index, 1);
    storePics.splice(index, 1);
    this.setData({
      shopSrcArray: shopSrcArray,
      storePics: storePics
    })
  },
  //跳转商品类别
  ToShopLB:function(){
    var that = this;
    wx.navigateTo({
      url: '../../pages/shopLB/index',
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
    that.setData({
      shopLBPick: wx.getStorageSync("shopLBIds"),
      shopLBNames: wx.getStorageSync("shopLBNames")
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
    wx.setStorageSync("shopLBIds", '');
    wx.setStorageSync("shopLBNames", '');
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