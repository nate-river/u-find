var express = require('express');
var app = express();
app.use( express.static( __dirname + '/static/') );
var pinyin = require("pinyin");
var mysql      = require('mysql');
var crypto = require('crypto');

app.get('/app/login', function (req, res) {
  res.sendFile(__dirname+'/phone/m_login.html'  ) ;
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname+'/pc/login.html'  ) ;
});

app.get('/app/', function (req, res) {
  console.log(req.cookies);
  res.sendFile(__dirname+'/phone/m_index.html'  ) ;
});

app.get('/', function (req, res) {
  console.log(req.cookies);
  res.sendFile(__dirname+'/pc/index.html'  ) ;
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'root',
  database : 'uek',
  // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
});
connection.query('set names utf8');





app.get('/checkUser', function (req, res) {

  var hash = crypto.createHash("md5");
  hash.update(new Buffer(req.query.password, "binary"));
  var encode = hash.digest('hex');

  connection.query('SELECT ?? FROM user where uid = ?',
  ['password',req.query.uid]
  , function(err, result) {
    if( result[0].password === encode){
      res.json(true);
    }else{
      res.json(false);
    }
  });
});

app.get('/addUser', function (req, res) {
  var date = new Date();

  var hash = crypto.createHash("md5");
  hash.update(new Buffer("123456", "binary"));
  var encode = hash.digest('hex');

  connection.query('INSERT INTO user SET ?', {
    ctime: date.getTime(),
    mtime: date.getTime(),
    is_del: 0,
    password:encode,
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

  var r = pinyin(q.uname, {
    style: pinyin.STYLE_NORMAL,
    heteronym: true
  });

  var account = r.map(function(v){
    return v[0];
  }).join('');

  connection.query( 'UPDATE user SET uname = ?, phone = ?, tel = ?, account = ?  WHERE uid = ?'
  , [ q.uname, q.phone, q.tel, account, q.uid] , function(err, results) {
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
