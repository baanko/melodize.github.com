var projectRef = database.ref("projects");
var profileModal = document.getElementById('profileModal');
var profileClose = document.getElementById("profileClose");

var requestNum = 0;
var requestList = [];
var requestList_initialThreshold = 3;
var requestList_showCount = requestList_initialThreshold;
var requestList_window = 3;

var contributionNum = 0;
var contributeList = [];
var contributeList_initialThreshold = 3;
var contributeList_showCount = contributeList_initialThreshold;
var contributeList_window = 3;

function addToRequests(title, album, participants, private, key){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' class='list-entry'>"+
				"<img class='list-album' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div class='list-title'><div style='font-size: 18px;'>"+title+"</div>"+
				"<button id='checkProgress' key='"+key+"' class='btn btn-default'>Check Progress</button></div></div>";
	$("#myRequests").append(str);
}

function addToContributions(title, album, participants, private, key, pass){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' class='list-entry'>"+
				"<img class='list-album' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div class='list-title'><div style='font-size: 18px;'>"+title+"</div>"+
				"<button id='reJoin' key='"+key+"' class='btn btn-default' "+reJoin(pass)+">Re-join</button></div></div>";
	$("#myContributions").append(str);
}

function reJoin(pass){
	if(pass) 
		return "";
	else 
		return "disabled";
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
		requestList.push({
			title: safe(snapshot.val().title),
			album: snapshot.val().album,
			participants: safe(snapshot.val().participants),
			private: safe(snapshot.val().setting),
			key: key,
		});
		requestNum++;
		$("#profileRequestNum").html(requestNum);
		$("#requestNum").html(requestNum);
		if(requestNum <= requestList_showCount)
			showSongs(requestNum-1, requestList);
		else
			$("#showMore1").show();
	}
	var contributionRef = database.ref("user/accounts/"+id+"/"+safe(value.title)+"/windowIndex");
	contributionRef.once('value', function(snapshot1){
		var pass = false;
		if(snapshot1.val() != undefined){
			if(value.windowIndex > snapshot1.val())
				pass = true;
			contributeList.push({
				title: safe(snapshot.val().title),
				album: snapshot.val().album,
				participants: safe(snapshot.val().participants),
				private: safe(snapshot.val().setting),
				key: key,
				pass: pass,
			});
			contributionNum++;
			$("#profileContributions").html(contributionNum);
			$("#contributionNum").html(contributionNum);
			if(contributionNum <= contributeList_showCount)
				showSongs(contributionNum-1, contributeList);
			else
				$("#showMore2").show();
		}
	})
});

function requestList_showMore(){
	var old_showCount = requestList_showCount;
	requestList_showCount += requestList_window;
	if(requestList_showCount >= requestNum){
		requestList_showCount = requestNum;
		$("#showMore1").hide();
	}
	for(var i = old_showCount; i < requestList_showCount; i++){
		showSongs(i, requestList);
	}
}

function contributeList_showMore(){
	var old_showCount = contributeList_showCount;
	contributeList_showCount += contributeList_window;
	if(contributeList_showCount >= contributionNum){
		contributeList_showCount = contributionNum;
		$("#showMore2").hide();
	}
	for(var i = old_showCount; i < contributeList_showCount; i++){
		showSongs(i, contributeList);
	}
}

function showSongs(index, type){
	var title = type[index].title;
	var album = type[index].album;
	var participants = type[index].participants;
	var private = type[index].private;
	var key = type[index].key;

	if(type == requestList)
		addToRequests(title, album, participants, private, key);
	else 
		addToContributions(title, album, participants, private, key, type[index].pass);
}

$("#showMore1").on('click', function(){
	requestList_showMore();
})

$("#showMore2").on('click', function(){
	contributeList_showMore();
})

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
	$("#profileBack").prop("src", url);
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

$("#requesterBtn").on('click', function() {
	window.location.href = "./request.html";
})

$("#workerBtn").on('click', function() {
	window.location.href = "./songInfo.html";
})

function init(){
	var id = localStorage.getItem("id");
	pageCritical = true;
	$("#profileId").html(localStorage.getItem("id").split("%%%")[0]);
	database.ref("user/accounts/"+id).once('value', function(snapshot){
		$("#profileScore").html(snapshot.val().score);
		$("#profilePic").attr("src", snapshot.val().profilePic);
		$("#profileBack").attr("src", snapshot.val().profilePic);
		$("#contributions").html(snapshot.val().contributions)
	});
	$("#showMore1").hide();
	$("#showMore2").hide();
}

init();

