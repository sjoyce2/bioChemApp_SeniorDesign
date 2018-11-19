# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from testApp.models import User

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
	return render(request, 'register.html', context=context)

def index(request):
	objects = User.objects.get(username='user1')
	exists = False

	#if User.objects.filter(username=user1).exists():
	#	exists = True

	context = {
		'user_name': objects.username,
		'pass_word': objects.password,
		'userExists': exists,
	}

	return render(request, 'db_display/display.html', context=context)

	
