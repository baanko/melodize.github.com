var songs = [];
var projectRef = database.ref("projects");
var completedNum = 0;

function addSong(title, participants, album){
	var song = 	'<div class="outBox">'+
	        		'<div class="inBox">'+
	          			'<div class="imgFrame">'+
	            			'<img onerror="this.src =`./img/default-cover-art.png`" src="'+album+'">'+
	          			'</div>'+
	          			'<div style="font-size: 18px">'+title+'</div>'+
	          			'<div>Participants: '+participants+'</div>'+
	          			'<button class="btn btn-default">Play</button> '+
	          			'<button class="btn btn-default">Stop</button>'+
	        		'</div>'+
	      		'</div>'
	$("#board").append(song);
}

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value.completeNote == value.length){
		var title = value.title;
		var participants = value.participants;
		var album = value.album;
		addSong(title, participants, album);
		completedNum++;
		$("#completed").html(completedNum+" songs");
	}
});
