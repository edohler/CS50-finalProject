document.addEventListener('DOMContentLoaded', function() {

console.log("DOM loaded");
document.querySelector('#search-bar').addEventListener('focusin', users_all);
document.querySelector('#search-bar').addEventListener('keyup', users_selection);
document.querySelector('#new-message-form').addEventListener('submit', send);
const w = window.innerWidth;
console.log(w);
if (w < 1000) {
	document.querySelector('.alternative-navbar').style.display = 'block';
	document.querySelector('.normal-navbar').style.display = 'none';
} else {
	document.querySelector('.alternative-navbar').style.display = 'none';
	document.querySelector('.normal-navbar').style.display = 'block';
}

show_chats('all')	

})


// ----------- showing contacts ------------------------------------

function show_chats(users) {
	const w = window.innerWidth;
	console.log(w);
	fetch('/chats', {
		method: 'GET'})
	.then(response => response.json())
	.then(result => {
		console.log(result);
		document.querySelector('.user-listing-div').style.display = 'none';
		const div = document.querySelector('.listing-div');
		div.style.display = 'block';
		div.innerHTML = "";
		let iter = 0;
		let new_contact = true;
		let picture_user = "";
		// ----- new contact --------------------------
		if (users !== 'all') {
			result.contacts.forEach(contact =>{
				if (users === contact.person1 || users === contact.person2) {
					new_contact = false;
				}
			})
			if (new_contact === true) {
				iter = 1;
				recipient = users;
				const element = document.createElement('div');
				element.setAttribute("class", "big-user-div");
				element.setAttribute("id", "active");
				const icon = document.createElement('div');
				icon.setAttribute("class", "big-icon-div");
				fetch(`/picture/${recipient}`, {
					method: 'GET'})
				.then(response => response.json())
				.then(result => {
					if (result.picture == "") {
						icon.innerHTML = '<span class="glyphicon glyphicon-user"></span>';
					} else {
						const img = document.createElement('img');
						img.setAttribute("class", "contact-user-picture");
						img.src = result.picture;
						img.addEventListener('load', function() {
							let currWidth = img.naturalWidth;
						    let currHeight = img.naturalHeight;
						    if (currWidth > currHeight) {
						    	img.setAttribute("id", "contact-picture-wide");
						    	const factor = 60/currHeight;
						    	newWidth = (factor*currWidth-60)/2;
						    	img.style.marginLeft = -newWidth+"px";
						    } else {
						    	img.setAttribute("id", "contact-picture-long");
						    	const factor = 60/currWidth;
						    	newHeight = (factor*currHeight-60)/2;
						    	img.style.marginTop = -newHeight+"px";
						    }
						})
						icon.append(img);
					}});
				element.append(icon);
				if (w > 1600) {
					const info = document.createElement('div');
					info.setAttribute("class", "big-info-div");
					element.append(info);
					const name = document.createElement('div');
					name.setAttribute("class", "big-name-div");
					name.innerHTML = recipient;
					info.append(name);
					div.append(element);
					
					title_div = document.querySelector(".top-chat-div");	
					title_div.innerHTML = recipient;
					document.querySelector(".chat-div").innerHTML = "";
					}
				}
			}
		// ----------------------------------------------
		result.messages.forEach(message =>{
			iter += 1;
			picture_user = {};
			result.contacts.forEach(contact =>{
				if (contact.id == message.contact) {
					if (contact.person1 == result.user.username) {
						recipient = contact.person2;
					}
					else if (contact.person2 == result.user.username) {
						recipient = contact.person1;
					}
					else {
						console.log("Error in recipient");
					}
					picture_user = result.pictures.find(user => user.username === recipient)
				}
			})
			const element = document.createElement('div');
			element.setAttribute("class", "big-user-div");
			if (users === 'all') {
				if (iter === 1) {
					element.setAttribute("id", "active");
					open_chat(recipient)
				}
			} else {
				if (recipient === users) {
					element.setAttribute("id", "active");
					open_chat(recipient)	
				}
			}
			const icon = document.createElement('div');
			icon.setAttribute("class", "big-icon-div");
			if (picture_user.picture == "") {
				icon.innerHTML = '<span class="glyphicon glyphicon-user"></span>';
			} else {
				const img = document.createElement('img');
				img.setAttribute("class", "contact-user-picture");
				img.src = picture_user.picture;
				img.addEventListener('load', function() {
					let currWidth = img.naturalWidth;
				    let currHeight = img.naturalHeight;
				    if (currWidth > currHeight) {
				    	img.setAttribute("id", "contact-picture-wide");
				    	const factor = 60/currHeight;
				    	newWidth = (factor*currWidth-60)/2;
				    	img.style.marginLeft = -newWidth+"px";
				    } else {
				    	img.setAttribute("id", "contact-picture-long");
				    	const factor = 60/currWidth;
				    	newHeight = (factor*currHeight-60)/2;
				    	img.style.marginTop = -newHeight+"px";
				    }
				})
				icon.append(img);
			}
			element.append(icon);
			if (w > 1600) {
				const info = document.createElement('div');
				info.setAttribute("class", "big-info-div");
				element.append(info);
				const name = document.createElement('div');
				name.setAttribute("class", "big-name-div");
				name.innerHTML = recipient;
				info.append(name);
				const text = document.createElement('div');
				text.setAttribute("class", "big-text-div");
				text.innerHTML = message.body;
				info.append(text);
				const date = document.createElement('div');
				date.setAttribute("class", "big-date-div");
				date.innerHTML = message.timestamp;
				element.append(date);
				element.addEventListener('click', function() {
					document.querySelector('#active').removeAttribute("id", "active");
					//element.setAttribute("id", "active");
					open_chat(name.innerHTML)
					show_chats(name.innerHTML)
				});
			}
			div.append(element);
		})
	})
	document.querySelector('#search-bar').value = "";
}
// ---------------------------------------------------------------


