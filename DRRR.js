$("body").append("<div id=\"botTab\" style=\"position:fixed;top:300px;left:0px;height:500px;width:300px;background-color:white;color:black;\"><button onclick=\"changeTalksBgImg('http://localhost/bg3.jpg') \">test</button><br><span id=\"text\"></span></div>");
//$("body").append("<div id=\"botSettingTab\" style=\"position:fixed;top:300px;left:0px;height:500px;width:300px;background-color:white;color:black;\"><button onclick=\"changeTalksBgImg('http://localhost/bg3.jpg') \">test</button><br><span id=\"text\"></span></div>");
$(".menu:first").append("<li id=\"bot\" style=\"display:list-item;\"><i class=\"icon icon-list\"></i></li>");

function post(url,datas){
	$.ajax({
		type:"POST",
		url:url,
		data:datas,
	});
}
function get(url){
	var recv=new Object();
	$.ajax({
		async:false,
		url: url,
		success:function(data){
			//console.log(data);
			recv=data;
		},
	});
	return recv;
}
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
      //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
      break;
    default:
      return 0;
      break;
  }
} 
//*****核心功能*****

var BOT_FLAG=true;
document.getElementById("bot").onclick=function(){
	if(BOT_FLAG){
		BOT_FLAG=false;
		$("#botTab").fadeOut(100);
		$("#setting_pannel").fadeOut(100);
	}else{
		BOT_FLAG=true;
		$("#botTab").fadeIn(100);
		$("#setting_pannel").fadeIn(100);
	}
}
function changeTalksBgImg(url){
	$("body").css({"background":"url("+url+") no-repeat"});
	$("body").css({"background-size":"cover"});
	$("body").css({"background-attachment":"fixed"});
	$(".me").css({"color":"#888"});
	$(".join").css({"color":"#888"});
	$(".leave").css({"color":"#888"});
	$(".name").css({"color":"#888"});
	$(".tail-mask").remove();
	$(".tail-wrap").remove();
	//background-size:100% 100%;background-attachment:fixed;
}
//*****特殊功能*****

var LAST_MSG_TIMESTAMP=1616816985.0267;
var usersName=new Array();
var usersId=new Array();
var RECV=new Object();
function sendPublicMsg(msg){
	post("https://drrr.com/room",{"message":msg});
	return;
}
function sendPrivateMsg(target,msg){
    post("https://drrr.com/room/",{"message":msg,"to":target});
    return;
}
function getName(id){
	for(var i=0;i<usersId.length;i++)
		if(usersId[i]==id)
			return usersName[i];
}
function getId(name){
	for(var i=0;i<usersName.length;i++)
		if(usersName==name)
			return usersId[i];
}
function getInfo(){
	RECV=get("https://drrr.com/json.php?fast=1");
	console.log(RECV);
	usersName=[];
	usersId=[];
	console.log(RECV);
    var obj=RECV;
	var cnt=RECV.users.length;
	for(var i=0;i<cnt;i++){
		usersName.push(obj.users[i].name);
		usersId.push(obj.users[i].id);
	}
	document.getElementById("text").innerHTML=null;
	document.getElementById("text").innerHTML+=("<span>用户列表("+obj.update+")</span><br><hr>");
	for(var i=0;i<usersName.length;i++){
		document.getElementById("text").innerHTML+=(usersName[i]+"<br>"+usersId[i]+"<br><br>");
	}
	return;
}
function playImage(say,url){
	post("https://drrr.com/room/",{"message":say,"url":url});
}
function playMusic(url){
	post("https://drrr.com/room/",{"music":"music","url":url});
}
function kickUser(id){
	post("https://drrr.com/room/",{"kick":id});
}
function changeHost(id){
	post("https://drrr.com/room/",{"new_host":id});
}
//*****基础功能*****

