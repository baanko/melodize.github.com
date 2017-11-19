var title;
var description;
var participants;
var preference;
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
var completeNote = 0;
var timeInterval = 500;
var windowSize = 4;

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
	if(!selecting){
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
	}
});

function playSong(start, end){
	if(start > end){
		var temp = start;
		start = end;
		end = temp;
	}
	var i = start;
	  $("#score").animate({ scrollLeft: 50*start }, 'fast');
	var countdown = setInterval(function(){
		if(playing != true || i == end){
			clearInterval(countdown);
			playing = false;
			document.getElementById("playSong").disabled = false;
			$("#column"+(i-1)).removeClass("currCol");
			$("#column"+(i-1)).addClass("selectedNote");
		}
		else{
			if(start < i){
				$("#column"+(i-1)).removeClass("currCol");
				$("#column"+(i-1)).addClass("selectedNote");
			}
			$("#column"+i).removeClass("selectedNote");
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
		playSong(start, end);
	}
});

$("#stopSong").on('click', function(){
	playing = false;
	$("#playSong").prop('disabled', false);
});

function loadedAudio() {
    loaded++;
    if(loaded == 7)
    	$("#playSong").prop('disabled', false);
    console.log(loaded+"/7 loaded");
}

$("#composeAlbum").load(function(){
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainDiv").style.display = "block";
});

function init(){
	var key = localStorage.getItem("melodize-cur-key");
	var songRef = database.ref("projects/"+key);
	songRef.once("value", function(snapshot){
		title = safe(snapshot.val().title);
		description = safe(snapshot.val().description);
		instrument = safe(snapshot.val().instrument);
		participants = safe(snapshot.val().participants);
		lyrics = safe(snapshot.val().lyrics);
		album = snapshot.val().album;
		preference = safe(snapshot.val().preference);
		length = snapshot.val().length;
		completeNote = snapshot.val().completeNote;
	}).then(function(){
		if(instrument == "piano"){
		sound = [new Audio("./sounds/piano/do.wav"),
			    new Audio("./sounds/piano/rae.wav"),
				new Audio("./sounds/piano/mi.wav"),
			    new Audio("./sounds/piano/fa.wav"),
			    new Audio("./sounds/piano/sol.wav"),
			    new Audio("./sounds/piano/ra.wav"),
			    new Audio("./sounds/piano/si.wav"),];
		}else if(instrument == "violin"){
		sound = [new Audio("./sounds/violin/do.mp3"),
			    new Audio("./sounds/violin/rae.mp3"),
				new Audio("./sounds/violin/mi.mp3"),
			    new Audio("./sounds/violin/fa.mp3"),
			    new Audio("./sounds/violin/sol.mp3"),
			    new Audio("./sounds/violin/ra.mp3"),
			    new Audio("./sounds/violin/si.mp3"),];
		//timeInterval = 700;
		}
		for(var i = 0; i < sound.length; i++){
			sound[i].preload = "auto";
			sound[i].addEventListener('canplaythrough', loadedAudio, false);
		};

	}).then(function(){
		$("#composeTitle").html(title);
		$("#composeDescription").html("<b>Description: </b>"+description);
		$("#composeParticipants").html("<b>Participants: </b>"+participants);
		$("#composePreference").html("<b>Preference: </b>"+preference);
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
			if(index < completeNote){
				var maxSound = snapshot.val().maxSound;
				if(maxSound > -1){
					$("#note_"+index+"_"+maxSound).css("background-color", "black");
					song[index] = maxSound;
				}
			}
		});
		slidebarInit();
		commentInit();
	});
};

var phase = 0;
var selecting = false;
var offset = $("#score").offset();
var myCanvas = document.getElementById("myCanvas");
var outerScoreArea = document.getElementById("outer_score");

$("#rangeBtn").on("click", function(){
	playing = true;
	selecting = true;
	myCanvas.style.display = "";
});

outerScoreArea.addEventListener("mousemove", function(event){
	if(selecting){
	    var left = event.clientX;
	    myCanvas.style.left = (left-40)+"px";
	    //console.log(left);
	}
}, false);

outerScoreArea.addEventListener("click", function(event){
	if(selecting){
		var left = event.pageX + $("#score").scrollLeft();
		if(phase == 0){
			for(var i = start; i < end; i++){
				$("#column"+i).removeClass("selectedNote");
			}
			start = Math.ceil(left/50)-2;
			phase++;
		}
		else{
			end = Math.ceil(left/50)-1;
			phase = 0;
			for(var i = start; i < end; i++){
				$("#column"+i).addClass("selectedNote");
			}
			//console.log("done");
			selecting = false;
			playing = false;
			myCanvas.style.display = "none";
		}
		//console.log(Math.ceil(left/50)-1);
	}
}, false);

function slidebarInit(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 410);
	ctx.lineWidth = 45;
	ctx.strokeStyle = "red";
	ctx.stroke();
	for(var i = start; i < end; i++){
		$("#column"+i).addClass("selectedNote");
	}
};

init();
