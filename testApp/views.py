# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from .models import Module

# Create your views here.
from django.http import HttpResponse
from testApp.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from testApp.forms import SignUpForm


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
	if request.method == 'POST':
		form = SignUpForm(request.POST)
		if form.is_valid():
			form.save()
			username = form.cleaned_data.get('username')
			raw_password = form.cleaned_data.get('password1')
			user = authenticate(username=username, password=raw_password)
			auth_login(request, user)
			return redirect('modelChoice')
	else:
		form = SignUpForm()
	return render(request, 'registration/signup.html', {'form': form})

def login(request):
	context = {

	}
	return render(request, 'load.html', context=context)

def signup(request):
	context = {
	}
	return render(request, 'accounts/signup.html', context=context)

def createModule(userId, modelId, moduleId, substrate, product, enzyme, reversible, modelName):

def readModule(id):	
