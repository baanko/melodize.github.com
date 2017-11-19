var phase = 0;
var selecting = false;
var offset = $("#score").offset();
var myCanvas = document.getElementById("myCanvas");
var outerScoreArea = document.getElementById("outer_score");

$("#rangeBtn").on("click", function(){
	playing = true;
	selecting = true;
	myCanvas.style.display = "";
	$("#playSong").attr("disabled", "disabled");
	$("#rangeBtn").attr("disabled", "disabled");
});

outerScoreArea.addEventListener("mousemove", function(event){
	if(selecting){
	    var left = event.clientX;
	    myCanvas.style.left = (left-40)+"px";
	    //console.log(left);
	}
}, false);

outerScoreArea.addEventListener("click", function(event){
	if(selecting){
		var left = event.pageX + $("#score").scrollLeft();
		if(phase == 0){
			for(var i = start; i < end; i++){
				$("#column"+i).removeClass("selectedNote");
			}
			start = Math.ceil(left/50)-2;
			phase++;
		}
		else{
			end = Math.ceil(left/50)-1;
			phase = 0;
			if(start > end){
				var temp = end;
				end = start;
				start = temp;
			}
			for(var i = start; i < end; i++){
				$("#column"+i).addClass("selectedNote");
			}
			//console.log("done");
			selecting = false;
			playing = false;
			myCanvas.style.display = "none";
			$("#playSong").removeAttr("disabled");
			$("#rangeBtn").removeAttr("disabled");
		}
		//console.log(Math.ceil(left/50)-1);
	}
}, false);

function slidebarInit(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 410);
	ctx.lineWidth = 45;
	ctx.strokeStyle = "red";
	ctx.stroke();
	for(var i = start; i < end; i++){
		$("#column"+i).addClass("selectedNote");
	}
};