var config={
	apiKey: "AIzaSyAoupKkkppZXzP4aw034529f7qCk_v7v3Q",
	databaseURL: "https://melodize-c68af.firebaseio.com",
}
firebase.initializeApp(config);
var database = firebase.database();
var userRef = database.ref("user");

var modal = document.getElementById('loginModal');
var loginTab = document.getElementById("loginTab");
var close = document.getElementsByClassName("close")[0];
var loginBtn = document.getElementById("loginBtn");
var warning = document.getElementById("warning_msg");
var profileTab = document.getElementById("profileTab");

var logged_in = localStorage.getItem("id");
var pageAfterLogin = "";

$(document).ready(function(){
	if(logged_in){
		$("#loginTab").text("Sign Out");
		profileTab.style.display = "";
	}
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
		$("#loginTab").text("Sign In");
		profileTab.style.display = "none";
	}
}

close.onclick = function() {
    modal.style.display = "none";
   	$("#id").val("");
	$("#pw").val("");
	pageAfterLogin = "";
}

loginBtn.onclick = function(){
	login();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        pageAfterLogin = "";
    }
}

function login(){
	var id = $("#id").val();
	var pw = $("#pw").val();
	
	database.ref("user/accounts/"+id+"%%%"+pw).once('value', function(snapshot){
		if(snapshot.val() != undefined){
			localStorage.setItem("id", id);
			$("#loginTab").text("Sign Out");
			profileTab.style.display = "";
			modal.style.display = "none";
			if(pageAfterLogin != "") window.location.href = pageAfterLogin;
		}
		else{
			$("#pw").select();
			warning.style.display = "";
		}
	});
};