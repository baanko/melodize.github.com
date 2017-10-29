var title;
var description;
var participants;
var preferrence;
var album;
var lyrics;
var instrument;
var syllable = [];
var sound = [];
var song = [];
var lyric = [];
var start = 0;
var end = 10;
var playing = false;
var loaded = 0;
var length;
var timeInterval = 500;

function fillScore(length){
	var code = "";
    for(var i = 0; i < length; i++){
    	code+=  "<div id='column"+i+"' class='column'>"+
    				"<div id='note_"+i+"_6' class='note'></div>"+
    				"<div id='note_"+i+"_5' class='note'></div>"+
            		"<div id='note_"+i+"_4' class='note'></div>"+
            		"<div id='note_"+i+"_3' class='note'></div>"+
            		"<div id='note_"+i+"_2' class='note'></div>"+
           			"<div id='note_"+i+"_1' class='note'></div>"+
            		"<div id='note_"+i+"_0' class='note'></div>"+
            		"<div id='syllable"+i+"' class='syllable'></div>"+
          		"</div>";
    }
	$("#score").html(code);
}

$(document).on('click', '.note', function(){
	var x_cor = this.getAttribute("id").split("_")[1];
	var y_cor = this.getAttribute("id").split("_")[2];
	$("#to").val(eval(x_cor)+1);
	if(song[x_cor] != undefined){
		var id = "#note_"+x_cor+"_"+song[x_cor];
		$(id).css("background-color", "");
	}
	if(y_cor == song[x_cor])
		song[x_cor] = undefined;
	else {song[x_cor] = y_cor;
		var note = sound[y_cor].cloneNode(true);
		note.play();
		note.remove();
		this.style.backgroundColor = "black";
	}
});

function playSong(start, end){
	if(start > end){
		var temp = start;
		start = end;
		end = temp;
	}
	var i = start;
	var countdown = setInterval(function(){
		if(i == end){
			clearInterval(countdown);
			playing = false;
			document.getElementById("playSong").disabled = false;
			$("#column"+(i-1)).removeClass("currCol");
		}
		else{
			$("#column"+(i-1)).removeClass("currCol");
			$("#column"+i).addClass("currCol");
			if(song[i] != undefined){
				var note = sound[song[i]].cloneNode(true);
				note.play();
				note.remove();
			}
		}
		i++;
	}, timeInterval);
};

$("#playSong").on('click', function(){
	if(playing == false){
		playing = true;
		document.getElementById("playSong").disabled = true;
		var st = $("#from").val();
		var ed = $("#to").val();
		playSong(st, ed);
	}
});

$("#submitBtn").on('click', function(){
	var key = localStorage.getItem("melodize-cur-key");
	var st = $("#submitFrom").val();
	var ed = $("#submitTo").val();
	var participantNumRef = database.ref("projects/"+key);
	participantNumRef.once("value", function(snapshot){
		var participantNum = snapshot.val().participants;
		participantNumRef.update({
			participants: participantNum+1,
		});
	});
	for(var i = st; i < ed; i++){
		if(song[i] == undefined)
			continue;
		console.log("uploaded note "+i);
		var songRef;
		var maxNum;
		var maxSound;
		var curSound;
		songRef = database.ref("projects/"+key+"/song/note"+i);
		songRef.once("value", function(snapshot){
			maxNum = snapshot.val().maxNum;
			maxSound = snapshot.val().maxSound;
			curSound = snapshot.val()["sound"+song[i]];
			if(maxNum < (eval(curSound)+1)){
				songRef.update({
					maxNum: curSound+1,
					maxSound: eval(song[i]),
				});
			}
			songRef.update({
				["sound"+song[i]]: curSound+1,
			});
		});
	};
	alert("Submitted!");
	window.location.href = "./songInfo.html";
});

function loadedAudio() {
    loaded++;
    console.log(loaded+"/7 loaded");
}

function init(){
	pageCritical = true;

	var key = localStorage.getItem("melodize-cur-key");
	var songRef = database.ref("projects/"+key);
	songRef.once("value", function(snapshot){
		title = safe(snapshot.val().title);
		description = safe(snapshot.val().description);
		instrument = safe(snapshot.val().instrument);
		participants = safe(snapshot.val().participants);
		lyrics = safe(snapshot.val().lyrics);
		album = snapshot.val().album;
		preferrence = safe(snapshot.val().preferrence);
		length = snapshot.val().length;
		
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
	}).then(function(){
		$("#composeTitle").html(title);
		$("#composeDescription").html("<b>Description: </b>"+description);
		$("#composeParticipants").html("<b>Participants: </b>"+participants);
		$("#composePreferrence").html("<b>Preferrence: </b>"+preferrence);
		$("#composeAlbum").attr("src", album);
		$("#submitTo").val(length);
		fillScore(length);
	}).then(function(){
		var syllableRef = database.ref("projects/"+key+"/song");
		syllableRef.on('child_added', function(snapshot){
			var index = snapshot.key.split("note")[1];
			var syllable = snapshot.val().syllable;
			lyric[index] = syllable;
			if(syllable == " ")
				$("#syllable"+index).html("-");
			else
				$("#syllable"+index).html(syllable);
		});
	});
};

init();

