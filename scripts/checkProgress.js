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
var completeNote;

function increase_brightness(percent){
	var r = 50+Math.floor(percent / 100 * 255 );
	var g = 50+Math.floor(percent / 100 * 255 );
	var b = 50+Math.floor(percent / 100 * 255 );
    return 'rgb('+r+','+g+','+b+')';
}

function fillScore(length){
	var code = "";
    for(var i = 0; i < length; i++){
    	code+=  "<div id='column"+i+"'style='height: 390px; width:50px; display: inline-block'>"+
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

function playSong(start, end){
	var i = start;
	var countdown = setInterval(function(){
		if(playing != true || i == end){
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
	}, 500);
};

$("#playSong").on('click', function(){
	if(playing == false){
		playing = true;
		document.getElementById("playSong").disabled = true;
		playSong(0, length);
	}
});

$("#stopSong").on('click', function(){
	playing = false;
	$("#playSong").prop('disabled', false);
});

function loadedAudio() {
    loaded++;
    console.log(loaded+"/7 loaded");
}

$("#composeAlbum").load(function(){
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainDiv").style.display = "block";
});

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
		preference = safe(snapshot.val().preference);
		length = safe(snapshot.val().length);
		completeNote = safe(snapshot.val().completeNote);
		
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
		$("#composePreference").html("<b>Preference: </b>"+preference);
		$("#composeAlbum").attr("src", album);
		$("#progressBar").attr("value", completeNote);
		$("#progressBar").attr("max", length);
		$("#progressText").html("<b>Progress: </b>"+(completeNote/length*100).toFixed()+"% completed");
		fillScore(length);
	}).then(function(){
		var syllableRef = database.ref("projects/"+key+"/song");
		syllableRef.on('child_added', function(snapshot){
			var index = snapshot.key.split("note")[1];
			var syllable = snapshot.val().syllable;
			var maxSound = snapshot.val().maxSound;
			var maxNum = snapshot.val().maxNum;
			var sound_stat = [snapshot.val().sound0,
							  snapshot.val().sound1,
							  snapshot.val().sound2,
							  snapshot.val().sound3,
                              snapshot.val().sound4,
							  snapshot.val().sound5,
							  snapshot.val().sound6];
			lyric[index] = syllable;
			for(var i = 0; i < 7; i++){
				if(maxSound != -1 && maxNum != 0 && sound_stat[i] != 0)
					$("#note_"+index+"_"+i).css("background-color", increase_brightness((maxNum-sound_stat[i])/maxNum*100));
			}
			if(maxSound != -1){
				$("#note_"+index+"_"+maxSound).css("background-color", "black");
				song[index] = maxSound;
			}
			if(syllable == " ")
				$("#syllable"+index).html("-");
			else
				$("#syllable"+index).html(syllable);

		});
	});
};

init();