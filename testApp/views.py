# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from testApp.models import User

def index(request):
	objects = User.objects.get(username='user1')
	exists = False
	
	if User.objects.filter(username=user).exists():
		exists = True

	context = {
		'user_name': objects.username,
		'pass_word': objects.password,
		'userExists': exists,
	}

	return render(request, 'db_display/display.html', context=context)

	
