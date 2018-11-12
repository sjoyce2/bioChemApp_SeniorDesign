# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from testApp.models import User

def index(request):
	objects = User.objects.get(username='user1')
	
	context = {
		'user_name': objects.username,
		'pass_word': objects.password,
	}

	return render(request, 'db_display/display.html', context=context)

def usernamePresent(username):
	exists = False

	if User.objects.filter(username=username).exists():
		exists = True

	context = {
		'userExists': exists,
	}
	
	return render(username, 'db_display/display.html', context=context)
