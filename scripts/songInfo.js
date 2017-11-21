var projectRef = database.ref("projects");
var curEntry;
var song = [];
var completeNote = 0;

var totalSongs = 0;
var songList = [];
var songList_initialThreshold = 5;
var songList_showCount = songList_initialThreshold;
var songList_window = 10;

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
	if(isMobile) $('html, body').animate({ scrollTop: 0 }, 'slow');
	loadSong();
	commentInit();
});

$("#joinBtn").on('click', function(){
	var id = localStorage.getItem("id");
	logged_in = localStorage.getItem("id");
	var key = this.getAttribute("key");
	var password = localStorage.getItem("songPassword");
	if(logged_in){
		if(password == "")
			window.location.href = "./compose.html";
		else{
			$("#privatePw").val("");
			$("#incorrect_msg").hide();
			$("#passwordModal").show();
			$("#privatePw").select();
		}
	}
	else{
		$("#id").val("");
		$("#pw").val("");
	   	$('#warning_msg').hide();
	    $('#loginModal').show();
	    $("#id").select();
	}
})

$("#passwordBtn").on('click', function(){
	var passwordGiven = $("#privatePw").val();
	var password = localStorage.getItem("songPassword");
	if(password == passwordGiven)
		window.location.href = "./compose.html";
	else{
		$("#incorrect_msg").show();
		$("#privatePw").select();
	}
})

$("#passwordModal").keypress(function (e) {
  if (e.which == 13){
  	var passwordGiven = $("#privatePw").val();
	var password = localStorage.getItem("songPassword");
	if(password == passwordGiven)
		window.location.href = "./compose.html";
	else{
		$("#incorrect_msg").show();
		$("#privatePw").select();
	}
	return false;
  }
});

$("#close").on('click', function(){
	$("#passwordModal").hide();
})

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
			songList.push({
				title: safe(snapshot.val().title),
				album: snapshot.val().album,
				participants: safe(snapshot.val().participants),
				private: safe(snapshot.val().setting),
				key: key,
			});
			totalSongs++;
			$("#totalSongs").html(totalSongs);
			if(totalSongs <= songList_showCount){
				showSongs(totalSongs-1);
				if(curEntry == undefined){
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
					commentInit();
					curEntry = $("#songList").children().last();
					curEntry.addClass("songEntry-selected");
					curInstrument = snapshot.val().instrument;
					$("#background").attr("src", value.album);
				}
			}
			else
				$("#songList-showMore").show();
		}
	});
});

function songList_showMore(){
	var old_showCount = songList_showCount;
	songList_showCount += songList_window;
	if(songList_showCount >= totalSongs){
		songList_showCount = totalSongs;
		$("#songList-showMore").hide();
	}
	for(var i = old_showCount; i < totalSongs; i++){
		showSongs(i);
	}
}

function showSongs(index){
	var title = songList[index].title;
	var album = songList[index].album;
	var participants = songList[index].participants;
	var private = songList[index].private;
	var key = songList[index].key;

	addToList(title, album, participants, private, key);
}

$("#albumCover").load(function(){
  $("#loader").hide();
  $("#mainDiv").show();
});

function loadSong(){
	var key = localStorage.getItem("melodize-cur-key");
	var songRef = database.ref("projects/"+key+"/song");
	songRef.on('child_added', function(snapshot){
		var index = snapshot.key.split("note")[1];
		if(index < completeNote){
			var maxSound = snapshot.val().maxSound;
			if(maxSound > -1)
				song[index] = maxSound;
		}
	});
	$("#songLength").html("("+timeInterval*completeNote/1000+" sec)");
}

$("#playSong").on('click', function(){
	this.disabled = true;
	playing = true;
	playPreview(0, completeNote);
});

$("#stopSong").on('click', function(){
	playing = false;
});

$("#songList-showMore").on('click', function(){
	songList_showMore();
})

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

function init(){
	pageReload = true;
	sound_init(["piano", "violin"]);
	$("#songList-showMore").hide();
}

init();


