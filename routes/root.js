var needle = require('needle')
var config = require('../config.json')
var https = require('https')
var request = require('request')
var api = require('../api')

var header = {
  "Content-Type": "application/json"
}

var timelineurl = "https://www.googleapis.com/mirror/v1/timeline"

module.exports = function (app) {
  
  // 构建主页
  app.get('/', function (req, res) {
    res.render('index')  
  })

  // callback 完成认证
  app.get('/callback', function (req, res) {
    // var url = "https://accounts.google.com/o/oauth2/token"
    // // var params = config.server
    // // params['code'] = req.param('code')

    api.authCallback(req.param('code'), pushPm25Card)

    

    needle.post(url, params, function (err, response, body) {
      header['Authorization'] = 'Bearer ' + body.access_token
      pushPm25Card(body.access_token, res)
    })
  })

  // 推送卡片
  function pushPm25Card(token, res) {
    // 构建卡片html
    var card = config.card
    request.post(timelineurl, {
      headers: header,
      body: JSON.stringify(card)
    }, function (error, response, body) {
      res.send(body)
    })

    // 注册一个subscriptions
    var subscriptionsUrl = "https://www.googleapis.com/mirror/v1/subscriptions"
    var params = {
      callbackUrl: "https://deve.geekku.com/subscriptions/callback",
      collection: "timeline",
      operation: ['UPDATE'],
      userToken: "1",
      verifyToken: "1231423"
    }

    request.post(subscriptionsUrl, {
      headers: header,
      body: JSON.stringify(params)
    }, function (error, response, body) {
      console.log(body);
    })

    // res.send("ok")
    var locationsUrl = "https://www.googleapis.com/mirror/v1/locations/latest"
    request.get(locationsUrl, {headers: header}, function (error, response, body) {
      console.log(body);
    })
  }

  app.post('/subscriptions/callback', function (req, res) {
    res.send("ok")
    var locationsUrl = "https://www.googleapis.com/mirror/v1/locations/latest"
    request.get(locationsUrl, {headers: header}, function (error, response, body) {
      body = JSON.parse(body)
      api.getCity(body.latitude, body.longitude, getPm25)

      var _city = null

      function getPm25(city) {
        _city = city
        city = city.substr(0, (city.length - 1))
        api.getPm25(city, sendNewCard)
      }

      function sendNewCard(aqi) {
        var card = config.card
        card['text'] = _city + aqi 
        console.log(card)
        request.post(timelineurl, {
          headers: header,
          body: JSON.stringify(card)
        }, function (error, response, body) {
          res.send(body)
        })
      }

    })
  })

}