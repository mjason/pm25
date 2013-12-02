/*
 * 把所有api都封装到这里, 方便我们后续的调用
*/

var querystring = require('querystring')
var request = require('request')
var config = require('./config.json')

var authConf = null
var header = {
  "Content-Type": "application/json"
}

exports.header = header

// 根据经纬度获取城市
exports.getCity = function (lat, lng, callback) {
  var params = {
    location: [lat, lng].join(','),
    output: 'json',
    key: 'E63764836bb55cb89d883098663436f8'
  }
  var paramsString = querystring.stringify(params)
  var url = "http://api.map.baidu.com/geocoder?" + paramsString

  request.get(url, function (error, response, body) {
    body = JSON.parse(body)
    callback(body['result']['addressComponent']['city'])
  })

}

// 根据城市获取pm25的数据
exports.getPm25 = function (city, callback) {
  var params = {
    city: city,
    token: "f8yc8s3jf3dpmdLgjKqJ"
  }
  var paramsStirng = querystring.stringify(params)
  var url = "http://www.pm25.in/api/querys/pm2_5.json?" + paramsStirng
  
  console.log(url)

  request.get(url, function (err, response, body) {
    body = JSON.parse(body)  
    callback(body.pop().aqi)
  })
}

// 发送卡片
exports.sendCard = function (card) {
  var url = "https://www.googleapis.com/mirror/v1/timeline"
  request.post(url, { 
    headers: header,
    body: JSON.stringify(card)
  }, function (err, response, body) {
    console.log(body)
  })
}

// 注册一个Subscriptions
exports.regSubscriptions = function (callbackUrl, userToken, verifyToken) {
  var url = "https://www.googleapis.com/mirror/v1/subscriptions"
  var params = {
    callbackUrl: callbackUrl,
    collection: "timeline",
    operation: ['UPDATE'],
    userToken: userToken,
    verifyToken: verifyToken
  }

  request.post(url, {
    headers: header,
    body: JSON.stringify(params)
  }, function (err, response, body) {
    console.log(body)
  })
}

// 授权成功的callback
exports.authCallback = function (code, callback) {
  var url = "https://accounts.google.com/o/oauth2/token"
  var params = config.server
  params['code'] = code
  request.post(url, {
    form: params
  }, function (err, response, body) {
    body = JSON.parse(body)
    authConf = body
    header['Authorization'] = 'Bearer ' + body.access_token
    callback()
  })
}

// 获取用户地理信息
exports.locations = function (callback) {
  var url = "https://www.googleapis.com/mirror/v1/locations/latest"
  request.get(url, {
    headers: header
  }, function (err, response, body) {
    body = JSON.parse(body)
    callback(body.latitude, body.longitude)
  })
}