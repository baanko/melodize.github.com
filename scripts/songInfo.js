var joinBtn = document.getElementById("joinBtn");
var passwordModal = document.getElementById('passwordModal');
var paasswordError = document.getElementById('incorrect_msg');
var passwordClose = document.getElementById("close");
var paasswordBtn = document.getElementById('passwordBtn');
var projectRef = database.ref("projects");
var curEntry;
var sound = {};
var playing = false;
var song = [];
var completeNote = 0;
var loaded = 0;
var timeInterval = 500;
var maxNote = 7;
var curInstrument;
var totalSongs = 0;

function changeInfo(title, description, instrument, participants, lyrics, album, preference, setting, password, requester){
	$("#titleInfo").html(title);
	$("#descriptionInfo").html(description);
	$("#instrumentInfo").html("<b>Instrument:</b> "+instrument);
	$("#participantsInfo").html("<b>No. of participants:</b> "+participants);
	$("#requesterInfo").html("<b>Requester:</b> "+requester);
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
	$("#background").attr("src", album);
}

function addToList(title, album, participants, private, key){
	var str = "<div id='songEntry' class='songEntry' name='"+title+"' key='"+key+"' participants="+participants+">"+
			"<img class='songImage' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
			"<div class='songDetail'><div style='font-size: 18px;'>"+title+"</div>"+
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
		curEntry.removeClass("songEntry-selected");
	$(this).addClass("songEntry-selected");
	curEntry = $(this);
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
				   snapshot.val().password,
				   safe(snapshot.val().requester.split("%%%")[0]));
		completeNote = snapshot.val().completeNote;
		curInstrument = snapshot.val().instrument;
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
	var id = localStorage.getItem("id");
	var windowIndex;
	var contributionRef = database.ref("user/accounts/"+id+"/"+safe(value.title)+"/windowIndex");
	contributionRef.once('value', function(snapshot1){
		if(snapshot1.val() == undefined)
			windowIndex = -1;
		else
			windowIndex = snapshot1.val();
	}).then(function(){
		if(value.length != value.completeNote && value.windowIndex > windowIndex){
			if(curEntry != undefined){
				addToList(safe(value.title), value.album, safe(value.participants), safe(value.setting), key);
				sort("participants", "down");
			}
			else{
				changeInfo(safe(snapshot.val().title),
					safe(snapshot.val().description),
			    	safe(snapshot.val().instrument),
			    	safe(snapshot.val().participants),
					safe(snapshot.val().lyrics),
					snapshot.val().album,
				   	safe(snapshot.val().preference),
				   	safe(snapshot.val().setting),
				   	snapshot.val().password,
				   	safe(snapshot.val().requester.split("%%%")[0]));
				completeNote = snapshot.val().completeNote;
				localStorage.setItem("melodize-cur-key", key)
				loadSong();
				curEntry = $(addToList(safe(value.title), value.album, safe(value.participants), safe(value.setting), key));
				curEntry.addClass("songEntry-selected");
				curInstrument = snapshot.val().instrument;
				$("#background").attr("src", value.album);
			}
			totalSongs++;
			$("#totalSongs").html(totalSongs);
		}
	});
});

$("#albumCover").load(function(){
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainDiv").style.display = "block";
});

function loadedAudio() {
    loaded++;
    if(loaded == maxNote*2)
    	$("#playSong").prop('disabled', false);
    console.log(loaded+"/"+(maxNote*2)+" loaded");
}

function init(){
	pageReload = true;
	sound["piano"] = [new Audio("./sounds/piano/do.wav"),
		    	new Audio("./sounds/piano/rae.wav"),
				new Audio("./sounds/piano/mi.wav"),
		    	new Audio("./sounds/piano/fa.wav"),
		    	new Audio("./sounds/piano/sol.wav"),
		    	new Audio("./sounds/piano/ra.wav"),
		    	new Audio("./sounds/piano/si.wav"),];
	sound["violin"] = [new Audio("./sounds/violin/do.mp3"),
		    	new Audio("./sounds/violin/rae.mp3"),
				new Audio("./sounds/violin/mi.mp3"),
		    	new Audio("./sounds/violin/fa.mp3"),
		    	new Audio("./sounds/violin/sol.mp3"),
		    	new Audio("./sounds/violin/ra.mp3"),
		    	new Audio("./sounds/violin/si.mp3"),];
	for(var i = 0; i < maxNote; i++){
		sound["piano"][i].preload = "auto";
		sound["piano"][i].addEventListener('canplaythrough', loadedAudio, false);
		sound["violin"][i].preload = "auto";
		sound["violin"][i].addEventListener('canplaythrough', loadedAudio, false);
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
			for(var j = 0; j < maxNote; j++){
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
				var note = sound[curInstrument][song[i]].cloneNode(true);
				note.play();
				note.remove();
			}
		}
		i++;
	}, timeInterval);
};

function sort(key, order){
	if(order == "up"){
		$('.songEntry').sortElements(function(a, b){
			if(key == "participants")
				return eval($(a).attr(key)) > eval($(b).attr(key)) ? 1 : -1;
			else
		  		return $(a).attr(key) > $(b).attr(key) ? 1 : -1;
		});
	}
	else{
		$('.songEntry').sortElements(function(b, a){
			if(key == "participants")
				return eval($(a).attr(key)) > eval($(b).attr(key)) ? 1 : -1;
			else
		    	return $(a).attr(key) > $(b).attr(key) ? 1 : -1;
		});
	}
}

function filter(attr, key){
	$('.songEntry').show();
	$('.songEntry').filter(function(){
		return $(this).attr(attr) == key;
	}).hide();
}

$("#sortingSelect").change(function(){
	//var inst = $("#instrumentSelect").val();
	var sorting = eval($("#sortingSelect").val());

	switch(sorting){
		case 0:
			sort("name", "up");
			break;
		case 1:
			sort("name", "down");
			break;
		case 2:
			sort("participants", "down");
			break;
		case 3: 
			sort("participants", "up");
			break;
		default:
	}
});

function addComment(name, pic, text){
	var code = '<div class="comment"><img class="profile-img" src="'+pic+'" onerror="this.src = `./img/default-avatar.jpg`">'+
                '<div class="comment-box"><div class="comment-id"> '+name+'</div>'+
                '<div class="comment-content">'+text+'</div></div></div>';
	$("#comments").append(code);
};

init();
addComment("test","","this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!!  yolo!!!");
addComment("test","","this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!! this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!! this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!! this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!! this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!! this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!! this is so great! I love this. I love crowdsourcing. Yeah! Yeah! yolo!!!");


