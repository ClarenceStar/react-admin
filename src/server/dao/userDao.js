var Db = require('../database/DB')

var userDao = {}

userDao.register = function(userName, passWord, callback) {
  Db.register(userName, passWord, function(err) {
    callback(err)
  })
}
userDao.login = function(userName, passWord, callback) {
  Db.login(userName, passWord, function(rows) {
    callback(rows)
  })
}
userDao.update = function(userName, passWord, callback) {
  Db.update(userName, passWord, function(err) {
    callback(err)
  })
}
userDao.edit = function(data, callback) {
  Db.edit(data, function(err) {
    callback(err)
  })
}
userDao.query = function(userName, callback) {
  Db.query(userName, function(res) {
    callback(res)
  })
}
module.exports = userDao
