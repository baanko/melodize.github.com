var fieldError = document.getElementById("field_msg");

$("#imgURL").change(function(){
	var url = $("#imgURL").val();
	$("#cover-preview").attr("src", url);
});

$("#requestSubmit").click(function(){
	var lyrics = $("#lyrics").val();
	var instrument = document.getElementById("instrument").elements["instrument"].value;
	var album = $("#imgURL").val();
	var title = $("#title").val();
	var description = $("#description").val();
	var preferrence = $("#preferrence").val();
	var setting = document.getElementById("setting").elements["Settings"].value;
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
		var id = localStorage.getItem("id");
		var requestRef = database.ref("projects/");
		database.ref("projects/").once('value', function(snapshot){
			requestRef.push({
				lyrics: lyrics,
				instrument: instrument,
				album: album,
				title: title,
				description: description,
				preferrence: preferrence,
				setting: setting,
				password: password,
				requestDate: datetime,
				requester: id,
				participants: 0,
			});
			window.location.href = "./songInfo.html";
		});
	}
})