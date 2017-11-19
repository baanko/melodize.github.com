function addComment(){
	var logged_in = localStorage.getItem("id");
	if(!logged_in){
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	    return;
	}
	var id = localStorage.getItem("id");
	var profileRef = database.ref("user/accounts/"+id);
	var profile_pic;
	var name;
	var content;
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
    				+ (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes();
	profileRef.once('value', function(snapshot){
		profile_pic = snapshot.val().profilePic;
		name = id.split("%%%")[0];
		content = content = $("#commentContent").val();
	}).then(function(){
		var code = '<div class="comment"><img class="profile-img" src="'+profile_pic+'" onerror="this.src = `./img/default-avatar.jpg`">'+
	                '<div class="comment-box"><div class="comment-id"> '+name+'<comment-date> '+datetime+'</comment-date></div>'+
	                '<div class="comment-content">'+content+'</div></div></div>';
		$("#comments").append(code);
		$("#commentContent").val("");
		//$('html, body').animate({ scrollTop: document.body.scrollHeight }, 'fast');
	})
	$("#commentContent").select();

};

function submitComment(){
	var logged_in = localStorage.getItem("id");
	if(!logged_in){
		$("#id").val("");
		$("#pw").val("");
	    warning.style.display = "none";
	    modal.style.display = "block";
	    $("#id").select();
	    return;
	}
	var id = localStorage.getItem("id");
	var key = localStorage.getItem("melodize-cur-key");
	var profileRef = database.ref("user/accounts/"+id);
	var profile_pic;
	var name;
	var content;
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
    				+ (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes();
	profileRef.once('value', function(snapshot){
		profile_pic = snapshot.val().profilePic;
		name = id.split("%%%")[0];
		content = content = $("#commentContent").val();
	}).then(function(){
		

	})
	$("#commentContent").val("");
	$("#commentContent").select();
}

$("#addComment").on('click', function(){
	addComment();
});

$("#commentContent").keypress(function (e) {
  if (e.which == 13){
  	addComment();
	return false;
  }
});