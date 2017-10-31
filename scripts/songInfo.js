var joinBtn = document.getElementById("joinBtn");
var passwordModal = document.getElementById('passwordModal');
var paasswordError = document.getElementById('incorrect_msg');
var passwordClose = document.getElementById("close");
var paasswordBtn = document.getElementById('passwordBtn');
var projectRef = database.ref("projects");
var curEntry;
var sound = [];
var playing = false;
var song = [];
var completeNote = 0;
var loaded = 0;
var timeInterval = 500;

function changeInfo(title, description, instrument, participants, lyrics, album, preference, setting, password){
	$("#titleInfo").html(title);
	$("#descriptionInfo").html(description);
	$("#instrumentInfo").html("<b>Instrument:</b> "+instrument);
	$("#participantsInfo").html("<b>No. of participants:</b> "+participants);
	$("#lyricBox").html(lyrics.replace(/\n/g, "<br>"));
	$("#albumCover").attr("src", album);
	$("#preferenceInfo").html("<b>Requester's remark:</b> "+preference);
	if(setting == "private"){
		$("#joinBtn").html("<i style='font-size: 100%' class='material-icons'>lock</i> Join");
		localStorage.setItem("songPassword", password)
	}
	else{
		$("#joinBtn").html("Join");
		localStorage.setItem("songPassword", "")
	}
}

function addToList(title, album, participants, private, key){
	var str = "<div id='songEntry' name='"+title+"' key='"+key+"' style='border-bottom: 0.5px solid; padding: 4px; border-color: #b1b1b1; width: 100%; height: 100px;'>"+
			"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
			"<div style='padding: 5px; float: left; width: 50%; height: 100px; overflow: hidden'><div style='font-size: 18px;'>"+title+"</div>"+
			"<div style='color: gray'>Participants: "+participants+"</div>";
	if(private == "private")
		str += "<i class='material-icons'>lock</i>";
	str += "</div></div>";
	$("#songList").append(str);
	return document.getElementById("songList").lastChild;
}

$(document).on('click', '#songEntry', function(){
	var key = this.getAttribute("key");
	var songRef = database.ref("projects/"+key);
	if(curEntry != undefined)
		curEntry.style.backgroundColor = "";
	this.style.backgroundColor = "#d1d1d1";
	curEntry = this;
	playing = false;
	songRef.once("value", function(snapshot){
		changeInfo(safe(snapshot.val().title),
				   safe(snapshot.val().description),
				   safe(snapshot.val().instrument),
				   safe(snapshot.val().participants),
				   safe(snapshot.val().lyrics),
				   snapshot.val().album,
				   safe(snapshot.val().preference),
				   safe(snapshot.val().setting),
				   snapshot.val().password);
		completeNote = snapshot.val().completeNote;
	});
	localStorage.setItem("melodize-cur-key", key);
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	loadSong();
});

joinBtn.onclick = function(){
	var id = localStorage.getItem("id");
	logged_in = localStorage.getItem("id");
	var key = this.getAttribute("key");
	var password = localStorage.getItem("songPassword");
	if(logged_in){
		if(password == "")
			window.location.href = "./compose.html";
		else{
			$("#privatePw").val("");
			paasswordError.style.display = "none";
			passwordModal.style.display = "block";
			$("#privatePw").select();
		}
	}
	else{
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	}
}

passwordBtn.onclick = function(){
	var passwordGiven = $("#privatePw").val();
	var password = localStorage.getItem("songPassword");
	if(password == passwordGiven)
		window.location.href = "./compose.html";
	else{
		paasswordError.style.display = "block";
		$("#privatePw").select();
	}
}

$("#passwordModal").keypress(function (e) {
  if (e.which == 13){
  	var passwordGiven = $("#privatePw").val();
	var password = localStorage.getItem("songPassword");
	if(password == passwordGiven)
		window.location.href = "./compose.html";
	else{
		paasswordError.style.display = "block";
		$("#privatePw").select();
	}
	return false;
  }
});

passwordClose.onclick = function() {
    passwordModal.style.display = "none";
}

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value.length != value.completeNote)
		if(curEntry != undefined)
			addToList(safe(value.title), value.album, safe(value.participants), safe(value.setting), key);
		else{
			changeInfo(safe(snapshot.val().title),
				safe(snapshot.val().description),
		    	safe(snapshot.val().instrument),
		    	safe(snapshot.val().participants),
				safe(snapshot.val().lyrics),
				snapshot.val().album,
			   	safe(snapshot.val().preference),
			   	safe(snapshot.val().setting),
			   	snapshot.val().password);
			completeNote = snapshot.val().completeNote;
			localStorage.setItem("melodize-cur-key", key)
			loadSong();
			curEntry = addToList(safe(value.title), value.album, safe(value.participants), safe(value.setting), key);
			curEntry.style.backgroundColor = "#d1d1d1";
		}
});

$("#albumCover").load(function(){
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainDiv").style.display = "block";
});

function loadedAudio() {
    loaded++;
    console.log(loaded+"/7 loaded");
}

function init(){
	sound = [new Audio("./sounds/do.wav"),
		    new Audio("./sounds/rae.wav"),
			new Audio("./sounds/mi.wav"),
		    new Audio("./sounds/fa.wav"),
		    new Audio("./sounds/sol.wav"),
		    new Audio("./sounds/ra.wav"),
		    new Audio("./sounds/si.wav"),];
	for(var i = 0; i < sound.length; i++){
		sound[i].preload = "auto";
		sound[i].addEventListener('canplaythrough', loadedAudio, false);
	};
}

function loadSong(){
	var key = localStorage.getItem("melodize-cur-key");
	var songRef = database.ref("projects/"+key+"/song");
	songRef.on('child_added', function(snapshot){
		var index = snapshot.key.split("note")[1];
		if(index < completeNote){
			var maxSound = snapshot.val().maxSound;
			if(maxSound > -1){
				$("#note_"+index+"_"+maxSound).css("background-color", "black");
				song[index] = maxSound;
			}
			for(var j = 0; j < 7; j++){
				$("#note_"+index+"_"+j).removeClass("note");
				$("#note_"+index+"_"+j).addClass("completeNote");
			}
		}
	});
	$("#songLength").html("("+timeInterval*completeNote/1000+" sec)");
}

$("#playSong").on('click', function(){
	this.disabled = true;
	playing = true;
	playSong(0, completeNote);
});

$("#stopSong").on('click', function(){
	playing = false;
});

function playSong(start, end){
	if(start > end){
		var temp = start;
		start = end;
		end = temp;
	}
	var i = start;
	var countdown = setInterval(function(){
		if(playing != true || i == end){
			clearInterval(countdown);
			playing = false;
			$("#playSong").prop('disabled', false);
			console.log("preview ended");
		}
		else{
			if(song[i] != undefined){
				var note = sound[song[i]].cloneNode(true);
				note.play();
				note.remove();
			}
		}
		i++;
	}, timeInterval);
};

init();
