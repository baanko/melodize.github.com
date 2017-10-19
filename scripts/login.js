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

$("#loginModal").keypress(function (e) {
  if (e.which == 13) {
  	login();
	return false;
  }
});

loginTab.onclick = function() {
	logged_in = localStorage.getItem("id");
	if(!logged_in){
	    $("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	}
    else{
		localStorage.removeItem("id");
		$("#loginTab").text("Login");
	}
}

close.onclick = function() {
    modal.style.display = "none";
   	$("#id").val("");
	$("#pw").val("");
}

loginBtn.onclick = function(){
	login();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function login(){
	var id = $("#id").val();
	var pw = $("#pw").val();
	
	if(id_check(id, pw)){
		localStorage.setItem("id", id);
		$("#loginTab").text("Logout");
		modal.style.display = "none";
	}
	else{
		$("#pw").select();
		warning.style.display = "";
	}
};

function id_check(id, pw){
	if(id == "hi"){
		return true;
	}
	return false;
};