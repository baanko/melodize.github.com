var config={
	apiKey: "AIzaSyAoupKkkppZXzP4aw034529f7qCk_v7v3Q",
	databaseURL: "https://melodize-c68af.firebaseio.com",
}
firebase.initializeApp(config);
var database = firebase.database();
var userRef = database.ref("user");

var close = document.getElementsByClassName("close")[0];

var logged_in = localStorage.getItem("id");
var pageAfterLogin = "";	//if this has any url value, an user will be moved to that url after he signs in
var pageCritical = false;	//if this is true, an user will be forced to move to the index page if he signs out
var pageReload = false;

$(document).ready(function(){
	if(logged_in){
		$("#loginTab").text("Sign Out");
		$("#profileTab").show();
	}
});

$("#loginModal").keypress(function (e) {
  if (e.which == 13){
  	login();
	return false;
  }
});

$("#loginTab").on('click', function(){
	logged_in = localStorage.getItem("id");
	if(!logged_in){
	    $("#id").val("");
		$("#pw").val("");
		$('#warning_msg').hide();
	    $('#loginModal').show();
	    $("#id").select();
	}
    else{
		localStorage.removeItem("id");
		$("#loginTab").text("Sign In");
		$("#profileTab").hide();
		if(pageCritical) window.location.href = "./index.html";
		else if(pageReload) location.reload();
	}
})

close.onclick = function() {
    $('#loginModal').hide();
   	$("#id").val("");
	$("#pw").val("");
	pageAfterLogin = "";
}

$("#loginBtn").on('click', function(){
	login();
})

window.onclick = function(event) {
    if (event.target == document.getElementById('loginModal')) {
        $('#loginModal').hide();
        pageAfterLogin = "";
    }
}

function login(){
	var id = $("#id").val();
	var pw = $("#pw").val();
	
	database.ref("user/accounts/"+id+"%%%"+pw).once('value', function(snapshot){
		if(snapshot.val() != undefined){
			localStorage.setItem("id", id+"%%%"+pw);
			$("#loginTab").text("Sign Out");
			$("#profileTab").hide();
			$('#loginModal').hide();
			if(pageAfterLogin != "") window.location.href = pageAfterLogin;
			else if(pageReload) location.reload();
		}
		else{
			$("#pw").select();
			$('#warning_msg').show();
		}
	});
};

function safe(str){
	if((typeof str) == "string")
		return str.replace(/[</>]/g, "");
	return str;
};

function sendFeedback(feed){
	var feedbackRef = database.ref("user/feeedback");
	feedbackRef.push({
		opinion: feed,
	});
	console.log("sent!");
};