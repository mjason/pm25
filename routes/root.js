var config = require('../config.json')
var request = require('request')
var api = require('../api')

var timelineurl = "https://www.googleapis.com/mirror/v1/timeline"

module.exports = function (app) {
  
  // 构建主页
  app.get('/', function (req, res) {
    res.render('index')  
  })

  // callback 完成认证
  app.get('/callback', function (req, res) {
    
    api.authCallback(req.param('code'), pushPm25Card)

    function pushPm25Card() {
      res.send("请等待推送卡片")
      // 推送卡片
      api.sendCard(config.card)

      // 注册一个subscriptions
      api.regSubscriptions("https://deve.geekku.com/subscriptions/callback")
    }

  })

  app.post('/subscriptions/callback', function (req, res) {
    
    res.send("ok")

    api.locations(function (latitude, longitude) {
      api.getCity(latitude, longitude, getPm25)
      var _city = null
    })

    function getPm25(city) {
      _city = city
      city = city.substr(0, (city.length - 1))
      api.getPm25(city, sendNewCard)
    }

    function sendNewCard(aqi) {
      var card = config.card
      card['text'] = _city + aqi
      api.sendCard(card)
    }
  })

}