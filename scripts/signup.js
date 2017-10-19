var registerBtn = document.getElementById("register");
var idwarning = document.getElementById("idDuplicate");
var pwwarning = document.getElementById("passwordError");

registerBtn.onclick = function(){
	register();
}

function register(){
	var id = $("#signupId").val();
	var email = $("#signupEmail").val();
	var pw1 = $("#signupPw1").val();
	var pw2 = $("#signupPw2").val();
	
	if(id_unique(id)){
		if(pw1==pw2){
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
};

function id_unique(id){
	return true;
};