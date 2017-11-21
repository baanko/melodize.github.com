var title;
var description;
var participants;
var preference;
var album;
var lyrics;
var syllable = [];
var song = [];
var lyric = [];
var start = 0;
var end = 10;
var length;
var completeNote = 0;
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
	if(!selecting && !playing){
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

$("#playSong").on('click', function(){
	if(playing == false){
		playing = true;
		$("#playSong").attr("disabled", "disabled");
		$("#rangeBtn").attr("disabled", "disabled");
		playSong(start, end);
	}
});

$("#stopSong").on('click', function(){
	playing = false;
	$("#playSong").removeAttr("disabled");
});

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
		curInstrument = safe(snapshot.val().instrument);
		participants = safe(snapshot.val().participants);
		lyrics = safe(snapshot.val().lyrics);
		album = snapshot.val().album;
		preference = safe(snapshot.val().preference);
		length = snapshot.val().length;
		completeNote = snapshot.val().completeNote;
	}).then(function(){
		sound_init([curInstrument,]);
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

init();
