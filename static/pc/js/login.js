$(function(){
  var cw=$(window).width();
  var ch=$(window).height();
  $(".wlh-loginbox").css({width:cw,height:ch});

  $(".wlh-login").css({left:(cw-$(".wlh-login").innerWidth())/2,top:(ch-$(".wlh-login").innerHeight())/2});

  $(".wlh-resetbox").css({left:(cw-$(".wlh-resetbox").innerWidth())/2,top:-295});
  $(".wlh-resetbox2").css({left:(cw-$(".wlh-resetbox").innerWidth())/2,top:(ch-$(".wlh-resetbox").innerHeight())/2});

  $(".wlh-reset").css({left:(cw-$(".wlh-reset").innerWidth())/2,bottom:-560});


  $(function(){
    $(".mylogin").validate({
      rules:{
        username:{
          required:true,
          maxlength:15,
          minlength:5
        },
        userps:{
          required:true,
          maxlength:15,
          minlength:6
        }
      },
      messages:{
        username:{
          required:"请输入账号！"
        },
        userps:{
          required:"请输入密码！"
        }
      }
    })

    $(".myreset").validate({
      rules:{
        username:{
          required:true,
          maxlength:15,
          minlength:5
        },
        userps:{
          required:true,
          maxlength:15,
          minlength:6
        },
        userps2:{
          required:true,
          equalTo:"#mima"
        }
      },
      messages:{
        username:{
          required:"请输入账号！"
        },
        userps:{
          required:"请输入密码！"
        },
        userps2:{
          required:"请重新输入密码！"
        }
      }
    })
  })


  var wlh_num=0;
  $(".wlh-sub").click(function(){
    //var username=$("#username");
    //var flag=app.get(username);
    if(false){
      document.mylogin[0].submit();
    }else{
      wlh_num++;
      if(wlh_num<=3){
        var lefts=(cw-$(".wlh-login").innerWidth())/2;
        $(".wlh-login")
        .animate({left:lefts-40},60)
        .animate({left:lefts+80},60)
        .animate({left:lefts-80},60)
        .animate({left:lefts+80},60)
        .animate({left:lefts-80},60)
        .animate({left:lefts+40},60)
        $(".wlh-text>label.error").css("display","block").text("您输入的账号有误！");
        $(".wlh-ps>label.error").css("display","block").text("您输入的密码有误！");

      }else{
        $(".wlh-zhezhao").fadeIn(200);
        $(".wlh-resetbox2").fadeOut(200);
        $(".wlh-resetbox").animate({top:(ch-$(".wlh-resetbox").innerHeight())/2},300);
      }
      return false;
    }
  })

  $(".wlh-zhezhao").click(function(){
    $(this).fadeOut(200);
  })
  $(".wlh-xiugai").click(function(){
    $(".wlh-resetbox").animate({top:-295},300);
    $(".wlh-login").fadeOut(200);
    $(".wlh-reset").animate({bottom:(ch-$(".wlh-reset").innerHeight())/2},300);
    $("#username2").val($("#username").val());
    $(".myreset").submit(function(){
      $(".wlh-reset").animate({bottom:-560},200);
      $(".wlh-zhezhao").fadeIn(200);
      $(".wlh-resetbox2").fadeIn(200);
      $(".wlh-zhezhao").delay(800).fadeOut(200);
      $(".wlh-login").delay(1000).fadeIn(200);
      wlh_num=0;
      $(".mylogin>input").val("");
      return false;
    })
  })


})
