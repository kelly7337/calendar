function hideall() {
	document.getElementById("eventDeleteButton").style.visibility = "hidden";
	document.getElementById("addaEventButton").style.visibility = "hidden";
	document.getElementById("editEventButton").style.visibility = "hidden";

	document.getElementById("userspaceDiv").style.visibility = "hidden";
}
hideall();

function deleteEvent() {
	var eventIdTracker = trackEvent;
	var stoken = usernameToken;
	var urlstring = "eventId=" + encodeURIComponent(eventIdTracker) + "&token=" + encodeURIComponent(stoken);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "deleteEvent.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.addEventListener("load", deleteEventCallBack, false);
	xhttp.send(urlstring);
}

function deleteEventCallBack(event) {
	var deleteJsonData = JSON.parse(event.target.responseText);
	alert(deleteJsonData.sucess ? "Event Deleted" : "something went wrong!");
}

$('deleteEventButtonSubmit').addEventListener("click", function (event) {
	console.log("delete pressed");
	deleteEvent();
	updateCalendar();
	getCalendarEvents();

}, true);


function editEventAjax() {
	var editEventTitle = $('editEventTitle').value;
	var editEventTime = $('editEventTimeHour').value;
	var editEventTimeMinute = $('editEventTimeMinute').value;
	var editEventIdTracker = trackEvent;
	var stoken = usernameToken;


	var urlstring = "newEventTitle=" + encodeURIComponent(editEventTitle)
		+ "&newEventTime=" + encodeURIComponent(editEventTime)
		+ "&newEventTimeMinute=" + encodeURIComponent(editEventTimeMinute)
		+ "&eventIdTracker=" + encodeURIComponent(editEventIdTracker)
		+ "&token=" + encodeURIComponent(stoken);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "updateEvent.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.addEventListener("load", function (event) {
		var jsonData = JSON.parse(event.target.responseText);
		if (jsonData.sucess) {
			alert("event updated!")
			$('editEventTitle').value = "";
			$('editEventTimeHour').value = "";
			$('editEventTimeMinute').value = "";
		}
		else {
			alert("Something went wrong!")
			exit(0);
		}

	}, false);


	xhttp.send(urlstring);
}
$('editEventSubmit').addEventListener("click", function (event) {
	editEventAjax();
	updateCalendar();
	getCalendarEvents();
}, true);

function share() {
	sharedEventId = trackEvent;
	shareUserId = document.getElementById("shareUserId").value;
	if (trackEvent == null) {
		alert("user not found");
		$('shareUserId').value = "";
	}

	var urlstring = "shareUserId=" + encodeURIComponent(shareUserId)
		+ "&sharedEventId=" + encodeURIComponent(sharedEventId);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "share.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.addEventListener("load", shareEventsCallBack, false);
	xhttp.send(urlstring);
}

function shareEventsCallBack(event) {
	var shareJsonData = JSON.parse(event.target.responseText);
	alert(shareJsonData.sucess ? "Event Shared!" : "something went wrong!");
}

$('shareEvent').addEventListener("click", function (event) {
	share();
	updateCalendar();
	getCalendarEvents();

}, true);