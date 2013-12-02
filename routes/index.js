module.exports = function (app) {
  var requireDir = require('x-require-dir')
  requireDir('./routes', 'index.js', function (file) {
    require('./' + file)(app)
  })
}