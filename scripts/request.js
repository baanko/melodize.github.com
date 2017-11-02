var fieldError = document.getElementById("field_msg");

$("#imgURL").change(function(){
	var url = $("#imgURL").val();
	$("#cover-preview").attr("src", url);
});

$("#requestSubmit").click(function(){
	var logged_in = localStorage.getItem("id");
	if(!logged_in){
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	    return;
	}

	var lyrics = safe($("#lyrics").val());
	var instrument = safe(document.getElementById("instrument").elements["instrument"].value);
	var album = $("#imgURL").val();
	var title = safe($("#title").val());
	var description = safe($("#description").val());
	var preference = safe($("#preference").val());
	var setting = safe(document.getElementById("setting").elements["Settings"].value);
	var password = $("#privatePW").val();
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
    				+ (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();

	if(lyrics == "")
		$("#lyricsFeedback").attr("class", "col-sm-4 form-group has-error has-feedback");
	else $("#lyricsFeedback").attr("class", "col-sm-4");
	if(title == "")
		$("#titleFeedback").attr("class", "form-group has-error has-feedback");
	else $("#titleFeedback").attr("class", "");
	if(description == "")
		$("#descriptionFeedback").attr("class", "form-group has-error has-feedback");
	else $("#descriptionFeedback").attr("class", "");
	if(setting == "private" && password == "")
		$("#settingFeedback").attr("class", "form-group has-error has-feedback");
	else $("#settingFeedback").attr("class", "");

	if(lyrics == "" || title == "" || description == "" || (setting == "private" && password == "")){
		fieldError.style.display = "";
	}
	else{
		logged_in = localStorage.getItem("id");
		if(logged_in){
			var id = localStorage.getItem("id");
			var requestRef = database.ref("projects/");
			var lyric = lyrics.replace(/\n/g, " ").split("");
			var key;
			if(setting == "public") password = "";
			database.ref("projects/").once('value', function(snapshot){
				key = requestRef.push({
					lyrics: lyrics,
					instrument: instrument,
					album: album,
					title: title,
					description: description,
					preference: preference,
					setting: setting,
					password: password,
					requestDate: datetime,
					requester: id,
					participants: 0,
					length: lyric.length,
					completeNote: 0,
					threshold: 5,
					windowIndex: 0,
					windowAccu: 0,
				}).key;
			}).then(function(){
				var noteRef;
				for(var j = 0; j < lyric.length; j++){
					noteRef = database.ref("projects/"+key+"/song/note"+j);
					noteRef.set({
						maxNum: 0,
						accumNum: 0,
						maxSound: -1,
						soundNone: 0,
						sound0: 0,
						sound1: 0,
						sound2: 0,
						sound3: 0,
						sound4: 0,
						sound5: 0,
						sound6: 0,
						syllable: lyric[j],
					});
				}
			}).then(function(){
				alert("Successfully submitted!");
				window.location.href = "./profile.html";
			});
		}
		else{
			$("#id").val("");
			$("#pw").val("");
		    warning.style.display = "none";
		    modal.style.display = "block";
		    $("#id").select();
		}
	}
});

function init(){
	pageCritical = true;
};

init();