<?php 
header("Content-Type: application/json");
ini_set("session.cookie_httponly",1);

$mysqli = new mysqli('localhost','wustl_inst','wustl_pass','calendarEvents');


$eventIdTracker = $_POST['eventId'];
$userToken   = $_POST['token'];


session_start();
$sessionToken = $_SESSION['token'];
if($sessionToken !== $userToken){
	echo json_encode(array(
		"sucess" => false,
		"message" => "Token validatio failed!"
	));
	exit(0);
}

//delete event through mySQL
$myquery = "DELETE FROM  eventsTable WHERE eventId = '$eventIdTracker'";
$stmt = $mysqli -> prepare($myquery);
if(!$stmt){
	echo json_encode(array(
		"sucess" => false,
		"message" => "Msqli connection failed: %s", $mysqli->error
	));
	exit(0);
}

$stmt -> execute();
$stmt -> close();

echo json_encode(array(
"sucess"=>true));

 ?>