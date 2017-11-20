var projectRef = database.ref("projects");
var totalSongs = 0;
var songList = [];
var songList_initialThreshold = 10;
var songList_showCount = songList_initialThreshold;
var songList_window = 10;

$("#requesterBtn").on('click', function() {
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
})

$("#workerBtn").on('click', function() {
	window.location.href = "./songInfo.html";
})

$("#listBtn").on('click', function() {
	window.location.href = "./songInfo.html";
})

$("#learnBtn").on('click', function() {
	$('html, body').animate({ scrollTop: $('#learnStart').offset().top }, 'slow');
})

$("#signUpBtn").on('click', function() {
	window.location.href = "./signup.html";
})

$("#galleryBtn").on('click', function() {
	window.location.href = "./gallery.html";
})

function addToList(title, album, participants, private, key){
	var str = "<div id='songEntry' class='homeEntry' name='"+title+"' key='"+key+"' participants="+participants+">"+
			"<img class='homeImage' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
			"<div class='homeDetail'><div class='homeName'>"+title+"</div>"+
			"<div style='color: gray'>Participants: <statNum>"+participants+"</statNum></div>";
	str += "</div></div>";
	$("#songList").append(str);
	return document.getElementById("songList").lastChild;
}

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	songList.push({
		title: safe(snapshot.val().title),
		album: snapshot.val().album,
		participants: safe(snapshot.val().participants),
		private: safe(snapshot.val().setting),
		key: key,
	});
	totalSongs++;
	$("#totalSongs").html(totalSongs);
	if(totalSongs <= songList_showCount){
		showSongs(totalSongs-1);
	}
	else
		$("#songList-showMore").show();
});

function songList_showMore(){
	var old_showCount = songList_showCount;
	songList_showCount += songList_window;
	if(songList_showCount > totalSongs){
		showCount = totalSongs;
		$("#songList-showMore").hide();
	}
	for(var i = old_showCount; i < totalSongs; i++){
		showSongs(i);
	}
}

function showSongs(index){
	var title = songList[index].title;
	var album = songList[index].album;
	var participants = songList[index].participants;
	var private = songList[index].private;
	var key = songList[index].key;

	addToList(title, album, participants, private, key);
	sort("participants", "down");
}

$("#songList-showMore").on('click', function(){
	songList_showMore();
})

function sort(key, order){
	if(order == "up"){
		$('.homeEntry').sortElements(function(a, b){
			if(key == "participants")
				return eval($(a).attr(key)) > eval($(b).attr(key)) ? 1 : -1;
			else
		  		return $(a).attr(key) > $(b).attr(key) ? 1 : -1;
		});
	}
	else{
		$('.homeEntry').sortElements(function(b, a){
			if(key == "participants")
				return eval($(a).attr(key)) > eval($(b).attr(key)) ? 1 : -1;
			else
		    	return $(a).attr(key) > $(b).attr(key) ? 1 : -1;
		});
	}
}

$("#sortingSelect").change(function(){
	var sorting = eval($("#sortingSelect").val());

	switch(sorting){
		case 0:
			sort("name", "up");
			break;
		case 1:
			sort("name", "down");
			break;
		case 2:
			sort("participants", "down");
			break;
		case 3: 
			sort("participants", "up");
			break;
		default:
	}
});

function init(){
	$("#songList-showMore").hide();
}

init();