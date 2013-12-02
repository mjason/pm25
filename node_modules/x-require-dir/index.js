function requireDir(dir, expfilename, callback) {
  require("fs").readdirSync(dir).forEach(function (file) {
    if (file != expfilename) {
      file = file.split('.')[0]
      callback(file)
    }
  })
}

module.exports = requireDir