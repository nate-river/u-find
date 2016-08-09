$(function () {


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

  ///////////////////////////
  ///////////////////////


  //浏览器高度
  $(".lxr_refresh").height($(window).height()-180);

  //页面中的通讯录
  var contacts = [];
  u.getAllUser().then(function(data){
    contacts = data;
    render(contacts);
  })
  var sjtop;
  var render = function(contacts){
    var data = {};
    contacts.forEach(function(v){
      var key = v.sindex;
      if( !data[key] ){
        data[key] = [];
      }
      data[key].push(v);
    })
    var indexlists = Object.keys(data).sort();

    var html = '';
    var findlistUlInner = '';
    indexlists.forEach(function(v){
      findlistUlInner += '<li>'+v+'</li>';

      html += '<dl>';
      var arr = data[v].sort(function(a,b){
        return a.uname > b.uname;
      });
      html += '<dt>'+v+'</dt>'
      arr.forEach(function(v){
        html += '<dd>'+v.uname+'</dd>';
      })
      html += '</dl>'
    })
    $('.lxr_slide').html(findlistUlInner);
    $('.lxr_body').html(html);

    sjtop = $('.lxr_body').find('dt').map(function(){
      return {top:$(this).offset().top, el:$(this) } ;
    }).get();
  }

  var off;
  $('.lxr_slide').on('touchstart',function(e){
    var y = e.originalEvent.changedTouches[0].clientY;
    off = $(this).offset().top;
    var x = Math.floor( (y - off )/18 );
    $('.lxr_refresh').scrollTop(sjtop[x].top - 180);
  });
  $('.lxr_slide').on('touchmove',function(e){
    var y = e.originalEvent.changedTouches[0].clientY;
    var x = Math.floor( (y - off )/18 );
    $('.lxr_refresh').scrollTop(sjtop[x].top - 180);
  });

  ////////////////////////////////////////////////////////////////////
  //头部固定字母条
  $(".lxr_refresh").scroll(function() {
    var s = $(this).scrollTop();
    $('.reminder').show();
    sjtop.forEach(function(v){
      if( s > v.top-180 ){
        $('.reminder').text(v.el.text());
        return;
      }
    })
  });

  /////////////////////////////////////////////////////////////////
  //
  $("#search").blur(function(){
    $(this).val('');
    render(contacts);
  })

  var search = function(key){
    var tmp = contacts.filter(function(v){
      if( v.uname.indexOf(key) !== -1 || v.phone.indexOf(key) !== -1 ){
        return true;
      }else{
        return false;
      }
    })
    render(tmp);
  }
  //
  $("#search").keyup(function(e){
    search( $(this).val() )
  })
})
