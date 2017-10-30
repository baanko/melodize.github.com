var registerBtn = document.getElementById("register");
var idwarning = document.getElementById("idDuplicate");
var pwwarning = document.getElementById("passwordError");
var mtwarning = document.getElementById("emptyError");

$("#signupId").select();

registerBtn.onclick = function(){
	register();
}

function register(){
	var id = safe($("#signupId").val());
	var email = safe($("#signupEmail").val());
	var pw1 = safe($("#signupPw1").val());
	var pw2 = safe($("#signupPw2").val());

	mtwarning.style.display = "none";
	pwwarning.style.display = "none";
	idwarning.style.display = "none";
	
	if(id != "" &&
		email != "" &&
		pw1 != "" && 
		pw2 != ""){
		if(pw1 == pw2){
			var newUserRef = database.ref("user/accounts/"+id+"%%%"+pw1);
			var currentdate = new Date();
			var datetime = currentdate.getDate() + "/"
            				+ (currentdate.getMonth()+1)  + "/" 
			                + currentdate.getFullYear() + " @ "  
			                + currentdate.getHours() + ":"  
			                + currentdate.getMinutes() + ":" 
			                + currentdate.getSeconds();
			database.ref("user/accounts/"+id+"%%%"+pw1).once('value', function(snapshot){
				if(snapshot.val() == undefined && !id.includes("%%%")){
					newUserRef.set({
						email: email,
						registeredDate: datetime,
						contributions: 0,
						score: 0,
						profilePic: "",
					});
					alert("<Melodize>\n\nCongratulations! "+id+",\nYou are successfully registered.\nMoving to home page...");
					window.location.href = "./index.html";
				}
				else{
					$("#signupId").select();
					idwarning.style.display = "";
				}
			});
		}
		else{
			$("#signupPw2").select();
			pwwarning.style.display = "";
		}
	}
	else{
		mtwarning.style.display = "";
	}
};