var userDao = require('../dao/userDao')
var path = require('path')
var fs = require('fs')
var user = {}

user.register = function(req, res) {
  const userName = req.body.userName
  const passWord = req.body.passWord
  userDao.register(userName, passWord, function(err) {
    if (err) {
      console.log(err)
      res.send({ status: '-1' })
    } else {
      console.log('注册成功')
      res.send({ status: '1' })
    }
  })
}
user.login = function(req, res) {
  const userName = req.body.userName
  const passWord = req.body.passWord
  userDao.login(userName, passWord, function(result) {
    if (result) {
      var data = {
        userName: result[0].userName,
        nickName: result[0].nickName,
        portrait: result[0].portrait
      }
      console.log('登录成功')
      res.send({ status: '1', data: data })
    } else {
      res.send({ status: '-1' })
    }
  })
}
user.update = function(req, res) {
  const userName = req.body.userName
  const passWord = req.body.passWord
  userDao.update(userName, passWord, function(err) {
    if (err) {
      res.send({ status: '-1' })
    } else {
      console.log('修改成功')
      res.send({ status: '1' })
    }
  })
}
user.edit = function(req, res) {
  const data = req.body
  userDao.edit(data, function(err) {
    if (err) {
      res.send({ status: '-1' })
    } else {
      console.log('编辑成功')
      res.send({ status: '1' })
    }
  })
}
user.query = function(req, res) {
  const userName = req.body.userName
  userDao.query(userName, function(result) {
    if (result) {
      var data = {
        userName: result[0].userName,
        nickName: result[0].nickName,
        portrait: result[0].portrait
      }
      console.log('查询成功')
      res.send({ status: '1', data: data })
    } else {
      res.send({ status: '-1' })
    }
  })
}
user.upload = function(req, res) {
  const userName = req.body.userName
  console.log(userName)
  console.log(req.body)
  var tmp_path = '/private' + req.files.file.path,
    target_path = path.join(__dirname, '../public/images/' + userName + '.png')
  // 移动文件
  fs.rename(tmp_path, target_path, function(err) {
    if (err) {
      res.send({ status: '-1' })
      throw err
    } else {
      console.log('上传成功')
      res.send({ status: '1' })
    }
  })
}

module.exports = user
