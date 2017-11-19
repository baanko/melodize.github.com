var sound = {};
var maxNote = 7;
var playing = false;
var timeInterval = 500;
var curInstrument;

function sound_init(){
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

function loadedAudio() {
    loaded++;
    if(loaded == maxNote*2)
    	$("#playSong").prop('disabled', false);
    console.log(loaded+"/"+(maxNote*2)+" loaded");
}

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