module.exports = function (app) {
  var requireDir = require('x-require-dir')
  requireDir('./helper', 'index.js', function (file) {
    require('./' + file)(app.locals)
  })
}