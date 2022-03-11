/* Author: Ishaan Ghosh
File: translate.js
Course: CSc 337 Fall 21
Desc: This is the JS file responsible for setting up the clide-side of the chat program. It contains
	  two functions: sendMes and getMes. sendMes takes the user input and sends it to the server
	  and getMes sends out a request to retrieve the messages from the server*/

/*
A method that sends information to the database. It retrieves the user message from the DOM
and relays it to the server. 
*/
function sendMes() {
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest) {
		alert('Error!');
		return false;
	}
	// Once AJAX request is made
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				console.log(httpRequest.responseText);
			} else { alert('Response failure'); }
		}
	}
	// Retriving information through DOM manipulation
	var alias = document.getElementById("alias").value;
	var mess = document.getElementById("mes").value;
	document.getElementById("mes").value = "";
	document.getElementById("mes").value;

	// Calling helper method using AJAX
	let url = '/chats/post/' + alias + "/" + mess;
	httpRequest.open('POST', url);
	httpRequest.send();
}

/*
A method that sends a get request to the server. It anticipates the chat will be returned to
the server, and added to the messages div.
*/
function getMessages() {
	var httpRequest = new XMLHttpRequest();
	if (!httpRequest) { return false; }
  
	httpRequest.onreadystatechange = () => {
	  if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
		  let msgs = document.getElementById('chatDiv');
		  msgs.innerHTML = httpRequest.responseText;
		} else { alert('Response failure'); }
	  }
	}
  
	let url = "/chats";
	httpRequest.open('GET', url);
	httpRequest.send();
}

setInterval(getMessages, 1000);
  