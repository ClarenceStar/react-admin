var mysql = require('mysql2')
var fs = require('fs')

var DB = {}
var data = fs.readFileSync(__dirname + '/db.json', function(err) {
  if (err) {
    console.log(err.message)
    return
  } else {
    console.log(data.toString())
  }
})
var config = JSON.parse(data)
// create the connection to database
// const connection = mysql.createConnection(config)
const mysql_pool = mysql.createPool(config)
DB.register = function(name, pwd, func) {
  const portrait = 'http://localhost:3004/images/test.png',
        nickName = '未命名'
  const sql = `INSERT INTO user (userName,passWord,portrait,nickName) VALUES (?,?,?,?)`
  mysql_pool.execute(sql, [name, pwd, portrait, nickName], function(err) {
    if (err) {
      func(err)
    } else {
      func(null)
    }
  })
}
DB.login = function(name, pwd, func) {
  const sql = 'SELECT * FROM `user` WHERE `userName` = ? AND `passWord` = ?'
  mysql_pool.execute(sql, [name, pwd], function(err, rows) {
    if (rows.length > 0) {
      func(rows)
    } else {
      func(null)
    }
  })
}
DB.update = function(name, pwd, func) {
  const sql = 'UPDATE `user` SET `passWord` = ? WHERE `userName` = ? '
  mysql_pool.execute(sql, [pwd, name], function(err, rows) {
    if (rows.affectedRows > 0) {
      func(null)
    } else {
      func('用户名不存在')
    }
  })
}

DB.edit = function(data, func) {
  const nickName = data.nickName,
    gender = data.gender,
    email = data.email,
    residence = data.residence,
    userName = data.userName
  const portrait = 'http://localhost:3004/images/' + userName + '.png'
  const sql =
    'UPDATE `user` SET `nickName` = ?,`gender` = ?,`email` = ?,`residence` = ?,`portrait` = ? WHERE `userName` = ? '
  mysql_pool.execute(
    sql,
    [nickName, gender, email, residence, portrait, userName],
    function(err, rows) {
      if (rows.affectedRows > 0) {
        func(null)
      } else {
        func('用户名不存在')
      }
    }
  )
}

DB.query = function(name, func) {
  const sql = 'SELECT * FROM `user` WHERE `userName` = ?'
  mysql_pool.execute(sql, [name], function(err, results) {
    if (results) {
      func(results)
    } else {
      func(null)
    }
  })
}

module.exports = DB
