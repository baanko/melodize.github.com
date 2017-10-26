var title;
var description;
var participants;
var preferrence;
var album;
var lyrics;
var instrument;
var sound = [new Audio("./sounds/do.wav"),
			 new Audio("./sounds/rae.wav"),
			 new Audio("./sounds/mi.wav"),
			 new Audio("./sounds/fa.wav"),
			 new Audio("./sounds/sol.wav"),
			 new Audio("./sounds/ra.wav"),
			 new Audio("./sounds/si.wav"),
			];
var song = [];
var start = 0;
var end = 10;
var playing = false;

function fillScore(length){
	var code = "";
    for(var i = 0; i < length; i++){
    	code+=  "<div id='column"+i+"'style='border: 1px solid; height: 300px; width:50px; display: inline-block'>"+
    				"<div id='note' x_cor='"+i+"' y_cor= '5' style='border: 1px solid; height: 50px; width: 50px'></div>"+
            		"<div id='note' x_cor='"+i+"' y_cor= '4' style='border: 1px solid; height: 50px; width: 50px'></div>"+
            		"<div id='note' x_cor='"+i+"' y_cor= '3' style='border: 1px solid; height: 50px; width: 50px'></div>"+
            		"<div id='note' x_cor='"+i+"' y_cor= '2' style='border: 1px solid; height: 50px; width: 50px'></div>"+
           			"<div id='note' x_cor='"+i+"' y_cor= '1' style='border: 1px solid; height: 50px; width: 50px'></div>"+
            		"<div id='note' x_cor='"+i+"' y_cor= '0' style='border: 1px solid; height: 50px; width: 50px'></div>"+
          		"</div>";
    }
	$("#score").html(code);
}

$(document).on('click', '#note', function(){
	var x_cor = this.getAttribute("x_cor");
	var y_cor = this.getAttribute("y_cor");
	this.style.backgroundColor = "black";
	var note = sound[y_cor].cloneNode();
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
			if(song[i] == undefined){
				i++;
				return;
			}
			var note = sound[song[i]].cloneNode();
			note.play();
			note.remove();
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
	}).then(function(){
		$("#composeTitle").html(title);
		$("#composeDescription").html("<b>Description: </b>"+description);
		$("#composeParticipants").html("<b>Participants: </b>"+participants);
		$("#composePreferrence").html("<b>Preferrence: </b>"+preferrence);
		$("#composeAlbum").attr("src", album);
	});
};

init();
fillScore(100);