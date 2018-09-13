var express = require('express')
var router = express.Router()
var user = require('../controller/userController')
// post user operation.
router.post('/', function(req, res) {
  const method = req.body.method
  console.log(req.body)
  res.setHeader('Access-Control-Allow-Origin', '*') //CORS实现跨域
  if (method == 'login') {
    user.login(req, res)
  } else if (method == 'register') {
    user.register(req, res)
  } else if (method == 'update') {
    user.update(req, res)
  } else if (method == 'edit') {
    user.edit(req, res)
  } else if (method == 'query') {
    user.query(req, res)
  } else if (method == 'upload') {
    user.upload(req, res)
  }
})

module.exports = router
