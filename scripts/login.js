var modal = document.getElementById('loginModal');
var loginTab = document.getElementById("loginTab");
var close = document.getElementsByClassName("close")[0];
var loginBtn = document.getElementById("loginBtn");
var warning = document.getElementById("warning_msg");

var logged_in = localStorage.getItem("id");

$(document).ready(function(){
	if(logged_in)
		$("#loginTab").text("Logout");
});

loginTab.onclick = function() {
	logged_in = localStorage.getItem("id");
	if(!logged_in){
	    $("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	}
    else{
		localStorage.removeItem("id");
		$("#loginTab").text("Login");
	}
}

close.onclick = function() {
    modal.style.display = "none";
}

loginBtn.onclick = function(){
	var id = $("#id").val();
	var pw = $("#pw").val();
	
	if(id=="hi"){
		localStorage.setItem("id", id);
		$("#loginTab").text("Logout");
		modal.style.display = "none";
	}
	else{
		$("#id").val("");
		$("#pw").val("");
		warning.style.display = "inline";
	}
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}