$(function(){

  function User () {
    
  };

  User.prototype = {
    checkUser: function(){
      return $.get('/checkUser').then(function(data){
        return data;
      });
    },
    addUser: function(){
      return $.get('/addUser').then(function(data){
        return data;
      })
    },
    deleteUserById: function(id){
      return $.get('/deleteUserById',{uid:id}).then(function(data){
        return data;
      })
    },
    updateUserById: function(data){
      return $.get('/updateUserById',{
        uid:data.uid,
        uname:data.uname,
        phone:data.phone,
        tel:data.tel,
      }).then(function(data){
        return data;
      })
    },
    getAllUser:function(){
      return $.get('/getAllUser').then(function(data){
        return data;
      },'json');
    },
    getUserById:function(id){
      return $.get('/getUserById',{uid:id}).then(function(data){
        return data;
      },'json');
    },
    getAuthById:function(id){
      return $.get('/getAuthById',{uid:id}).done(function(data){
        return data;
      },'json')
    }
  }

  var u = new User();

  

  // u.addUser().then(function(data){
  //   console.log(data);
  // })
  // u.deleteUserById(41).then(function(data){
  //   console.log(data);
  // });
  // u.getUserById(33).then(function(data){
  //   console.log(data);
  // });
  // u.getAuthById(33).then(function(data){
  //   console.log(data);
  // })
  // u.getAllUser().then(function(data){
  //   console.log(data);
  // })
  // u.updateUserById({
  //   uid:33,
  //   uname:'abcd',
  //   phone:'134567890',
  //   tel:'6710',
  // });


  // /////////////////// 纯Ajax请求示例代码 //////////////

  // //获取用户是否能登录
  // var  checkUser = function(){
  //   return $.get('/getUserById',{uid:31}).then(function(data){
  //     return data;
  //   });
  // }
  //
  // // 添加一个空用户 返回 uid
  // $.get('/addUser').done(function(data){
  //   console.log(data);
  // })
  //
  // //删除用户
  // $.get('/deleteUserById',{uid:9}).done(function(data){
  //   console.log(data);
  // })
  //
  // //更新用户
  // $.get('/updateUserById',{
  //   uid:31,
  //   uname:'张三',
  //   phone:'13934714152',
  //   tel:'6710'
  // }).done(function(data){
  //   console.log(data);
  // })
  //
  // //获取所有用户
  // $.get('/getAllUser').done(function(data){
  //   console.log(data);
  // },'json');
  //
  //
  // //
  // //获取单个用户信息
  // $.get('/getUserById',{uid:3}).done(function(data){
  //   console.log(data);
  // },'json');
  //
  // //
  // //获取用户权限信息
  // // $.get('/getAuthById',{uid:3}).done(function(data){
  // //   console.log(data);
  // // },'json')
  //




})
