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
from django.contrib.auth import logout

def modelChoice(request):
	# need to add a pop-up/redirect to allow the user to create a new model
	# using a form so that we can add a new row to the model table
	user = request.user
	print(user)
	print(user.id)
	# user.id holds user id, use this to query for all models of user

	privateModelsList = []
	publicModelsList = []

	privateModels = Model.objects.all().filter(userID_id__exact = user.id)
	publicModels = Model.objects.all().filter(public__exact = True)

	for model in privateModels:
		print(model.modelName)
		print(model.id)
		modelDict = {"modelName":model.modelName, "id": model.id}
		privateModelsList.append(modelDict)
	print(privateModelsList)

	for model in publicModels:
		print(model.modelName)
		print(model.id)
		pubModelDict = {"modelName":model.modelName, "id": model.id}
		publicModelsList.append(pubModelDict)
	print(publicModelsList)

	context = {
		'userID': user.id,
		'models': privateModelsList,
		'publicModels' : publicModelsList
	}
	return render(request, 'modelChoice.html', context=context)

def moduleEdit(request, model, module):
	print("model")
	print(model)
	print("module")
	print (module)

	myMod = Module.objects.all().filter(pk = module)
	mySubs = Substrates.objects.all().filter(moduleID_id__exact = module)
	myProds = Products.objects.all().filter(moduleID_id__exact = module)
	myModel = Model.objects.filter(pk = model).values('public')
	for value in myModel:
		result = value

	print(result)
	print(result.get("public"))

	if(result.get("public")):
		allmodules = Module.objects.all().filter(modelID_id__exact = model).values('enzyme', 'enzymeAbbr', 'reversible', 'id')
		allsubs = Substrates.objects.select_related('moduleID').all()
		allprods = Products.objects.select_related('moduleID').all()

		listOfSubs = []
		listOfProds = []

		for value in allsubs:
			currentSubDict = {"substrate": value.substrate, "enzyme": value.moduleID.enzyme, "abbr": value.abbr}
			listOfSubs.append(currentSubDict)

		for value in allprods:
			currentProdDict = {"product": value.product, "enzyme": value.moduleID.enzyme, "abbr": value.abbr}
			listOfProds.append(currentProdDict)

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
				   'modules' : myMod,
				   'substrates' : mySubs,
				   'products' : myProds,
				   'allmodules' : allmodules,
				   'allprods' : listOfProds,
				   'allsubs' : listOfSubs
				  }
		return render(request, 'moduleEdit.html', context=context)

def modelEdit(request, model):
	mod = Module.objects.all()
	list_of_mods = []
	for obj in mod:
		mod_dict = {"id": obj.id, "modelID_id": obj.modelID_id, "enzyme": obj.enzyme, \
			"reversible": obj.reversible, "enzymeAbbr": obj.enzymeAbbr, "xCoor": obj.xCoor, \
			"yCoor": obj.yCoor, "enzWeight": obj.enzWeight}
		list_of_mods.append(mod_dict)
	subs = Substrates.objects.all()
	list_of_subs = []
	for obj in subs:
		sub_dict = {"id": obj.id, "substrate": obj.substrate, "moduleID_id": obj.moduleID_id, \
			"abbr": obj.abbr}
		list_of_subs.append(sub_dict)
	prods = Products.objects.all()
	list_of_prods = []
	for obj in prods:
		prod_dict = {"id": obj.id, "product": obj.product, "moduleID_id": obj.moduleID_id, \
			"abbr": obj.abbr}
		list_of_prods.append(prod_dict)
	context = { 'modules': list_of_mods, 'substrates': list_of_subs, 'products': list_of_prods}
	return render(request, 'modelEdit.html', context=context)

def home(request):
	context = {}
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
	context = {}

	return render(request, 'load.html', context=context)

def signup(request):
	context = {}

	return render(request, 'accounts/signup.html', context=context)

def indexLogged(request):
	context = {}

	return render(request, 'indexLogged.html', context=context)

def logout_view(request):
	context = {}
	logout(request)
	return render(request, 'home.html', context=context)
