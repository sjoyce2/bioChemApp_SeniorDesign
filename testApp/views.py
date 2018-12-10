# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from testApp.models import User
from django.contrib.auth import authenticate


def modelChoice(request):
	context = {}
	return render(request, 'modelChoice.html', context=context)

def moduleEdit(request):
	context = {
	}
	return render(request, 'moduleEdit.html', context=context)

def modelEdit(request):
	context = {
	}
	return render(request, 'modelEdit.html', context=context)

def register(request):
	context = {
	}
	return render(request, 'registration/register.html', context=context)

def login(request):
	context = {

	}
	return render(request, 'load.html', context=context)

def signup(request):
	context = {

	}
	return render(request, 'accounts/signup.html', context=context)

def display(request):
	objects = User.objects.get(username='user1')
	exists = False

	#if User.objects.filter(username=user1).exists():
	#	exists = True

	context = {
		'user_name': objects.username,
		'pass_word': objects.password,
		'userExists': exists,
	}

	return render(request, 'accounts/display.html', context=context)

	
