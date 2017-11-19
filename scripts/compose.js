var title;
var description;
var participants;
var preference;
var album;
var lyrics;
var syllable = [];
var song = [];
var lyric = [];
var length;
var start = 0;
var end = 10;
var completeNote = 0;
var windowSize = 4;
var othersData = [];

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
			this.style.backgroundColor = "#ffff84";
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
	$("#playSong").attr("disabled", "disabled");
});

$("#submitBtn").on('click', function(){
	var logged_in = localStorage.getItem("id");
	if(!logged_in){
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	    return;
	}
	
	var key = localStorage.getItem("melodize-cur-key");
	var participantNumRef = database.ref("projects/"+key);
	var windowAccu;
	var windowIndex;
	var threshold;
	var nextCompleteNote;
	nextCompleteNote = completeNote + windowSize;
	if(nextCompleteNote > length) nextCompleteNote = length;
	var st = completeNote;
	var ed = completeNote+windowSize;
	participantNumRef.once("value", function(snapshot){
		var participantNum = snapshot.val().participants;
		windowAccu = snapshot.val().windowAccu;
		windowIndex = snapshot.val().windowIndex;
		threshold = snapshot.val().threshold;
		participantNumRef.update({
			participants: participantNum+1,
		});
	}).then(function(){
		for(var i = st; i < ed; i++){
			var songRef;
			var maxNum;
			var maxSound;
			var curSound;
			songRef = database.ref("projects/"+key+"/song/note"+i);
			songRef.once("value", function(snapshot){
				maxNum = snapshot.val().maxNum;
				maxSound = snapshot.val().maxSound;
				curSound = snapshot.val()["sound"+song[i]];
				accumNum = snapshot.val().accumNum;
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
		if(windowAccu >= threshold){
			participantNumRef.update({
				windowAccu: 0,
				windowIndex: windowIndex+1,
				completeNote: nextCompleteNote,
			});
		}
		else{
			participantNumRef.update({
				windowAccu: windowAccu+1,
			});		
		}
		var id = localStorage.getItem("id");
		var contributionRef = database.ref("user/accounts/"+id+"/"+title);
		contributionRef.update({
			windowIndex: windowIndex,
		});

		alert("Submitted!");
		window.location.href = "./songInfo.html";
	});
});

$("#composeAlbum").load(function(){
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainDiv").style.display = "block";
  $("#score").animate({ scrollLeft: 50*(completeNote - windowSize*2) }, 'slow');
});

function init(){
	pageCritical = true;

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
				for(var j = 0; j < maxNote; j++){
					$("#note_"+index+"_"+j).removeClass("note");
					$("#note_"+index+"_"+j).addClass("completeNote");
				}
			}
			else if(completeNote+windowSize <= index){
				for(var j = 0; j < maxNote; j++){
					$("#note_"+index+"_"+j).removeClass("note");
					$("#note_"+index+"_"+j).addClass("completeNote");
				}
			}
			else{
				othersData.push([snapshot.val().sound0,
								 snapshot.val().sound1,
								 snapshot.val().sound2,
								 snapshot.val().sound3,
								 snapshot.val().sound4,
								 snapshot.val().sound5,
								 snapshot.val().sound6,
								 snapshot.val().maxNum,
								 snapshot.val().maxSound]);
			}
		});
		slidebarInit();
		$("#infoBoard").attr("src", album);
	});
};

function increase_brightness(percent){
	var r = 50+Math.floor(percent / 100 * 255 );
	var g = 50+Math.floor(percent / 100 * 255 );
	var b = 50+Math.floor(percent / 100 * 255 );
    return 'rgb('+r+','+g+','+b+')';
}

function distribution(){
	for(var j = 0; j < windowSize; j++){
		for(var i = 0; i < maxNote; i++){
			var maxNum = othersData[j][maxNote];
			var maxSound = othersData[j][maxNote+1]
			var curSound = othersData[j][i]
			if(maxSound != -1 && maxNum != 0 && curSound != 0)
			$("#note_"+(completeNote+j)+"_"+i).css("background-color", increase_brightness((maxNum-curSound)/maxNum*100));
		}
	}
};

$("#distributionBtn").on('click', function(){
	distribution();
});

init();

