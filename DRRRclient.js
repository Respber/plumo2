$("body").append("<div id=\"botTab\" style=\"display:none;position:fixed;top:300px;left:0px;height:500px;width:300px;background-color:white;color:black;\"><button onclick=\"changeTalksBgImg('http://localhost/bg3.jpg') \">test</button><br><span id=\"text\"></span></div>");
//$("body").append("<div id=\"botSettingTab\" style=\"position:fixed;top:300px;left:0px;height:500px;width:300px;background-color:white;color:black;\"><button onclick=\"changeTalksBgImg('http://localhost/bg3.jpg') \">test</button><br><span id=\"text\"></span></div>");
$("head").append("<link rel=\"stylesheet\" href=\"https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css \">");
$(".menu:first").append("<li id=\"bot\" style=\"display:list-item;\"><i class=\"fa fa-wrench\"></i></li>");
$(".message_box").css({"opacity":"0.6"});

function post(url,datas){
	$.ajax({
		type:"POST",
		url:url,
		data:datas,
	});
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

var BOT_FLAG=false;
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
	//$(".me").css({"color":"#333"});
	//$(".join").css({"color":"#333"});
	//$(".leave").css({"color":"#333"});
	//$(".name").css({"color":"#333"});
	//background-size:100% 100%;background-attachment:fixed;
}
function changeTalksColor(co){
	$(".me").css({"color":co});
	$(".join").css({"color":co});
	$(".leave").css({"color":co});
	$(".name").css({"color":co});
}
//*****特殊功能*****

var LAST_MSG_TIMESTAMP=1616850236.8232;
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
var COLOR="";
var MDATA=new Object();
var MUSIC_FLAG=false;
function interactMessage(){
	var obj=RECV.talks;
	for(var i=0;i<obj.length;i++){
		if(obj[i].type!="join"&&obj[i].type!="leave"&&obj[i].time>LAST_MSG_TIMESTAMP){
			LAST_MSG_TIMESTAMP=obj[i].time;
			if(obj[i].message.indexOf("style")!=-1){
				if(obj[i].message.indexOf("bgImage=")!=-1){
					var j=obj[i].message.indexOf("bgImage=")+8;
					var t=obj[i].message.slice(j);
					changeTalksBgImg(t);
					//for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					sendPublicMsg("/me "+t);
				}
			}
			if(obj[i].message.indexOf("style")!=-1){
				if(obj[i].message.indexOf("textColor=")!=-1){
					var j=obj[i].message.indexOf("textColor=")+10;
					var t=obj[i].message.slice(j);
					changeTalksColor(t);
					COLOR=t;
					//for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					sendPublicMsg("/me "+t);
				}
			}	
		}
	}
}

function get(url){
	//var recv=new Object();
	$.ajax({
		//async:false,
		url: url,
		success:function(data){
			//console.log(data);
			RECV=data;
			console.log(RECV);
			usersName=[];
			usersId=[];
			//console.log(RECV);
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
			
			interactMessage();
		},
	});
	//return recv;
}

function timerLoop(){
	//getInfo();
	//interactMessage();
	get("https://drrr.com/json.php?fast=1");
}
function styleTimerLoop(){
	changeTalksColor(COLOR);
	//$(".user .dropdown").css({"color":"#fff"});
	$(".tail-mask").remove();
	$(".tail-wrap").remove();
}
setInterval("styleTimerLoop()",50);
setInterval("timerLoop()",1000);
//*****主体循环*****