var MDATA=new Object();
var MUSIC_FLAG=false;
function interactMessage(){
	var obj=RECV.talks;
	for(var i=0;i<obj.length;i++){
		if(obj[i].type!="join"&&obj[i].type!="leave"&&obj[i].time>LAST_MSG_TIMESTAMP){
			LAST_MSG_TIMESTAMP=obj[i].time;
			if(obj[i].message.indexOf("plumo")!=-1&&obj[i].message.indexOf("调戏")!=-1){
				if(randomNum(0,100)>50)sendPublicMsg("/me 请"+obj[i].from.name+"大人不要这样对待plumo哦！",100);
				else sendPublicMsg("/me "+obj[i].from.name+"大人，您真的那么想体验一下遍体鳞伤的感觉么？[此处会有图片]",100);
			}
			
			if(obj[i].message.indexOf("给我来一杯")!=-1){
				var j=0;
				for(;j<obj[i].message.length;j++)if(obj[i].message[j]=='杯')break;
				var t=obj[i].message.slice(j+1);
				sendPublicMsg("/me @"+obj[i].from.name+" "+obj[i].from.name+"大人,您的"+t);
			}
			
			if(obj[i].message.indexOf("播放")!=-1){
				if(obj[i].message.indexOf("页码")!=-1){
					var j=0;
					for(;j<obj[i].message.length;j++)if(obj[i].message[j]=='码')break;
					var t=parseInt(obj[i].message.slice(j+1));
					var str="";
					for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					sendPublicMsg("/me "+MUSIC_FLAG+" "+str);
				}
				if(MUSIC_FLAG==false){
					MUSIC_FLAG=true;
					var j=0;
					for(;j<obj[i].message.length;j++)if(obj[i].message[j]=='放')break;
					var t=obj[i].message.slice(j+1);
					$.ajax({
						url:("http://127.0.0.1:3000/search?keywords="+t),
						async:false,
						success:function(data){
							var str="";
							for(var i=0;i<2;i++)str+=(i+":"+data.result.songs[i].name+"-"+data.result.songs[i].artists[0].name+"|");
							sendPublicMsg("/me "+MUSIC_FLAG+" "+str);
							console.log(data);
							MDATA=data;
							//alert("get");
						}
					});
				}else{
					MUSIC_FLAG=false;
					var j=0;
					for(;j<obj[i].message.length;j++)if(obj[i].message[j]=='放')break;
					var t=obj[i].message.slice(j+1);
					//sendMessage("/me 已点播"+MDATA.result.songs[parseInt(t)].id,50);
					playMusic("https://music.163.com/song?id="+MDATA.result.songs[parseInt(t)].id);
					//sendMessage("/me 已点播",50);
				}
			}
			if(obj[i].message.indexOf("style")!=-1){
				if(obj[i].message.indexOf("bgImage=")!=-1){
					var j=obj[i].message.indexOf("bgImage=")+8;
					var t=obj[i].message.slice(j);
					changeTalksBgImg(t);
					//for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					sendPublicMsg("/me "+t);
				}
			}
			
			/*if(obj[i].to==undefined&&obj[i].message.indexOf("plumo")>=0){
				sendPublicMsg("123");
			}else if(obj[i].to!=undefined&&obj[i].message.indexOf("plumo")>=0){
				sendPrivateMsg(obj[i].from.id,"123");
			}*/
			
		}else if(obj[i].type=="join"&&obj[i].time>LAST_MSG_TIMESTAMP){
			LAST_MSG_TIMESTAMP=obj[i].time;
			var user=obj[i].user.name;
			//alert("JOIN");
			sendPublicMsg("贵安，"+user+"大人");
			//setTimeout(function(){sendPrivateMessage(obj[i].user.id,"由于网络原因，所有有关plumo的操作可能会有5s的延迟，请主人多多谅解~");},300);
			//break;
		}
	}
}
function timerLoop(){
	getInfo();
	interactMessage();
}
function styleTimerLoop(){
	$(".me").css({"color":"#888"});
	$(".join").css({"color":"#888"});
	$(".leave").css({"color":"#888"});
	$(".name").css({"color":"#888"});
	$(".tail-mask").remove();
	$(".tail-wrap").remove();
}
setInterval("styleTimerLoop()",50);
setInterval("timerLoop()",1000);
//*****主体循环*****