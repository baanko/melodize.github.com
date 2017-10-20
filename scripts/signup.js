var registerBtn = document.getElementById("register");
var idwarning = document.getElementById("idDuplicate");
var pwwarning = document.getElementById("passwordError");
var mtwarning = document.getElementById("emptyError");

$("#signupId").select();

registerBtn.onclick = function(){
	register();
}

function register(){
	var id = $("#signupId").val();
	var email = $("#signupEmail").val();
	var pw1 = $("#signupPw1").val();
	var pw2 = $("#signupPw2").val();

	mtwarning.style.display = "none";
	pwwarning.style.display = "none";
	idwarning.style.display = "none";
	
	if(id != "" &&
		email != "" &&
		pw1 != "" && 
		pw2 != ""){
		if(id_unique(id)){
			if(pw1 == pw2){
				var newUserRef = database.ref("user/accounts/"+id+"%%%"+pw1);
				var idList = database.ref("user/idList");
				var currentdate = new Date();
				var datetime = currentdate.getDate() + "/"
                				+ (currentdate.getMonth()+1)  + "/" 
				                + currentdate.getFullYear() + " @ "  
				                + currentdate.getHours() + ":"  
				                + currentdate.getMinutes() + ":" 
				                + currentdate.getSeconds();
				newUserRef.set({
					email: email,
					registeredDate: datetime,
					score: 0,
				});
				alert("<Melodize>\n\nCongratulations!\nYou are successfully registered.\nMoving to home page...");
				window.location.href = "./index.html";
			}
			else{
				$("#signupPw2").select();
				pwwarning.style.display = "";
			}
		}
		else{
			$("#signupId").select();
			idwarning.style.display = "";
		}
	}
	else{
		mtwarning.style.display = "";
	}
};

function id_unique(id){
	return true;
};