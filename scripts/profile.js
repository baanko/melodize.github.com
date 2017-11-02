var projectRef = database.ref("projects");
var requestNum = 0;
var profileModal = document.getElementById('profileModal');
var profileClose = document.getElementById("profileClose");

function addToRequests(title, album, participants, private, key){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' style='border-bottom: 0.5px solid; border-color: #b1b1b1; padding: 4px; width: 100%; height: 100px;'>"+
				"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div style='padding: 5px; float: left; width: 50%; height: 100px; overflow: hidden'><div style='font-size: 18px;'>"+title+"</div>"+
				"<button id='checkProgress' key='"+key+"' class='btn btn-success'>Check Progress</button></div></div>";
	$("#myRequests").append(str);
}

function addToContributions(title, album, participants, private, key, pass){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' style='border-bottom: 0.5px solid; border-color: #b1b1b1; padding: 4px; width: 100%; height: 100px;'>"+
				"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div style='padding: 5px; float: left; width: 50%; height: 100px; overflow: hidden'><div style='font-size: 18px;'>"+title+"</div>"+
				"<button id='reJoin' key='"+key+"' class='btn btn-success' "+reJoin(pass)+">Re-join</button></div></div>";
	$("#myContributions").append(str);
}

function reJoin(pass){
	if(pass) 
		return "";
	else 
		return "disabled";
}

function init(){
	var id = localStorage.getItem("id");
	pageCritical = true;
	$("#profileId").html(localStorage.getItem("id").split("%%%")[0]);
	database.ref("user/accounts/"+id).once('value', function(snapshot){
		$("#profileScore").html("<b>Score:</b> "+snapshot.val().score+" pt");
		$("#profilePic").attr("src", snapshot.val().profilePic);
		$("#contributions").html("<b>Contributions:</b> "+snapshot.val().contributions+" notes")
	});
}

$(document).on('click', '#checkProgress', function(){
	var key = this.getAttribute("key");
	localStorage.setItem("melodize-cur-key", key);
	window.location.href = "./checkProgress.html";
});

$(document).on('click', '#reJoin', function(){
	var key = this.getAttribute("key");
	localStorage.setItem("melodize-cur-key", key);
	window.location.href = "./compose.html";
});

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	var id = localStorage.getItem("id");
	if(value.requester == id){
		addToRequests(safe(value.title), value.album, safe(value.participants), safe(value.setting), key);
		requestNum++;
		$("#profileRequestNum").html("<b>Requests:</b> "+requestNum+" songs");
	}
	var contributionRef = database.ref("user/accounts/"+id+"/"+safe(value.title)+"/windowIndex");
	contributionRef.once('value', function(snapshot1){
		var pass = false;
		if(snapshot1.val() != undefined){
			if(value.windowIndex > snapshot1.val())
				pass = true;
			addToContributions(safe(value.title), value.album, safe(value.participants), safe(value.setting), key, pass);
		}
	})
});

$("#profileURL").change(function(){
	var url = $("#profileURL").val();
	$("#profilePreview").attr("src", url);
});

$("#profileBtn").on('click', function(){
	var url = $("#profileURL").val();
	var key = localStorage.getItem("id");
	var profileRef = database.ref("user/accounts/"+key);
	profileRef.update({
		profilePic: url,
	});
	profileModal.style.display = "";
	$("#profilePic").prop("src", url);
});

profileClose.onclick = function() {
    profileModal.style.display = "none";
}

$("#profilePic").load(function(){
  	document.getElementById("loader").style.display = "none";
  	document.getElementById("mainDiv").style.display = "block";
  	console.log("loaded");
});

$("#changeProfileBtn").on('click', function(){
	$("#profileURL").val("");
	profileModal.style.display = "block";
	$("#profileURL").select();
});

init();

