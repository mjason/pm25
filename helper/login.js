var config = require('../config.json').client
var querystring = require('querystring')

// 登录的url
module.exports = function (locals) {
  locals.loginUrl = function () {
    config['scope'] = config['scope'].join(' ')
    var query = "https://accounts.google.com/o/oauth2/auth?" + querystring.stringify(config)
    return query
  }
}