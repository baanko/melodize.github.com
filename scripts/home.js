var request = document.getElementById('requesterBtn');
var work = document.getElementById('workerBtn');

request.onclick = function() {
	logged_in = localStorage.getItem("id");
	if(logged_in)
		window.location.href = "./request.html";
	else{
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	    pageAfterLogin = "./request.html";
	}
}

work.onclick = function() {
	window.location.href = "./songInfo.html";
}