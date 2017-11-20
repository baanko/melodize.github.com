var request = document.getElementById('requesterBtn');
var work = document.getElementById('workerBtn');

request.onclick = function() {
	logged_in = localStorage.getItem("id");
	if(logged_in)
		window.location.href = "./request.html";
	else{
		$("#id").val("");
		$("#pw").val("");
	   	$('#warning_msg').hide();
	    $('#loginModal').show();
	    $("#id").select();
	    pageAfterLogin = "./request.html";
	}
}

work.onclick = function() {
	window.location.href = "./songInfo.html";
}

function init(){
	$("#songList-showMore").hide();
}

init();