// ------- Search in contacts for chat ------------
function users_all() {
	const input = document.querySelector('#search-bar');
	value = input.value;
	if (value == "") {
		fetch('/users', {
			method: 'GET'})
		.then(response => response.json())
		.then(users => {
			document.querySelector('.listing-div').style.display = 'none';
			const div = document.querySelector('.user-listing-div');
			div.style.display = 'block';
			div.innerHTML = "";
			const title = document.createElement('div');
			title.setAttribute("class", "contact-div");
			title.innerHTML = "Contacts";
			div.append(title);
			users.forEach(user => {
				const element = document.createElement('div');
				element.setAttribute("class", "user-div");
				const icon = document.createElement('div');
				icon.setAttribute("class", "icon-div");
				icon.innerHTML = '<span class="glyphicon glyphicon-user"></span>';
				element.append(icon);
				const name = document.createElement('div');
				name.setAttribute("class", "name-div");
				name.innerHTML = user.username;
				element.append(name);
				element.addEventListener('click', function() {
					show_chats(user.username)
				});
				div.append(element);
			})
		});
	}
	else {
		users_selection()
	}
}

function users_selection() {
	const input =document.querySelector('#search-bar');
	value = input.value;
	if (value == "") {
		users_all()
	}
	else {
		console.log(value);
		fetch(`/users/${value}`, {
			method: 'GET'})
		.then(response => response.json())
		.then(users => {
			document.querySelector('.listing-div').style.display = 'none';
			const div = document.querySelector('.user-listing-div');
			div.style.display = 'block';
			div.innerHTML = "";
			const title = document.createElement('div');
			title.setAttribute("class", "contact-div");
			title.innerHTML = "Contacts";
			div.append(title);
			users.forEach(user => {
				const element = document.createElement('div');
				element.setAttribute("class", "user-div");
				const icon = document.createElement('div');
				icon.setAttribute("class", "icon-div");
				icon.innerHTML = '<span class="glyphicon glyphicon-user"></span>';
				element.append(icon);
				const name = document.createElement('div');
				name.setAttribute("class", "name-div");
				name.innerHTML = user.username;
				element.append(name);
				element.addEventListener('click', function() {
					//document.querySelector('#search-bar').removeEventListener('focusout', show_chats, true);
					show_chats(user.username)});

				div.append(element);
			})
		});
	}
}
// -----------------------------------------------------------------


// ---------------- Open chat ------------------------------------



function open_chat(recipient) {
	let d0 = new Date("December 17, 2000 03:24:00"); // just a random date so that the very first message has a timestamp
	title_div = document.querySelector(".top-chat-div");	
	title_div.innerHTML = recipient;
	element = document.querySelector(".chat-div");
	fetch(`/chats/${recipient}`, {
		method: 'GET'})
	.then(response => response.json())
	.then(result => {
		element.innerHTML = "";
		result.forEach(message =>{
			d1 = new Date("2021 " + message.timestamp);
			if (d1.getTime()/1000 - d0.getTime()/1000 > 900) { 		// show timestamp only after message-break of >15min
				const date = document.createElement('div');
				date.setAttribute("class", "chat-date-div");
				date.innerHTML = message.timestamp;
				element.append(date);
			}
			const text_div = document.createElement('div');
			text_div.setAttribute("class", "chat-text-div");
			element.append(text_div);
			const text = document.createElement('div');
			if (recipient === message.sender) {
				text.setAttribute("class", "chat-text-recipient-div");
			} else {
				text.setAttribute("class", "chat-text-sender-div");
			}
			text.innerHTML = message.body;
			text_div.append(text);
			d0 = d1;
		})
		element.scrollTop = element.scrollHeight;
	});
}

// ----------------------------------------------------------------------


// -------- send new message --------------------------------------------

function send(event) {
	const body = document.querySelector('#new-message').value;
	const recipient = document.querySelector(".top-chat-div").innerHTML;
	document.querySelector('#new-message').value = "";

	fetch(`/chats/${recipient}`, {
		method: 'POST',
		body: JSON.stringify({
			body: body
		})
	})
	.then(response => response.json())
	.then(result => {
		console.log(result);
		show_chats(recipient);
	});
	event.preventDefault();
}