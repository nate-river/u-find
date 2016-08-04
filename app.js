var express = require('express');
var app = express();
app.use( express.static( __dirname + '/static/') );


app.get('/app/login', function (req, res) {
  res.sendFile(__dirname+'/phone/m_login.html'  ) ;
});
app.get('/app/', function (req, res) {
  res.sendFile(__dirname+'/phone/m_index.html'  ) ;
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname+'/pc/login.html'  ) ;
});
app.get('/', function (req, res) {
  res.sendFile(__dirname+'/pc/index.html'  ) ;
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'root',
  database : 'uek',
  // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
});

app.get('/checkUser', function (req, res) {
  res.json(true);
});

app.get('/addUser', function (req, res) {
  var date = new Date();
  connection.query('INSERT INTO user SET ?', {
    ctime: date.getTime(),
    mtime: date.getTime(),
    is_del: 0,
  }, function(err, result) {
    if (err) throw err;
    res.json(result.insertId);
  });
});

app.get('/deleteUserById', function (req, res) {
  connection.query('DELETE FROM user WHERE uid = ?', [req.query.uid], function(err, result) {
    if (err){
      res.json(false);
    }else{
      res.json(true);
    }
  });
});

app.get('/updateUserById', function (req, res) {
  var q = req.query;
  connection.query( 'UPDATE user SET uname = ?, phone = ?, tel = ?  WHERE uid = ?'
  , [ q.uname, q.phone, q.tel,  q.uid] , function(err, results) {
    if (err){
      res.json(false);
    }else{
      res.json(true);
    }
  });
});

app.get('/getAllUser', function (req, res) {
  var columns = ['uname', 'phone', 'tel', 'uid'];
  connection.query('SELECT ?? from user', [columns], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/getUserById', function (req, res) {
  var uid = req.query.uid;
  var columns = ['uname', 'phone', 'tel', 'uid'];
  connection.query('SELECT ?? from user where uid = ?',[columns,uid], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows[0]);
  });
});

app.get('/getAuthById', function (req, res) {
  var uid = req.query.uid;
  var columns = ['authority'];
  connection.query('SELECT ?? from user where uid = ?', [columns,uid], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows[0].authority);
  });
});
