# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from .models import Module
from django.contrib.auth.models import User

# Create your views here.
from django.http import HttpResponse
from django.http import HttpResponseRedirect
#from testApp.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from testApp.forms import SignUpForm
from testApp.forms import SaveModuleForm
from testApp.models import Module
from testApp.models import Model
from testApp.models import Products
from testApp.models import Substrates
# <<<<<<< HEAD
# =======
# from testApp.static.modelChoice import createButton as cb
# >>>>>>> d8e6a8c74e5f65c52049418887aebf63907afb37

def modelChoice(request):
	# need to add a pop-up/redirect to allow the user to create a new model
	# using a form so that we can add a new row to the model table
	user = request.user
	models = Model.objects.all()
	context = {
		'userID': user.id,
		'models': models
	}
	return render(request, 'modelChoice.html', context=context)

def moduleEdit(request, module):
	print ("HI");
	currentMod = Module.objects.filter(pk = module).values('modelID_id')
	mod = Module.objects.all().filter()
	subs = Substrates.objects.all().filter(moduleID_id__exact = module)
	prods = Products.objects.all().filter(moduleID_id__exact = module)
	# mod = Module.objects.all()
	# mod = Module.objects.all().filter(modelID_id = )
	# subs = Substrates.objects.all()
	# prods = Products.objects.all()
	if request.method == 'POST':
		print(request.POST)
		new_enzyme = request.POST.get("Enzyme")
		new_reversible = request.POST.get("reversibleChoice")
		post = Module(modelID_id=2, enzyme=new_enzyme, reversible=new_reversible)
		post.save()
		for key, values in request.POST.lists():
			if (key == "Product"):
				for i in range(len(values)):
					prods = Products(moduleID_id=2, product=values[i])
					prods.save()
			if (key == "Substrate"):
				for i in range(len(values)):
					subs = Substrates(moduleID_id=2, substrate=values[i])
					subs.save()

		return HttpResponseRedirect("/testApp/modelEdit")
	else:
		context = {'form': SaveModuleForm,
				   'modules' : currentMod,
				   'substrates' : subs,
				   'products' : prods
				  }
		return render(request, 'moduleEdit.html', context=context)

def moduleEditCase1(request, module):
	print ("Hello")
	# mod = Module.objects.all().filter(modelID_id = model)
	currentMod = Substartes.objects.values('modelID_id').filter(id = module)
	mod = Module.objects.all().filter(modelID_id__exact = currentMod)
	subs = Substrates.objects.all().filter(moduleID_id__exact = module)
	prods = Products.objects.all().filter(moduleID_id__exact = module)
	if request.method == 'POST':
		print(request.POST)
		new_enzyme = request.POST.get("Enzyme")
		new_reversible = request.POST.get("reversibleChoice")
		post = Module(modelID_id=2, enzyme=new_enzyme, reversible=new_reversible)
		post.save()
		for key, values in request.POST.lists():
			if (key == "Product"):
				for i in range(len(values)):
					prods = Products(moduleID_id=2, product=values[i])
					prods.save()
			if (key == "Substrate"):
				for i in range(len(values)):
					subs = Substrates(moduleID_id=2, substrate=values[i])
					subs.save()

		return HttpResponseRedirect("modelEdit")
	else:
		context = {'form': SaveModuleForm,
				   'modules' : mod,
				   'substrates' : subs,
				   'products' : prods
				  }
		return render(request, 'moduleEdit.html', context=context)

def modelEdit(request):
	mod = Module.objects.all()
	context = { 'modules': mod }
	return render(request, 'modelEdit.html', context=context)

def modelEditCase1(request, model):
	mod = Module.objects.all()
	context = { 'modules': mod }
	return render(request, 'modelEdit.html', context=context)

def home(request):
	context = {

	}
	return render(request, 'home.html', context=context)

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

'''def createModule(new_userId, new_modelId, new_moduleId, substrate_list, \
	product_list, new_enzyme, new_reversible, new_modelName):
	new_module = Module(userID = new_userId, modelID = new_modelId, \
		moduleID = new_moduleId, enzyme = new_enzyme, reversible = \
		new_reversible, modelName = new_modelName)
	new_module.save()
	for i in range(len(substrate_list)):
		new_substrate = Substrates(module = new_moduleId, substrate = \
			substrate_list[i])
		new_substrate.save()
	for i in range(len(product_list)):
		new_product = Products(module = new_moduleId, product = \
			product_list[i])
		new_product.save() '''


#def readModule(id):
