// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript.Friend=function(_response,_canvasContext,_x,_y){this.name=_response.name;this.id=_response.id;this.$0=_canvasContext;this.x=_x;this.y=_y;this.connections=[];var $0=document.createElement('img');$0.src='http://graph.facebook.com/'+this.id+'/picture';$0.id=this.get_imageid();$0.style.visibility='hidden';document.getElementById('images').insertBefore($0);$('#'+this.get_imageid()).one('load',ss.Delegate.create(this,this.drawLoadImage));}
JSFFScript.Friend.prototype={$0:null,name:null,x:0,y:0,id:null,connections:null,get_imageid:function(){return 'image'+this.id;},get_getImageElement:function(){return document.getElementById(this.get_imageid());},highlightPrimary:function(){this.$0.fillStyle='red';this.$0.fillRect(this.x-JSFFScript._FFJS.$1,this.y-JSFFScript._FFJS.$1,JSFFScript._FFJS.$1*2+JSFFScript._FFJS.$0,JSFFScript._FFJS.$1*2+JSFFScript._FFJS.$0);this.drawImage();},highlightSecondary:function(){this.$0.fillStyle='green';this.$0.fillRect(this.x-JSFFScript._FFJS.$1,this.y-JSFFScript._FFJS.$1,JSFFScript._FFJS.$1*2+JSFFScript._FFJS.$0,JSFFScript._FFJS.$1*2+JSFFScript._FFJS.$0);this.drawImage();},drawLoadImage:function(e){this.drawImage();},drawImage:function(){this.$0.drawImage(this.get_getImageElement(),this.x,this.y,JSFFScript._FFJS.$0,JSFFScript._FFJS.$0);}}
JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$8=function($p0){var $0={};$0.scope='email, user_likes, publish_stream';FB.login(function($p1_0){
},$0);}
JSFFScript._FFJS.$9=function($p0){JSFFScript._FFJS.$B();var $0={};FB.api('/me/friends',function($p1_0){
JSFFScript._FFJS.$A($p1_0.data.length);for(var $1_2=0;$1_2<$p1_0.data.length;$1_2++){var $1_3=(Math.floor($1_2%JSFFScript._FFJS.$2)*(JSFFScript._FFJS.$0+JSFFScript._FFJS.$1))+JSFFScript._FFJS.$1;var $1_4=(Math.floor($1_2/JSFFScript._FFJS.$2)*(JSFFScript._FFJS.$0+JSFFScript._FFJS.$1))+JSFFScript._FFJS.$1;var $1_5=new JSFFScript.Friend($p1_0.data[$1_2],JSFFScript._FFJS.$7,$1_3,$1_4);JSFFScript._FFJS.$4[$1_5.id]=$1_5;}var $1_0={};$1_0.friendsLimit='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$3+' ORDER BY uid2';$1_0.friendsAll='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$3;$1_0.friendsoffriends='SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';var $1_1={};$1_1.method='fql.multiquery';$1_1.queries=$1_0;FB.api($1_1,function($p2_0){
if(JSFFScript._FFJS.$5){alert($p2_0[2].fql_result_set.length);}for(var $2_0=0;$2_0<$p2_0[2].fql_result_set.length;$2_0++){var $2_1=$p2_0[2].fql_result_set[$2_0];(JSFFScript._FFJS.$4[$2_1.uid1]).connections.add($2_1.uid2);(JSFFScript._FFJS.$4[$2_1.uid2]).connections.add($2_1.uid1);}if(JSFFScript._FFJS.$5){alert(Object.getKeyCount(JSFFScript._FFJS.$4));}});});$('#tutorial').mousemove(JSFFScript._FFJS.$E);$('#tutorial').click(JSFFScript._FFJS.$D);}
JSFFScript._FFJS.$A=function($p0){var $0=JSFFScript._FFJS.$6.width;JSFFScript._FFJS.$2=Math.ceil(Math.sqrt($p0));JSFFScript._FFJS.$0=(($0-JSFFScript._FFJS.$1)/JSFFScript._FFJS.$2)-JSFFScript._FFJS.$1;}
JSFFScript._FFJS.$B=function(){JSFFScript._FFJS.$7.save();JSFFScript._FFJS.$7.setTransform(1,0,0,1,0,0);JSFFScript._FFJS.$7.clearRect(0,0,JSFFScript._FFJS.$6.width,JSFFScript._FFJS.$6.height);JSFFScript._FFJS.$7.restore();}
JSFFScript._FFJS.$C=function($p0){FB.logout(function(){
});(document.getElementById('image')).src='';$('#resultsDiv').html('');}
JSFFScript._FFJS.$D=function($p0){JSFFScript._FFJS.$B();JSFFScript._FFJS.$11();var $0=JSFFScript._FFJS.$F($p0);if(ss.isNullOrUndefined($0)){return;}JSFFScript._FFJS.$10($0);}
JSFFScript._FFJS.$E=function($p0){var $0=JSFFScript._FFJS.$F($p0);var $1='';if(!ss.isNullOrUndefined($0)){$1=$0.name;}$('#friendName').text($1);}
JSFFScript._FFJS.$F=function($p0){for(var $0=0;$0<Object.keys(JSFFScript._FFJS.$4).length;$0++){var $1=JSFFScript._FFJS.$4[Object.keys(JSFFScript._FFJS.$4)[$0]];if($1.x<$p0.offsetX&&($1.x+JSFFScript._FFJS.$0)>$p0.offsetX&&$1.y<$p0.offsetY&&($1.y+JSFFScript._FFJS.$0)>$p0.offsetY){return $1;}}return null;}
JSFFScript._FFJS.$10=function($p0){for(var $0=0;$0<$p0.connections.length;$0++){var $1=JSFFScript._FFJS.$4[$p0.connections[$0]];$1.highlightSecondary();}$p0.highlightPrimary();}
JSFFScript._FFJS.$11=function(){for(var $0=0;$0<Object.keys(JSFFScript._FFJS.$4).length;$0++){var $1=JSFFScript._FFJS.$4[Object.keys(JSFFScript._FFJS.$4)[$0]];$1.drawImage();}}
JSFFScript._FFJS.$12=function(){JSFFScript._FFJS.$6=document.getElementById('tutorial');JSFFScript._FFJS.$7=JSFFScript._FFJS.$6.getContext('2d');$('#MyButton').click(JSFFScript._FFJS.$8);$('#PostButton').click(JSFFScript._FFJS.$9);$('#LogoutButton').click(JSFFScript._FFJS.$C);var $0={};$0.appId='240082229369859';$0.channelUrl='//limeyhouse.dyndns.org/channel.aspx';$0.status=true;$0.cookie=true;$0.xfbml=false;FB.init($0);FB.getLoginStatus(function($p1_0){
if($p1_0.status==='connected'){JSFFScript._FFJS.$3=$p1_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$3+'/picture';}});FB.Event.subscribe('auth.authResponseChange',function($p1_0){
if(JSFFScript._FFJS.$5){alert('Event Login Fired');}if($p1_0.status==='connected'){JSFFScript._FFJS.$3=$p1_0.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+$p1_0.userID+'/picture';}else{alert('Not Logged in ');}});}
JSFFScript.Friend.registerClass('JSFFScript.Friend');JSFFScript._FFJS.registerClass('JSFFScript._FFJS');JSFFScript._FFJS.$0=0;JSFFScript._FFJS.$1=10;JSFFScript._FFJS.$2=0;JSFFScript._FFJS.$3=null;JSFFScript._FFJS.$4={};JSFFScript._FFJS.$5=false;JSFFScript._FFJS.$6=null;JSFFScript._FFJS.$7=null;(function(){$(JSFFScript._FFJS.$12);})();
})();// This script was generated using Script# v0.7.4.0
