var title;
var description;
var participants;
var preferrence;
var album;
var lyrics;
var instrument;

function fillScore(length){
	var code = "";
    for(var i = 0; i < length; i++){
    	code+=  "<div style='border: 1px solid; height: 300px; width:50px; display: inline-block'>"+
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
	console.log(x_cor+" "+y_cor);
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