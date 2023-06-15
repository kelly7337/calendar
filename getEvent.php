<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly",1);

$mysqli = new mysqli('localhost','wustl_inst','wustl_pass','calendarEvents');


session_start();
$usernameId = $_SESSION['userid'];
$username = $_SESSION['username'];


$getMonth= $_POST['getMonth'];
$getYear= $_POST['getYear'];
$getDay= $_POST['getDay'];

$myquery = "SELECT eventId, eventTitle, eventTime,eventDay,eventMonth,eventYear, eventMinute FROM eventsTable WHERE usernameId ='$usernameId'";

$stmt=$mysqli->prepare($myquery);
if(!$stmt){

	echo json_encode(array(
		"sucess" =>false,
		"message"=>"query1 prep failed: %s",$mysqli->error

	));
	exit;
}
$stmt->execute();
$fetchResults=$stmt->get_result();

while(($row=$fetchResults->fetch_assoc()) !== null){
	if($row['eventYear'] == $getYear){
		if($row['eventMonth'] == $getMonth){
			if($row['eventDay'] == $getDay){
				echo json_encode(array(
					"sucess"=>true,
					"userid"=>$usernameId,
					"eventTitle"=>$row['eventTitle'],
					"eventTime"=>$row['eventTime'],
					"eventId"=>$row['eventId'],
					"eventMinute" =>$row['eventMinute']
				));
				exit;
			}

		}

	}

}

$stmt->close();
exit;










?>