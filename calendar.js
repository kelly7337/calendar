var calendarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var eventsOut = false;
function startHTML() {
	$('closePopup').style.visibility = "hidden";
}
startHTML();


function $$(className) {
	return document.getElementsByClassName(className)
}

//code from wiki

function createCalendarTable() {
	if (!document.getElementsByTagName) return;
	tabBody = document.getElementsByTagName("tbody").item(0);
	let weekNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

	obj = document.createElement("tr");
	obj.className = "weekNames";
	for (var i = 0; i < weekNames.length; i++) {
		cell1 = document.createElement("td");
		cell1.className = "weekName";
		textCell1 = document.createTextNode(weekNames[i]);
		cell1.appendChild(textCell1);
		obj.appendChild(cell1);
		tabBody.appendChild(obj);

	}

	for (var i = 1; i < 6; i++) {
		obj = document.createElement("tr");
		obj.className = "week" + i;
		cell1 = document.createElement("td");
		cell1.className = "weekDay";
		cell2 = document.createElement("td");
		cell2.className = "weekDay";
		cell3 = document.createElement("td");
		cell3.className = "weekDay";
		cell4 = document.createElement("td");
		cell4.className = "weekDay";
		cell5 = document.createElement("td");
		cell5.className = "weekDay";
		cell6 = document.createElement("td");
		cell6.className = "weekDay";
		cell7 = document.createElement("td");
		cell7.className = "weekDay";
		obj.appendChild(cell1);
		obj.appendChild(cell2);
		obj.appendChild(cell3);
		obj.appendChild(cell4);
		obj.appendChild(cell5);
		obj.appendChild(cell6);
		obj.appendChild(cell7);
		tabBody.appendChild(obj);
	}
}
createCalendarTable();

$('registerButton').addEventListener("click", function (event) {
	registerAjax();
}, true);
$('loginButton').addEventListener("click", function (event) {

	loginAjax();
	console.log(userLoggedIn);

	updateCalendar();
	getCalendarEvents();

}, true);
$('userLogoutSubmit').addEventListener("click", function (event) {
	logoutAjax(event);
	updateCalendar();
	getCalendarEvents();
}, true)

function $(id) {
	return document.getElementById(id)
}

//code from wiki

var currentMonth = new Month(2023, 3); 
function updateMonth() {
	$('monthName').innerHTML = calendarMonths[currentMonth.month] + ", " + currentMonth.year;
}

document.getElementById("next_month_btn").addEventListener("click", function (event) {
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateMonth(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	updateCalendar();
	if (userLoggedIn == true) {
		getCalendarEvents();
	}

}, false);
document.getElementById("prev_month_btn").addEventListener("click", function (event) {
	currentMonth = currentMonth.prevMonth(); 
	updateMonth();
	updateCalendar();
	if (userLoggedIn == true) {
		getCalendarEvents();
	}  
}, false);



function updateCalendar() {
	var weeks = currentMonth.getWeeks();
	var weekdaysTable = 7;
	for (var w in weeks) {
		var data = 0;
		var days = weeks[w].getDates();

		for (var d in days) {

			document.getElementsByTagName("td")[weekdaysTable].innerHTML = days[data].getDate();
			weekdaysTable += 1;
			data += 1;
		}
	}
}


function getCalendarEvents() {
	var getMonth, getYear, getDay, calendarIndexFirst, calendarIndexLast;
	getMonth = currentMonth.month;
	getYear = currentMonth.year;

	console.log(getMonth);
	console.log(getYear);
	calendarIndexFirst = 7; 

	var i, j;
	i = 7;
	j = 15;
	while (i < 14) {
		if (document.getElementsByTagName('td')[i].innerHTML == "1") {
			calendarIndexFirst = i;
			break;
		}
		else {
			i++;
		}
	}
	
	calendarIndexLast = 42;
	while (j < 42) {
		if (document.getElementsByTagName('td')[j].innerHTML == "1") {
			calendarIndexLast = j;
			break;
		}
		else {
			j++;
		}
	}
	getDay = 0;
	console.log(calendarIndexFirst);
	console.log(calendarIndexLast);
	function xhttpGetEvents(i) {
		var xhttp = new XMLHttpRequest();
		var urlstring = "getMonth=" + getMonth + "&getYear=" + getYear + "&getDay=" + getDay;
		xhttp.open("POST", "getEvent.php", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.addEventListener("load", function (event) {
			var eventJsonData = JSON.parse(event.target.responseText);
			console.log(eventJsonData);
			if (eventJsonData.sucess) {
				document.getElementsByTagName('td')[i].innerHTML += "<br><button class='getEvent' id='" + eventJsonData.eventId + "'"
					+ " onClick = trackEventId(this.id)> <br> " + eventJsonData.eventTitle + "<br>"
					+ eventJsonData.eventTime + ":" + eventJsonData.eventMinute + "</button>";
			}
			else if (!eventJsonData.sucess) {
				console.log(eventJsonData.message);
			}

		}, false);
		xhttp.send(urlstring);
		document.getElementsByTagName("td")[i].innerHTML = getDay + 1;
	}

	for (index = calendarIndexFirst; index < calendarIndexLast; index++) {
		xhttpGetEvents(index);

		getDay++;
	}
	eventsOut = true;
}



function addEvent() {
	var eventTitle = $('eventTitle').value;
	var eventYear = $('eventYear').value;
	var eventMonth = $('eventMonth').value - 1;
	var eventDay = $('eventDay').value - 1;
	var eventTime = $('eventTimeHour').value;
	var eventTimeMinute = $('eventTimeMinute').value;
	;


	var urlstring = "eventTitle=" + encodeURIComponent(eventTitle)
		+ "&eventYear=" + encodeURIComponent(eventYear)
		+ "&eventMonth=" + encodeURIComponent(eventMonth)
		+ "&eventDay=" + encodeURIComponent(eventDay)
		+ "&eventTime=" + encodeURIComponent(eventTime)
		+ "&eventTimeMinute=" + encodeURIComponent(eventTimeMinute);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "addEvent.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.addEventListener("load", function (event) {
		var jsonData = JSON.parse(event.target.responseText);
		if (jsonData.sucess) {
			alert("event added!")
			$('eventTitle').value = "";
			$('eventYear').value = "";
			$('eventMonth').value = "";
			$('eventDay').value = "";
			$('eventTimeHour').value = "";
			$('eventTimeMinute').value = "";
		}
		else {
			alert("Something went wrong!")
		}

	}, false);


	xhttp.send(urlstring);
}
$('addNewEvent').addEventListener("click", function (event) {
	addEvent();
	updateCalendar();
	getCalendarEvents();
}, true);

function trackEventId(id) {
	trackEvent = id;
	console.log(trackEvent);
}

window.addEventListener("load", updateCalendar());
window.addEventListener("load", updateMonth());
