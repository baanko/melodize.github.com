var projectRef = database.ref("projects");
var requestNum = 0;

function addToRequests(title, album, participants, private, key){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' style='border-bottom: 0.5px solid; border-color: #b1b1b1; padding: 4px; width: 100%; height: 100px;'>"+
				"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div style='padding: 5px; float: left; width: 50%; height: 100px; overflow: hidden'><div style='font-size: 18px;'>"+title+"</div>"+
				"<button id='checkProgress' key='"+key+"' class='btn btn-success'>Check Progress</button></div></div>";
	$("#myRequests").append(str);
}

function init(){
	var id = localStorage.getItem("id");
	pageCritical = true;
	database.ref("user/accounts/"+id).once('value', function(snapshot){
		$("#profileScore").html("<b>Score:</b> "+snapshot.val().score+" pt");
		$("#profilePic").attr("src", snapshot.val().profilePic);
	});
}

$(document).on('click', '#checkProgress', function(){
	var key = this.getAttribute("key");
	localStorage.setItem("melodize-cur-key", key);
	window.location.href = "./checkProgress.html";
});

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	var id = localStorage.getItem("id");
	if(value.requester == id)
		addToRequests(value.title, value.album, value.participants, value.setting, key);
	requestNum++;
	$("#profileRequestNum").html("<b>Requests:</b> "+requestNum+" songs");
});

$("#profileId").html(localStorage.getItem("id").split("%%%")[0]);
init();

