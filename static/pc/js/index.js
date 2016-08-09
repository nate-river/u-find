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
  u.getAllUser().then(function(data){
     for(var i=0;i<data.length;i++){
         $(".lx_phoneCon").prepend(createItem(data[i]));
     }
  })

//  修改信息
  $(".lx_phone").on("click",".lx_xiugai",function(e){
      var target=$(e.currentTarget);
      var parents=target.closest(".lx_phoneItem")
          parents.toggleClass("lx_hideC");
      var lx_name=parents.find(".lx_name");
      var spans=parents.find("span");
      if(!parents.is(".lx_hideC")){
          var uid=target.closest(".lx_phoneItem").attr("id");
          var name=target.parents(".lx_btn").prev(".lx_change").find(".lx_changeN").val();
          var phone=target.parents(".lx_btn").prev(".lx_change").find(".lx_changeP").val();
          var phoneR=/\(\s*\d{4}\s*\)/;
          var tel=phone.match(phoneR);
          console.log(tel["index"])
          var index=tel["index"];
          var xiaohao=tel[0].slice(1,-1);
          var shouji=phone.slice(0,index);
          $(lx_name).text(name);
          $(spans).text(shouji+"("+xiaohao+")");
          u.updateUserById({
              uid:uid,
              uname:name,
              phone:shouji,
              tel:xiaohao
          })
      }

  })
  $(".lx_phone").on("click",".lx_del",function(e){
      var target=$(e.currentTarget);
      target.closest(".lx_phoneItem").css("display","none");
      var uid=target.closest(".lx_phoneItem").attr("id");
      u.deleteUserById(uid);
  })
//  添加成员
    $(".lx_phoneItemF img").click(function(){

        u.addUser().then(function(data){
            $('.lx_phoneItemF').before(createItem({uname:"张三",phone:"11111111111",tel:"2222",uid:data}));
            // $(".lx_phoneItem:last-of-type").attr("id",data);
        });

    })

    function createItem(option){
        //lx_phoneItem
        var lx_phoneItem=$("<li>").addClass("lx_phoneItem").attr("id",option.uid);
        // 头像
        var img=$("<img src='pc/imgs/lx_photo.png'>");
        // lx_info 显示信息
        var lx_info=$("<div>").addClass("lx_info");
        var lx_name=$("<div>").addClass("lx_name").text(option.uname);
        var span=$("<span>").text(option.phone+" ( "+option.tel+" ) ");
        var lx_tel=$("<div>TEL / </div>").addClass("lx_tel").append(span);
        lx_info.append(lx_name);
        lx_info.append(lx_tel);
        lx_phoneItem.append(img);
        lx_phoneItem.append(lx_info);
        // 修改信息
        var lx_change=$("<div>").addClass("lx_change");
        var lx_changeN=$("<input>").prop({" type":"text","maxlength":6,"placeholder":"请输入您的姓名","class":"lx_changeN"}).val(option.uname);

        var lx_changeP=$("<input>").prop({" type":"text","maxlength":25,"placeholder":"请输入您的电话及小号","class":"lx_changeP"}).val(option.phone+" ( "+option.tel+" ) ");
        lx_change.append(lx_changeN);
        lx_change.append(lx_changeP);
        lx_phoneItem.append(lx_change);

        // 修改按钮
        var lx_btn=$("<div>").addClass("lx_btn");
        var lx_del=$("<a>").addClass("lx_del");
        var lx_xiugai=$("<a>").addClass("lx_xiugai");
        lx_btn.append(lx_del);
        lx_btn.append(lx_xiugai);
        lx_phoneItem.append(lx_btn);
        return  lx_phoneItem;
    }
})




