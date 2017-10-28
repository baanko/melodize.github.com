var joinBtn = document.getElementById("joinBtn");
var passwordModal = document.getElementById('passwordModal');
var paasswordError = document.getElementById('incorrect_msg');
var passwordClose = document.getElementById("close");
var paasswordBtn = document.getElementById('passwordBtn');
var projectRef = database.ref("projects");

function changeInfo(title, description, instrument, participants, lyrics, album, preferrence, setting, password){
	$("#titleInfo").html(title);
	$("#descriptionInfo").html(description);
	$("#instrumentInfo").html("<b>Instrument:</b> "+instrument);
	$("#participantsInfo").html("<b>No. of participants:</b> "+participants);
	$("#lyricBox").html(lyrics.replace(/\n/g, "<br>"));
	$("#albumCover").attr("src", album);
	$("#preferrenceInfo").html("<b>Requester's remark:</b> "+preferrence);
	if(setting == "private"){
		$("#joinBtn").html("<i style='font-size: 100%' class='material-icons'>lock</i> Join");
		localStorage.setItem("songPassword", password)
	}
	else{
		$("#joinBtn").html("Join");
		localStorage.setItem("songPassword", "")
	}
}

function addToList(title, album, participants, private, key){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' style='border-bottom: 0.5px solid; padding: 4px; border-color: #b1b1b1; width: 100%; height: 100px;'>"+
				"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div style='padding: 5px; float: left; width: 50%; height: 100px; overflow: hidden'><div style='font-size: 18px;'>"+title+"</div>"+
				"<div style='color: gray'>Participants: "+participants+"</div>"
	if(private == "private")
		str += "<i class='material-icons'>lock</i>";
	str += "</div></div>";
	$("#songList").append(str);
}

$(document).on('click', '#songEntry', function(){
	var key = this.getAttribute("key");
	var songRef = database.ref("projects/"+key);
	songRef.once("value", function(snapshot){
		changeInfo(snapshot.val().title,
				   snapshot.val().description,
				   snapshot.val().instrument,
				   snapshot.val().participants,
				   snapshot.val().lyrics,
				   snapshot.val().album,
				   snapshot.val().preferrence,
				   snapshot.val().setting,
				   snapshot.val().password);
	});
	localStorage.setItem("melodize-cur-key", key);
	$('html, body').animate({ scrollTop: 0 }, 'fast');
});

joinBtn.onclick = function(){
	var id = localStorage.getItem("id");
	logged_in = localStorage.getItem("id");
	var key = this.getAttribute("key");
	var password = localStorage.getItem("songPassword");
	if(logged_in){
		if(password == "")
			window.location.href = "./compose.html";
		else{
			passwordModal.style.display = "block";
		}
	}
	else{
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	}
}

passwordBtn.onclick = function(){
	var passwordGiven = $("#privatePw").val();
	var password = localStorage.getItem("songPassword");
	if(password == passwordGiven)
		window.location.href = "./compose.html";
	else
		paasswordError.style.display = "block";
}

passwordClose.onclick = function() {
    passwordModal.style.display = "none";
}

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	addToList(value.title, value.album, value.participants, value.setting, key);
});

projectRef.once('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	changeInfo(snapshot.val().title,
	   snapshot.val().description,
	   snapshot.val().instrument,
	   snapshot.val().participants,
	   snapshot.val().lyrics,
	   snapshot.val().album,
	   snapshot.val().preferrence,
	   snapshot.val().setting,
	   snapshot.val().password);
	localStorage.setItem("melodize-cur-key", key);
});
