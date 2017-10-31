var songs = [];
var projectRef = database.ref("projects");

function addSong(title, participants, album){
	var song = 	'<div class="outBox">'+
	        		'<div class="inBox">'+
	          			'<div class="imgFrame">'+
	            			'<img onerror="this.src =`./img/default-cover-art.png`" src="'+album+'">'+
	          			'</div>'+
	          			'<div>'+title+'</div>'+
	          			'<div>Participants: '+participants+'</div>'+
	          			'<button class="btn btn-default">Play</button>'+
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
	}
});
