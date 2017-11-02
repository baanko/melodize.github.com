var songs = [];
var projectRef = database.ref("projects");
var completedNum = 0;

function addSong(title, participants, album, key){
	var song = '<div class="inBox">'+
	      			'<div class="imgFrame">'+
	        			'<img onerror="this.src =`./img/default-cover-art.png`" src="'+album+'">'+
	      			'</div>'+
	      			'<div style="font-size: 18px">'+title+'</div>'+
	      			'<div style="color: #818181">Participants: '+participants+'</div>'+
	      			'<button id="checkBtn" class="btn btn-default" style="margin: 12px; width: 150px" key="'+key+'"">Check</button> '+
    			'</div>';

	$("#board").append(song);
	console.log("added");
}

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value.completeNote == value.length){
		var title = safe(value.title);
		var participants = safe(value.participants);
		var album = value.album;
		addSong(title, participants, album, key);
		completedNum++;
		$("#completed").html(completedNum+" songs");
	}
});

$(document).on('click', '#checkBtn', function(){
	var key = this.getAttribute("key");
	localStorage.setItem("melodize-cur-key", key);
	window.location.href = "./checkSong.html";
});

function init(){
	var userRef = database.ref("user/accounts");
	var projectRef = database.ref("projects")
	userRef.once("value", function(snapshot){
		$("#totalUsers").html(snapshot.numChildren()+" users");
	});
	projectRef.once("value", function(snapshot){
		$("#requests").html(snapshot.numChildren()+" lyrics");
	}).then(function(){
		document.getElementById("loader").style.display = "none";
  		document.getElementById("mainDiv").style.display = "block";
  		console.log("loaded");
  	});
}

init();