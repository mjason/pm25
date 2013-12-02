// baidu api

var querystring = require('querystring')
var request = require('request')

var authConf = null
var header = {
  "Content-Type": "application/json"
}

exports.header = header

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

exports.sendCard = function () {

}

exports.regSubscriptions = function () {

}

exports.authCallback = function (code, callback) {
  var url = "https://accounts.google.com/o/oauth2/token"
  var params = config.server
  params['code'] = code
  request.get(url, params, function (err, response, body) {
    body = JSON.parse(body)
    authConf = body
    header['Authorization'] = 'Bearer ' + body.access_token
    callback()
  })
}
