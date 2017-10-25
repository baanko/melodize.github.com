var projectRef = database.ref("projects");
var requestNum = 0;

function addToRequests(title, album, participants, private, key){
	var str = 	"<div id='songEntry' name='"+title+"' key='"+key+"' style='border: 1px solid; width: 100%; height: 100px;'>"+
				"<img style='float: left; object-fit: cover; height: 90px; width: 90px' onerror='this.src =`./img/default-cover-art.png`' src="+album+">"+
				"<div style='padding: 5px; float: left; width: 50%; height: 100px; overflow: hidden'><div style='font-size: 18px;'>"+title+"</div>"+
				"<button class='btn btn-success'>Check Progress</button></div></div>";
	$("#myRequests").append(str);
}

function init(){
	var id = localStorage.getItem("id");
	pageCritical = true;
	database.ref("user/accounts/"+id).once('value', function(snapshot){
		$("#profileScore").html("<b>Score:</b> "+snapshot.val().score+" pt");
		$("#profilePic").attr("src", snapshot.val().profilePic);
	});
}

projectRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	var id = localStorage.getItem("id");
	if(value.requester == id)
		addToRequests(value.title, value.album, value.participants, value.setting, key);
	requestNum++;
	$("#profileRequestNum").html("<b>Requests:</b> "+requestNum+" songs");
});

$("#profileId").html(localStorage.getItem("id").split("%%%")[0]);
init();

