import json
import time
from datetime import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.core.paginator import Paginator



from .models import *


def login_view(request):
	if request.method == "POST":

		# Attempt to sign user in
		username = request.POST["username"]
		password = request.POST["password"]
		user = authenticate(request, username=username, password=password)

		# Check if authentication successful
		if user is not None:
			login(request, user)
			return HttpResponseRedirect(reverse("home"))
		else:
			return render(request, "messenger/login.html", {
				"message": "Invalid username and/or password."
			})
	else:
		return render(request, "messenger/login.html")


def logout_view(request):
	logout(request)
	return HttpResponseRedirect(reverse("login"))

def register(request):
	if request.method == "POST":
		username = request.POST["username"]
		email = request.POST["email"]

		# Ensure password matches confirmation
		password = request.POST["password"]
		confirmation = request.POST["confirmation"]
		if password != confirmation:
			return render(request, "messenger/register.html", {
				"message": "Passwords must match."
			})

		# Attempt to create new user
		try:
			user = User.objects.create_user(username, email, password)
			user.save()
		except IntegrityError:
			return render(request, "messenger/register.html", {
				"message": "Username already taken."
			})
		login(request, user)
		return HttpResponseRedirect(reverse("home"))
	else:
		return render(request, "messenger/register.html")

@login_required
def home(request):
	return render(request, "messenger/home.html")

@login_required
def users(request):
	if request.method == "GET":
		user = request.user
		
		users = User.objects.all().exclude(username=user)
		
		return JsonResponse([user.serialize() for user in users], safe=False)

@login_required
def users_sel(request, value):
	if request.method == "GET":
		user = request.user
		try:
			users = User.objects.filter(username__icontains=value).exclude(username=user)
			return JsonResponse([user.serialize() for user in users], safe=False)
		except:
			return JsonResponse({"message": "no user found!"}, status=400)

@csrf_exempt
@login_required
def chats(request):
	user = request.user
	if request.method == "GET":
		try:
			user_object = User.objects.get(username=user)
			contacts = Contact.objects.filter(Q(person1=user) | Q(person2=user))
			messages = []
			recipients = []
			for contact in contacts:
				messages.append(Message.objects.filter(contact=contact.id).order_by('-timestamp').first())
				if contact.person1 == user:
					recipient_name = contact.person2;
				else:
					recipient_name = contact.person1;
				recipients.append(User.objects.get(username=recipient_name))
			#date_format = '%b %d, %I:%M %p'
			messages = sorted(messages, key=lambda x: x.timestamp)
			results = {"messages": [message.serialize() for message in reversed(messages)], "contacts":[contact.serialize() for contact in contacts], "user": user_object.serialize(), "pictures":[recipient.profile.serialize() for recipient in recipients]}
			return JsonResponse(results, safe=False)
		except Contact.DoesNotExist:
			return JsonResponse({"message": "no contacts found!"}, status=400)

@csrf_exempt
@login_required
def chat_user(request, recipient):
	user = request.user
	if request.method == "GET":
		try:
			user_object = User.objects.get(username=user)
			recipient_object = User.objects.get(username=recipient)
			contact = Contact.objects.get(Q(person1=user, person2=recipient_object.id) | Q(person2=user, person1=recipient_object.id))
			messages = Message.objects.filter(contact=contact.id);
			return JsonResponse([message.serialize() for message in messages], safe=False)
		except Contact.DoesNotExist:
			return JsonResponse({"message": "contact not found!"}, status=400)
	elif request.method == "POST":
		data = json.loads(request.body)
		body = data.get("body","")
		user_object = User.objects.get(username=user)
		recipient_object = User.objects.get(username=recipient)
		try:
			contact_object = Contact.objects.get(Q(person1=user, person2=recipient_object.id) | Q(person2=user, person1=recipient_object.id))
			message = Message(
				contact = contact_object,
				sender = user_object,
				body = body
				)
			message.save()
			return JsonResponse({"message": "message sent succefully!"}, status=201)
		except Contact.DoesNotExist:
			newContact = Contact(
				person1 = user_object,
				person2 = recipient_object,
				)
			newContact.save()
			message = Message(
				contact = newContact,
				sender = user_object,
				body = body
				)
			message.save()
			return JsonResponse({"message": "message sent succefully und new contact created!"}, status=201)

@csrf_exempt
@login_required
def profile(request):
	user = request.user
	user_object = User.objects.get(username=user)
	user_info = user_object.serialize()
	numberOfContacts = Contact.objects.filter(Q(person1=user) | Q(person2=user)).count()
	return render(request, "messenger/profile.html", {
		"user": user_object,
		"noc": numberOfContacts
	})

@csrf_exempt
@login_required
def picture(request, recipient):
	user = request.user
	if request.method == "PUT":
		data = json.loads(request.body)
		body = data.get("body","")
		user_object = User.objects.get(username=user)
		user_object.profile.picture = body
		user_object.save()
		return JsonResponse({"message": "picture updated succefully!"}, status=201)
	elif request.method == "GET":
		user = User.objects.get(username=recipient)
		return JsonResponse(user.profile.serialize(), status=201)
		
