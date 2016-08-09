
$(function(){

	//下拉刷新
	var lxr_xiala = 0;

	$(".lxr_refresh").scroll(function(){
		lxr_xiala = $(".lxr_refresh").scrollTop()
	})


	touch.on(".lxr_refresh",'touchstart',function(ev){
	})

	var dx,dy;

	touch.on(".lxr_refresh","drag",function(ev){
		dy = dy || 0;
		var offy = dy + ev.y;
		if(lxr_xiala<3){
			ev.preventDefault();
			if (offy<300) {
				$(".lxr_refresh").css({top:offy+"px"})
			}else{
				$(".lxr_refresh").css({top:"300px"})
			}
		}
	})

	touch.on('.lxr_refresh', 'dragend', function(ev){
		$(".lxr_refresh").css({top:0})
	});
	




})

