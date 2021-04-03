var server="http://plumo.free.idcfengye.com/";
var server2="http://plumo2api.free.idcfengye.com/";

//initModel(\"assets/\")
//var server="http://localhost/";
//var server2="http://localhost:3000/";
$("body").append("<div id=\"botTab\" style=\"display:none;position:fixed;top:300px;left:0px;height:500px;width:300px;background-color:white;color:black;\"><button onclick=\"init()\">test</button><button onclick=\"test()\">test2</button><br><span id=\"text\"></span></div>");
//$("body").append("<div id=\"botSettingTab\" style=\"position:fixed;top:300px;left:0px;height:500px;width:300px;background-color:white;color:black;\"><button onclick=\"changeTalksBgImg('http://localhost/bg3.jpg') \">test</button><br><span id=\"text\"></span></div>");
$("head").append("<link rel=\"stylesheet\" href=\"https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css \">");
$("head").append("<link rel=\"stylesheet\" href=\""+server+"APlayer.min.css \">");
$("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\""+server+"assets/waifu.css\"/>");
$("head").append("<style>.aplayer-title{color:black}</style>");
$("body").append("<div id=\"aplayer\" style=\"position:fixed;left:0px;bottom:0px;min-width:400px;\"></div>");
$("body").append("<script src=\""+server+"APlayer.min.js \"></script>");
//<div class=\"waifu-tool\"><span class=\"fui-home\"></span><span class=\"fui-chat\"></span><span class=\"fui-eye\"></span><span class=\"fui-user\"></span><span class=\"fui-photo\"></span><span class=\"fui-info-circle\"></span><span class=\"fui-cross\"></span>
$("body").append("<div class=\"waifu\"><div class=\"waifu-tips\"></div><canvas id=\"live2d\" width=\"280\" height=\"250\" class=\"live2d\"></canvas></div></div><script src=\""+server+"assets/waifu-tips.js\"></script><script src=\""+server+"assets/live2d.js\"></script>");
$(".menu:first").append("<li id=\"bot\" style=\"display:list-item;\"><i class=\"fa fa-wrench\"></i></li>");
$(".message_box").css({"opacity":"0.6"});
document.getElementsByClassName("message_box")[0].onmouseover=function(){
	$(".message_box").css({"opacity":"1"});
}
document.getElementsByClassName("message_box")[0].onmouseout=function(){
	$(".message_box").css({"opacity":"0.6"});
}

function init(){
	initModel("http://localhost/assets/");
}
function test(){
	showMessage("fuck",3000);
}


