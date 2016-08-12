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
  // u.getAllUser().then(function(data){
  //    for(var i=0;i<data.length;i++){
  //        $(".lx_phoneCon").prepend(createItem(data[i]));
  //    }
  // })
    var contant;
    $.ajax({
        url:"/getAlluser",
        dataType:"jsonp",
        success:function(data){
            contant=data;
            render(contant);
        }
    })
  //更新信息
    var lx_t;
    var lx_tp;
    $(".lx_phoneCon").delegate(".lx_changeN","keyup",function(e){
        var target=$(e.currentTarget);
        var name=target.val();
        var lx_changeP=target.next(".lx_changeP").val();
        var uid=target.closest(".lx_phoneItem").attr("id");

        if(lx_t){
                clearTimeout(lx_t);
        }
       lx_t=setTimeout(function(){
           var phoneR=/\(\s*\d{4}\s*\)/;
           var tel=lx_changeP.match(phoneR);
           if(!tel){
               var shouji=lx_changeP.trim();
               var xiaohao="";
           }else{
               var index=tel["index"];
               var xiaohao=tel[0].slice(1,-1);
               var shouji=lx_changeP.trim().slice(0,11);
           }

            u.updateUserById({
                uid:uid,
                uname:name,
                phone:shouji,
                tel:xiaohao
            })
        },5000)
    })
    $(".lx_phoneCon").delegate(".lx_changeP","keyup",function(e){
        var target=$(e.currentTarget);
        var lx_changeP=target.val();
        var uname=target.prev(".lx_changeN").val();
        var uid=target.closest(".lx_phoneItem").attr("id");

        if(lx_tp){
            clearTimeout(lx_tp);
        }
        lx_tp=setTimeout(function(){
            var phoneR=/\(\s*\d{4}\s*\)/;
            var tel=lx_changeP.match(phoneR);
            if(!tel){
                var shouji=lx_changeP.trim();
                var xiaohao="";
            }else{
                var index=tel["index"];
                var xiaohao=tel[0].slice(1,-1);
                var shouji=lx_changeP.slice(0,index);
            }
            u.updateUserById({
                uid:uid,
                uname:uname,
                phone:shouji,
                tel:xiaohao
            })
        },2000)
    })


//  添加成员
    $(".lx_phoneItemF img").click(function(){
        u.addUser().then(function(data){
            $('.lx_phoneItemF').after(createItem({uname:"张三",phone:"11111111111",tel:"2222",uid:data}));
            // $(".lx_phoneItem:last-of-type").attr("id",data);
        });
    })
//删除
    $(".lx_phone").on("click",".lx_del",function(e){
        var target=$(e.currentTarget);
        target.closest(".lx_phoneItem").css("display","none");
        var uid=target.closest(".lx_phoneItem").attr("id");
        u.deleteUserById(uid);
    })
//  搜索功能

    $('#lx_inputS').on('keyup', function(e) {

        search($(this).val().trim())
        // if ($(this).val().trim() === '') {
        //     $(this).trigger('blur');
        // }
    })

    var search = function(key) {
        var tmp = contant.filter(function(v) {
            if (v.uname.indexOf(key) !== -1 || v.phone.indexOf(key) !== -1 || v.tel.indexOf(key) !== -1 || v.account.indexOf(key) !== -1) {
                return true;
            } else {
                return false;
            }
        })

        render(tmp);
    }



// 插入成员
    function render(contant){

        var data = {};
        contant.forEach(function(v) {
            var key = v.sindex.toUpperCase();
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(v);
        })
        var indexlists = Object.keys(data).sort();
        if($(".lx_phoneItem")){
            $(".lx_phoneItem").remove();
        }

        indexlists.forEach(function(v) {

            var  arr = data[v].sort(function(a, b) {
                return a.uname > b.uname;
            });
             console.log(arr)
            arr.forEach(function(v) {
                $(".lx_phoneCon").append(createItem(v));
            })
        })
        // for(var i=0;i<arr.length;i++){
        //
        //     $(".lx_phoneCon").append(createItem(arr[i]));
        // }
    }





    function createItem(option){
        //lx_phoneItem
        var lx_phoneItem=$("<li>").addClass("lx_phoneItem").attr("id",option.uid);
        // 头像
        var img=$("<img src='pc/imgs/lx_photo.png'>");

        lx_phoneItem.append(img);
        // lx_phoneItem.append(lx_info);
        // 修改信息
        var lx_change=$("<div>").addClass("lx_change lx_hideC");
        var lx_changeN=$("<input>").prop({" type":"text","maxlength":6,"placeholder":"请输入您的姓名","class":"lx_changeN"}).val(option.uname.trim());

        var lx_changeP=$("<input>").prop({" type":"text","maxlength":25,"placeholder":"请输入您的电话及小号","class":"lx_changeP"}).val(option.phone+" ( "+option.tel.trim()+" ) ");
        lx_change.append(lx_changeN);
        lx_change.append(lx_changeP);
        lx_phoneItem.append(lx_change);

        // 修改按钮
        var lx_btn=$("<div>").addClass("lx_btn");
        var lx_del=$("<a>").addClass("lx_del");
        lx_btn.append(lx_del);
        lx_phoneItem.append(lx_btn);

        return  lx_phoneItem;
    }
})




