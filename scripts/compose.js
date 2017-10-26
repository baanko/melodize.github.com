var title;
var description;
var participants;
var preferrence;
var album;
var lyrics;
var instrument;
var sound = [];
var song = [];
var start = 0;
var end = 10;
var playing = false;
var loaded = 0;

function fillScore(length){
	var code = "";
    for(var i = 0; i < length; i++){
    	code+=  "<div id='column"+i+"'style='border: 1px solid; height: 300px; width:50px; display: inline-block'>"+
    				"<div id='note_"+i+"_5' class='note'></div>"+
            		"<div id='note_"+i+"_4' class='note'></div>"+
            		"<div id='note_"+i+"_3' class='note'></div>"+
            		"<div id='note_"+i+"_2' class='note'></div>"+
           			"<div id='note_"+i+"_1' class='note'></div>"+
            		"<div id='note_"+i+"_0' class='note'></div>"+
          		"</div>";
    }
	$("#score").html(code);
}

$(document).on('click', '.note', function(){
	var x_cor = this.getAttribute("id").split("_")[1];
	var y_cor = this.getAttribute("id").split("_")[2];
	this.style.backgroundColor = "black";
	if(song[x_cor] != undefined){
		var id = "#note_"+x_cor+"_"+song[x_cor];
		$(id).css("background-color", "");
	}
	var note = sound[y_cor].cloneNode(true);
	note.play();
	note.remove();
	song[x_cor] = y_cor;
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
	}, 500);
};

$("#playSong").on('click', function(){
	if(playing == false){
		playing = true;
		var st = $("#from").val();
		var ed = $("#to").val();
		playSong(st, ed);
	}
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
		title = snapshot.val().title;
		description = snapshot.val().description;
		instrument = snapshot.val().instrument;
		participants = snapshot.val().participants;
		lyrics = snapshot.val().lyrics;
		album = snapshot.val().album;
		preferrence = snapshot.val().preferrence;
		
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
		};/*
		sound = [document.getElementById("do"),
				document.getElementById("rae"),
				document.getElementById("mi"),
				document.getElementById("fa"),
				document.getElementById("sol"),
				document.getElementById("ra"),
				document.getElementById("si"),
				];
		for(var i = 0; i < sound.length; i++){
			sound[i].addEventListener('canplaythrough', loadedAudio, false);
		};*/
	}).then(function(){
		$("#composeTitle").html(title);
		$("#composeDescription").html("<b>Description: </b>"+description);
		$("#composeParticipants").html("<b>Participants: </b>"+participants);
		$("#composePreferrence").html("<b>Preferrence: </b>"+preferrence);
		$("#composeAlbum").attr("src", album);
		fillScore(100);
	});
};

init();

