# My Messenger
created by Erik Döhler, 08.02.2021 Gothenburg

## Introdution

My Messenger is an offline chat-platform which design is based on the Facebook Messenger. On the first look, this project seems to be as normal as all the others, but the beauty of this project lies in the details. In My Messenger you can chat with your friends as in a professional messenger (with some exceptions) and you can easily add new friends from a list of all users to your contacts.

One speciality of this project is the use of contacts. With a search field you can see all registered users and can easily search for the one you want to write to. After clicking on a user, the user appears in the contacts with an empty chat, but is not added to the contacts before you write a message. This part is therefore very dynamic and as good as the Facebook Messenger. And as promissed are the details making the difference. The search function of all users is dynamical and updates the list of users after each letter entered. Additionally, the contacts which have already a chat with you are sorted by the most recent message which is also displayed under the name of the contact.
And the same can be said about the chat. It seems to be simple, but it is all about the details. When writing a message, the contact list on the left side is updated automatically, the messages have all their own timestamp, but the timestamp is only shown, if no other message was send in the last 15 minutes. And of course, the latest messages are displayed on the bottom and the container with overflow stays automatically with the latest messages.

As to make it attractive for the eyes, not only the design of My Messenger is of the very best, also every user can add his/her own profile picture so that the contacts have not only a standard empta head. 

All this little details make this messenger therefore to a very nice website and worth for the final project! 

## Getting Started

Everything you will need to run the messenger is pip3 and django. Bootstrap and pictures, which are included in the Messenger, are integrated with links and don't need special prerequisites.

## messenger - file details

**models.py**
In this project three SQL tables are used. The standard User table, one for contacts between two users and one for all messages which were send in this messenger. The objects in the Message table consists of a body, a timestamp, a sender and a contact. The entries in the contact table represent the chats between two users. The sender is the Message table is needed to know who of the two users in the contact table wrote the message.   
The speciality in *models.py* is the Profile class which is extension of the standard User class. Every user has the possiblity to add a profile picture which is why the User table needed a new column for urls of pictures. This field is obviously not mandatory.

**urls.py**
My Messenger consists of two pages except the login, logout and register page. These two pages are the profile page of every user and the page where the actual messenger website is running, called *home*.
Additionally, 5 API routes are used to get with the JavaScript files the datas of the SQL databases, which are handled in Python.

**views.py**
The *views.py* file consists of 10 functions. The first three, *login_view*, *logout_view* and *register* are copied from the previous projects while the others are created just for this project and will be explaind in more details:
- *home*
	- rendering the main papge of My Messenger *home.html*
- *users*
	- getting the objects of all users except the one who is logged in
	- sending the data as JSON response back to the JS file.
- *users_sel*
	- getting the objects of all users which have the specification (letters) in their name except the user who is logged in
	- returning the data as JSON response
- *chats*
	- getting all the contacts of a user
	- getting for all the contacts the latest message
	- sorting the list of messages after the timestamp, so that the JS file gets the information in which order the contacts will be displayed
	- sending contacts and messages in a dictionary as JSON response back
- *chat_user*
	- GET:
		- getting all the messages of chat
		- returning as JSON response
	- POST:
		- creating a new entry in the Message table -> adding a new message to the chat between the to users
		- and if it is a new chat with no previous messages, create new entry in the Contacts table -> creating a new chat between the two users
- *profile*
	- get the information of the user who is logged in and the number of contacts
	- render the profile page and send the information in a dictionary back
- *picture*
	- PUT:
		- put the url of a picture into the object of the user who is logged in
	- GET:
		- get the data of the user who is logged in together with the url of the profile picture

**home.js**
When the *home.html* page is loaded (the page is divided in three main parts, the navigation bar on the top, the list of contacts/chats on the left side and the chat with all the messages between to users together with the field for a new message on the right side) the *show_chats* function is called together with 3 added event-listeners for the search field and the text input field of a new message. The *show_chats* function will load all existing contacts/chats the user, who is logged in, has and call the other functions which are needed, but more details following.   
- *show_chats(users)*
	- requesting the datas with *chat* function in *views.py*
	- if value of *users* is 'all':
		- loop through the list of messages (every contact has just one message in this list) and creating for every message/contact a div with the information (the profile picture and username of the contact, the first words of the message and the timestamp)
		- additionally, call the function *open_chat* which opens all messages of the latest contact
		- adding event-listener to the divs of the contacts so that the messages of this specific contact will be open with the *open_chat* function when the user clicks on this contact
	- if value of *users* is not 'all', the user clicked on a specific user and wants to message this specific user
		- if this specific user is a new user (not in the Contacts database), create an extra div for this potentially new user as for the others, but don't create a new contact in the database (this will be done after the first message)
	- clear the input of the search bar
- *users_all()*
	- is called when the focus is in the search bar and runs only if the value of the search bar is still empty
	- shows all users which are registered in My Messenger in a list
	- add to every entry in this list an event-listener that when the inlogged user cicks on that user, the show_chats(user) function is called with this user as a variable
- *users_selection()*
	- is running if the value of the search bar is not empty
	- does the same as the *users_all()* function except that this function shows only the users which matche the letters in the searchbar
- *open_chat(recipient)*
	- opens the messages of the active contact/chat between the user who is logged in and the other user (recipient)
	- creates divs for every message and gives the divs a class whether it comes from the recipient (display on the left side) or from the user who is logged in (display message on the right side)
	- display the timestamp of a message only in no other message was send in the last 15 minutes
	- show the bottom of the container with the latest messages
- *send(event)*
	- is called from the event-listener for the new message input field
	- posts the new message in the database and calls the *show_chats(recipient)* function so that the entire page gets updated dynamically

**profile.js**
The *profile.html* page is mainly static and don't need the *profile.js*, but to be able to add a profile picture, the *profile.js* was created.  
- *main()*
	Detect the size of the current picture and give it a class with respect to the size, so that the longer side fits into the container.
- *picture()*
	Get the  value from the input field and put it as a new url for the profile picture in the User database.

## How to run My Messenger
This step is pretty straight forward and not different from the other projects:
```
python manage.py makemigrations
```
```
python manage.py migrate
```
```
python manage.py runserver
```
After the last command, open the page in a webbrowser your choice and register as a user. Because this is an 'offline' chatting platform, more than one user will be needed to be able to start a conversation.