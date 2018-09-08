//格式化日期方法（仅供log页面使用）
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//格式化数字（仅供格式化日期方法用）
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//格式化当前日期
function GetFormatDate(){
  var date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return year+'-'+month+'-'+day;
}
//远程请求
function request(url, params, success, fail) {
  this.requestLoading(url, params, "GET",'加载中', success, fail)
}
//封装远程请求函数
function requestLoading(url, params, method, message, success, fail) {
  //console.log(params)
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      //'Content-Type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: method,
    success: function(res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        fail()
      }
    },
    fail: function(res) {
      console.log("请求不成功")
      console.log(res);
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      wx.showModal({
        title: '提示',
        content: '请求不成功',
      })
      fail()
    },
    complete: function(res) {

    },
  })
}
//校验用户登陆态
function checkClientLogin() {
  var that = this;
  //console.log('检查用户登录状态')
  try {
    var sessionId = wx.getStorageSync('sessionId')
    if (sessionId !== null && sessionId !== '') {
      var data = {
        sessionId: sessionId,
      }
      requestLoading(getApp().data.baseUrl + '/ztm/seller/auth/isLogin', data, "POST", "正在验证身份", function(res) {
        if (res.success) {
          //console.log(res)
          return true;
        } else {
          console.log('自动登录失败')
          wx.redirectTo({
            url: '../login/index',
          })
          return false;
        }

      }, function(res) {
        wx.showToast({
          icon: 'none',
          title: '加载数据失败',
        })

      })
    } else {
      return false;
    }
  } catch (e) {
    console.log(e)
  }
}
//登陆校验，若没校验则跳转至登陆页面
function loginJudge() {
  try {
    var sessionId = wx.getStorageSync('sessionId')
  } catch (e) {

  }
  if (sessionId == null || sessionId == '' || typeof(sessionId) == "undefined") {
    wx.redirectTo({
      url: '../login/index',
    })
  } else {
    getApp().data.sessionId = sessionId;
    this.checkClientLogin();
  }
}
/** 
 * 坐标转换，百度地图坐标转换成腾讯地图坐标 
 * @param lat  百度坐标纬度 
 * @param lon  百度坐标经度 
 * @return 返回结果：纬度,经度 
 */
function tx_lon(lat, lon) {
  var tx_lat;
  var tx_lon;
  var x_pi = 3.14159265358979324;
  var x = lon - 0.0065,
    y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  tx_lon = z * Math.cos(theta);
  return tx_lon;
}

function tx_lat(lat, lon) {
  var tx_lat;
  var tx_lon;
  var x_pi = 3.14159265358979324;
  var x = lon - 0.0065,
    y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  tx_lat = z * Math.sin(theta);
  return tx_lat;
}
module.exports = {
  formatTime: formatTime,
  GetFormatDate: GetFormatDate,
  request: request,
  requestLoading: requestLoading,
  checkClientLogin: checkClientLogin,
  loginJudge: loginJudge,
  tx_lat: tx_lat,
  tx_lon: tx_lon,
}