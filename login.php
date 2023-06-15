<?php
	header("Content-Type: application/json");


	$usernameLogin = $_POST['usernameLogin'];
	$usernamePassword = $_POST['usernamePassword'];
	$startSession = false;

	$mysqli = new mysqli('localhost','wustl_inst','wustl_pass','calendarEvents');

	$myquery = "SELECT COUNT(*),usernameId, usernamePasswod FROM userTable WHERE username='$usernameLogin'  ";
	$stmt=$mysqli->prepare($myquery);
	if(!$stmt){
				echo json_encode(array(
					"sucess" =>false,
					"message"=>"query2 prep failed: %s",$mysqli ->error
				));
				exit;
			}
	$stmt->execute();
	$stmt->bind_result($cnt,$usernameId,$usernameHashedPassword);
	$stmt->fetch();

	//check for valid users

	if($cnt == 1 && password_verify($usernamePassword,$usernameHashedPassword)){
		ini_set("session.cookie_httponly", 1);
		session_start();
		$_SESSION['userid']=$usernameId;
		$_SESSION['username']=$usernameLogin;
		$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); //generate token
		$token = $_SESSION['token'];
		echo json_encode(array(
					'sucess'=>true,
					'login'=>true,
					'userid' =>$_SESSION['userid'], 
					'sessionToken'=>$token
				));
		exit;
	}
	else{
		echo json_encode(array(
					"sucess" =>false,
					'message'=> "Invalid loging (Check username or password)!"
				));
	}

?>