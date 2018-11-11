# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from testApp.models import User

def index(request):
	user_names = User.objects.all()
	
	context = {
		'user_name': user_names,
	}

	return render(request, 'index.html', context=context)
