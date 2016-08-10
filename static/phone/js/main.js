$(function(){
  function User () {};
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
  var contacts = [];
  u.getAllUser().then(function(data){
    contacts = data;
    render(contacts);
  })

  var toplist;

  var render = function(contacts){
    var data = {};
    contacts.forEach(function(v){
      var key = v.sindex.toUpperCase();
      if( !data[key] ){
        data[key] = [];
      }
      data[key].push(v);
    })
    var indexlists = Object.keys(data).sort();

    var html = '';
    var findlistUlInner = '';
    indexlists.forEach(function(v){
      findlistUlInner += '<li>'+v.toUpperCase()+'</li>';

      var arr = data[v].sort(function(a,b){
        return a.uname > b.uname;
      });
      html += '<dt>'+v.toUpperCase()+'</dt>'
      arr.forEach(function(v){
        html += '<dd>'+v.uname+'<a href="tel:'+v.phone+'"></a></dd>';
      })
    })
    var iList = $('.indexlist').html(findlistUlInner)
    iList.height(iList.children().eq(0).outerHeight(true) * indexlists.length);
    $('.content .userlist').html(html);
    toplist = $('.content dt').map(function(i,v){
      return {top:$(this).offset().top,index:indexlists[i]} ;
    }).get();
    $('.content dt').prev().css('border','none');
    fixedel.text(toplist[0].index);
    fixedindexh = fixedel.outerHeight(true);
    off =  header + subheader + fixedindexh;
  }

  ////////////////////////////////////////////////////////////////////
  //头部固定字母条
  var fixedel = $('.fixedindex');
  var header = $('.header').outerHeight(true);
  var subheader = $('.sub-header').outerHeight(true);
  var fixedindexh;
  var off;

  $(window).scroll(function() {
    var s = $(this).scrollTop() + off;
    if(toplist){
      toplist.forEach(function(v){
        if( s >= v.top ){
          fixedel.text(v.index);
          return;
        }
      })
    }
  });



  /////////////////////////////////////////////////////////////////
  //

  var search = function(key){
    var tmp = contacts.filter(function(v){
      if( v.uname.indexOf(key) !== -1
      || v.phone.indexOf(key) !== -1
      || v.tel.indexOf(key) !== -1
      || v.account.indexOf(key)!== -1){
        return true;
      }else{
        return false;
      }
    })
    render(tmp);
  }
  //
  $("#search").on('keyup',function(e){
    $('.fixedindex').hide();
    search( $(this).val().trim() )
  })


  // return;
  var sep;
  var itop;
  $('.indexlist').on('touchstart',function(e){
    sep = $('.indexlist li').outerHeight(true);
    itop = $('.indexlist').get(0).getBoundingClientRect().top;
    var y = e.originalEvent.changedTouches[0].clientY;
    var x = Math.floor( (y - itop )/sep);
    $(window).scrollTop(toplist[x].top - off + fixedindexh);
    return false;
  });
  $('.indexlist').on('touchmove',function(e){
    var y = e.originalEvent.changedTouches[0].clientY;
    var x = Math.floor( (y - itop )/sep );
    $(window).scrollTop(toplist[x].top - off + fixedindexh);
    return false;
  });

})
