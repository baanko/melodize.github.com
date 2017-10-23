var joinBtn = document.getElementById("joinBtn");

function changeInfo(title, description, instrument, participants, lyrics, album, preferrence, private){
	$("#titleInfo").html(title);
	$("#descriptionInfo").html(description);
	$("#instrumentInfo").html("<b>Instrument:</b> "+instrument);
	$("#participantsInfo").html("<b>No. of participants:</b> "+participants);
	$("#lyricBox").html(lyrics.replace(/\n/g, "<br>"));
	$("#albumCover").attr("src", album);
	$("#preferrenceInfo").html("<b>Requester's remark:</b> "+preferrence);
	if(private) $("#joinBtn").html("<i style='font-size: 100%' class='material-icons'>lock</i> Join");
	else $("#joinBtn").html("Join");
}

function addToList(title, album, participants, private){
	var str = 	"<div id='songEntry' name='"+title+"'style='border: 1px solid; width: 100%; height: 100px;'>"+
				"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div style='padding: 5px; float: left'><div style='font-size: 18px;'>"+title+"</div>"+
				"<div style='color: gray'>Participants: "+participants+"</div>"
	if(private)
		str += "<i class='material-icons'>lock</i>";
	str += "</div></div>";
	$("#songList").append(str);
}

$(document).on('click', '#songEntry', function(){
	alert(this.getAttribute("name"));
});

joinBtn.onclick = function(){
	var id = localStorage.getItem("id");
	logged_in = localStorage.getItem("id");
	if(logged_in)
		window.location.href = "./compose.html";
	else{
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	    pageAfterLogin = "./compose.html";
	}
}


changeInfo("The Coast", 
			"This is the description part. This is the description part. This is the description part. This is the description part. ", 
			"piano", 
			1000, 
			"Lighthouses and seashells,\nAlong a salty coast.\nA whisper of wind,\nCarries kites to fly with birds.\nSurfers ride the waves,\nLike a kid with a new bike.\n\nWhile castles built for kings,\nWait for high tide.\nAlong the endless shoreline,\nWe will watch the boats.\nSomeday we will live along our friend,\nThe coast.",
			"https://spark.adobe.com/images/landing/examples/design-music-album-cover.jpg", 
			"bright", 
			true);

for(var i = 0; i < 10; i++){
	addToList("The Coast", "https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider1.jpg", 100, true);
}