//http://music.163.com/song/media/outer/url?id=ID数字.mp3
//http://music.163.com/api/song/media?id=863046037
//*****Aplayer*****

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
		$("#musicBox").fadeOut(100);
	}else{
		BOT_FLAG=true;
		$("#botTab").fadeIn(100);
		$("#setting_pannel").fadeIn(100);
		$("#musicBox").fadeIn(100);
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

var LAST_MSG_TIMESTAMP=1617413143.0478;
var usersName=new Array();
var usersId=new Array();
var RECV=new Object();
function sendPublicMsg(msg){
	post("https://drrr.com/room",{"message":msg});
	//showMessage(msg,3000);
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
function playMusic2(id){
	sendPublicMsg("/me /play musicId="+id);
}
//*****基础功能*****
var COLOR="";
var MUSIC_CHOSEN=0;
var MDATA=new Object();
var MUSIC_FLAG=false;
function interactMessage(){
	var obj=RECV.talks;
	for(var i=0;i<obj.length;i++){
		if(obj[i].type!="join"&&obj[i].type!="leave"&&obj[i].time>LAST_MSG_TIMESTAMP){
			//alert(i);
			LAST_MSG_TIMESTAMP=obj[i].time;
			var MSG=obj[i].message;
			if(obj[i].type=="me")MSG=obj[i].content;
			if(obj[i].from.name=="plumo"&&obj[i].type!="me")showMessage(MSG,5000);
			if(MSG.indexOf("plumo")!=-1&&MSG.indexOf("调戏")!=-1){
				if(randomNum(0,100)>50)sendPublicMsg("/me 请"+obj[i].from.name+"大人不要这样对待plumo哦！",100);
				else sendPublicMsg("/me "+obj[i].from.name+"大人，您真的那么想体验一下遍体鳞伤的感觉么？[此处会有图片]",100);
				showMessage("禁止调戏plumo",5000);
			}
			
			if(MSG.indexOf("/给我来一杯")!=-1){
				var j=0;
				for(;j<MSG.length;j++)if(MSG[j]=='杯')break;
				var t=MSG.slice(j+1);
				sendPublicMsg("/me @"+obj[i].from.name+" "+obj[i].from.name+"大人,您的"+t);
				showMessage(obj[i].from.name+"大人,您的"+t,5000);
			}
			
			if(MSG.indexOf("/播放")!=-1){
				if(MSG.indexOf("页码")!=-1){
					var j=0;
					for(;j<MSG.length;j++)if(MSG[j]=='码')break;
					var t=parseInt(MSG.slice(j+1));
					var str="";
					for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					sendPublicMsg("/me "+MUSIC_FLAG+" "+str);
				}else if(MUSIC_FLAG==false){
					MUSIC_FLAG=true;
					var j=0;
					for(;j<MSG.length;j++)if(MSG[j]=='放')break;
					var t=MSG.slice(j+1);
					$.ajax({
						url:(server2+"search?keywords="+t),
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
					for(;j<MSG.length;j++)if(MSG[j]=='放')break;
					var t=MSG.slice(j+1);
					//sendMessage("/me 已点播"+MDATA.result.songs[parseInt(t)].id,50);
					//MUSIC_CHOSEN=parseInt(t);
					//playMusic("https://music.163.com/song?id="+MDATA.result.songs[parseInt(t)].id);
					playMusic2(MDATA.result.songs[parseInt(t)].id);
					//sendMessage("/me 已点播",50);
				}
			}
			if(MSG.indexOf("/style")!=-1){
				if(MSG.indexOf("bgImage=")!=-1){
					var j=MSG.indexOf("bgImage=")+8;
					var t=MSG.slice(j);
					changeTalksBgImg(t);
					//for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					//sendPublicMsg("/me "+t);
				}
			}
			if(MSG.indexOf("/style")!=-1){
				if(MSG.indexOf("textColor=")!=-1){
					var j=MSG.indexOf("textColor=")+10;
					var t=MSG.slice(j);
					changeTalksColor(t);
					COLOR=t;
					//for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					//sendPublicMsg("/me "+t);
				}
			}
			if(MSG.indexOf("/live2d")!=-1){
				var j=MSG.indexOf("live2d")+7;
				var t=MSG.slice(j);
				if(t=="on"){
					initModel("http://localhost/assets/");
				}else if(t=="off"){
					sessionStorage.setItem('waifu-dsiplay', 'none');
					showMessage('愿你有一天能与重要的人重逢', 1300, true);
					window.setTimeout(function() {$('.waifu').hide();}, 1300);
				}else if(t=="switch"){
					loadRandModel();
				}
			}
			if(MSG.indexOf("/play")!=-1){
				if(MSG.indexOf("musicId=")!=-1){
					var j=MSG.indexOf("musicId=")+8;
					var t=MSG.slice(j);
					
					//ap.list.clear();
					var LRC="";
					$.ajax({
						type: "get",
						url:server2+'lyric/?id='+t,
						async:false,
						success:function(data){
							if(!("nolyric" in data))LRC=data.lrc.lyric;
							else LRC="[00:00.00]暂无歌词\n";
						}
					});

					console.log(LRC);
					var details=new Object();
					$.ajax({
						type: "get",
						url:server2+'song/detail?ids='+t,
						async:false,
						success:function(data){
							details=data;
						}
					});
					//http://127.0.0.1:3000/song/detail?ids=347230
					const ap = new APlayer({
						container: document.getElementById('aplayer'),
						//fixed: true,
						lrcType: 1,
						audio: []
					});
					ap.list.add(
						{
							name: details.songs[0].name,
							artist: details.songs[0].ar[0].name,
							url: 'http://music.163.com/song/media/outer/url?id='+t+'.mp3',
							cover: details.songs[0].al.picUrl,
							lrc: LRC,
							theme: '#ebd0c2'
						}
					);
					setTimeout(function(){ap.play();},3000);
					ap.on('ended', function () {
						//alert('player ended');
						//ap.list.clear();
						ap.destroy();
					});
					//ap.play();
					////http://music.163.com/song/media/outer/url?id=ID数字.mp3
					//http://music.163.com/api/song/media?id=863046037(lrc json)
					//for(var i=t;i<t+2;i++)str+=(i+":"+MDATA.result.songs[i].name+"-"+MDATA.result.songs[i].artists[0].name+"|");
					//sendPublicMsg("/me "+t);
				}
			}
			/*if(obj[i].to==undefined&&MSG.indexOf("plumo")>=0){
				sendPublicMsg("123");
			}else if(obj[i].to!=undefined&&MSG.indexOf("plumo")>=0){
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
		//break;
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
