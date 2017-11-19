var sound = {};
var maxNote = 7;
var playing = false;
var timeInterval = 500;
var curInstrument;
var loaded = 0;
var instumentNum = 0;

function sound_init(instruments){
	if(instruments.includes("piano")){
		instumentNum++;
		sound["piano"] = [new Audio("./sounds/piano/do.wav"),
			    	new Audio("./sounds/piano/rae.wav"),
					new Audio("./sounds/piano/mi.wav"),
			    	new Audio("./sounds/piano/fa.wav"),
			    	new Audio("./sounds/piano/sol.wav"),
			    	new Audio("./sounds/piano/ra.wav"),
			    	new Audio("./sounds/piano/si.wav"),];
		for(var i = 0; i < maxNote; i++){
			sound["piano"][i].preload = "auto";
			sound["piano"][i].addEventListener('canplaythrough', loadedAudio, false);
		}
	}
	if(instruments.includes("violin")){
		instumentNum++;
		sound["violin"] = [new Audio("./sounds/violin/do.mp3"),
			    	new Audio("./sounds/violin/rae.mp3"),
					new Audio("./sounds/violin/mi.mp3"),
			    	new Audio("./sounds/violin/fa.mp3"),
			    	new Audio("./sounds/violin/sol.mp3"),
			    	new Audio("./sounds/violin/ra.mp3"),
			    	new Audio("./sounds/violin/si.mp3"),];
		for(var i = 0; i < maxNote; i++){
			sound["violin"][i].preload = "auto";
			sound["violin"][i].addEventListener('canplaythrough', loadedAudio, false);
		};
	}
}

function loadedAudio() {
    loaded++;
    if(loaded == maxNote*instumentNum)
    	$("#playSong").prop('disabled', false);
    console.log(loaded+"/"+(maxNote*instumentNum)+" loaded");
}

function playPreview(start, end){
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
			$("#playSong").removeAttr("disabled");
			$("#rangeBtn").removeAttr("disabled");
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
				var note = sound[curInstrument][song[i]].cloneNode(true);
				note.play();
				note.remove();
			}
		}
		i++;
	}, timeInterval);
};