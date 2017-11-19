var commentRef;
var commentCount;
var showCount;
var commentList = [];
var initialThreshold = 10;
var commentWindow = 10;

function commentInit(){
	var key = localStorage.getItem("melodize-cur-key");
	if(commentRef != undefined) commentRef.off('child_added');
	commentRef = database.ref("projects/"+key+"/comment");
	commentCount = 0;
	showCount = initialThreshold;
	commentList = [];
	$("#showMore").hide();
	$("#comments").html("");
	$("#commentCount").html(commentCount);
	listenComment();
}

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
		name = safe(id.split("%%%")[0]);
		content = safe($("#commentContent").val());
	}).then(function(){
		commentRef.push({
			name: name,
			profile_pic: profile_pic,
			content: content,
			date: datetime,
		});
		console.log("comment: "+content);
		$("#commentContent").val("");
		$("#commentContent").select();
	})
}

function listenComment(){
	commentRef.on('child_added', function(snapshot){
		var profile_pic = snapshot.val().profile_pic;
		var name = snapshot.val().name;
		var content = snapshot.val().content;
		var date = snapshot.val().date;

		commentList.push({
			profile_pic: profile_pic,
			name: name,
			content: content,
			date: date,
		});
		commentCount++;
		$("#commentCount").html(commentCount);
		if(commentCount <= showCount)
			showComment(commentCount-1)
		else
			$("#showMore").show();
	});
}

function showMore(){
	var old_showCount = showCount;
	showCount += commentWindow;
	if(showCount > commentCount){
		showCount = commentCount;
		$("#showMore").hide();
	}
	for(var i = old_showCount; i < showCount; i++){
		showComment(i);
	}
}

function showComment(index){
	var profile_pic = commentList[index].profile_pic;
	var name = safe(commentList[index].name);
	var date = commentList[index].date;
	var content = safe(commentList[index].content);

	var code = '<div class="comment"><img class="profile-img" src="'+profile_pic+'" onerror="this.src = `./img/default-avatar.jpg`">'+
	           '<div class="comment-box"><div class="comment-id"> '+name+'<comment-date> '+date+'</comment-date></div>'+
	           '<div class="comment-content">'+content+'</div></div></div>';
	$("#comments").append(code);
}

$("#addComment").on('click', function(){
	submitComment();
});

$("#commentContent").keypress(function (e) {
  if (e.which == 13){
  	submitComment();
	return false;
  }
});

$("#showMore").on('click', function(){
	showMore();
	console.log("show more");
})