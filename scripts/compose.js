var title;
var description;
var participants;
var preferrence;
var album;
var lyrics;
var instrument;

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