var express = require('express');
var pinyin = require('pinyin');
var mysql      = require('mysql');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');

var app = express();

app.use( express.static( __dirname + '/static/') );
app.use(cookieParser());

// var check = function (req, res, next) {
//    var url = req.originalUrl;
//     if (url !== "/login" && !req.cookies.uekuname) {
//         return res.redirect("/login");
//     }
//     next();
// };
// app.use(check);

app.get('/app/login', function (req, res) {
  res.sendFile(__dirname+'/phone/m_login.html'  ) ;
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname+'/pc/login.html'  ) ;
});

app.get('/app/', function (req, res) {
  res.sendFile(__dirname+'/phone/m_index.html'  ) ;
});

app.get('/', function (req, res) {
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


///////////////////////////////////////////////////////////////////////////////
app.get('/checkUser', function (req, res) {

  var hash = crypto.createHash("md5");
  hash.update(new Buffer(req.query.password, "binary"));
  var encode = hash.digest('hex');

  connection.query('SELECT ?? FROM user where phone = ?',
  ['password',req.query.account]
  , function(err, result) {
    if( result && (result[0].password === encode) ){
      res.json(true);
    }else{
      res.json(false);
    }
  });
});

app.get('/resetPasswordByAccount',function(req,res){

  var hash = crypto.createHash("md5");
  hash.update(new Buffer("123456", "binary"));
  var password = hash.digest('hex');

  connection.query( 'UPDATE user SET password = ?  WHERE phone = ?',
  [password,req.query.account],function(err,result){
    if (err){
      res.json(false);
    }else{
      res.json(true);
    }
  });
});

app.get('/setPassword',function(req,res){
  var hash = crypto.createHash("md5");
  hash.update(new Buffer(req.query.password, "binary"));
  var password = hash.digest('hex');
  connection.query( 'UPDATE user SET password = ?  WHERE phone = ?',
  [password,req.query.account],function(err,result){
    if (err){
      res.json(false);
    }else{
      res.json(true);
    }
  });
});

////////////////////////////////////////////////////////////////////////////////

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
  var sindex = account[0];

  connection.query( 'UPDATE user SET uname = ?, phone = ?, tel = ?, account = ?, sindex = ?  WHERE uid = ?'
  , [ q.uname.trim(), q.phone.trim(), q.tel.trim(), account, sindex, q.uid] , function(err, results) {
    if (err){
      res.json(false);
    }else{
      res.json(true);
    }
  });
});

app.get('/getAllUser', function (req, res) {
  var columns = ['account','uname', 'phone', 'tel', 'uid','sindex'];
  connection.query('SELECT ?? from user', [columns], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/getUserById', function (req, res) {
  var uid = req.query.uid;
  var columns = ['uname', 'phone', 'tel', 'uid','sindex'];
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
