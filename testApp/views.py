# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from .models import Module
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.db.models import Max

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

def modelChoice(request):
	# need to add a pop-up/redirect to allow the user to create a new model
	# using a form so that we can add a new row to the model table
	user = request.user
	# user.id holds user id, use this to query for all models of user

	privateModelsList = []
	publicModelsList = []

	privateModels = Model.objects.all().filter(userID_id__exact = user.id)
	publicModels = Model.objects.all().filter(public__exact = True)

	for model in privateModels:
		modelDict = {"modelName":model.modelName, "id": model.id}
		privateModelsList.append(modelDict)

	for model in publicModels:
		pubModelDict = {"modelName":model.modelName, "id": model.id}
		publicModelsList.append(pubModelDict)

	context = {
		'userID': user.id,
		'models': privateModelsList,
		'publicModels' : publicModelsList
	}
	return render(request, 'modelChoice.html', context=context)

def moduleEdit(request, model, module, xCoor, yCoor):

	myMod = Module.objects.all().filter(pk = module, modelID_id = model)

	mySubs = Substrates.objects.all().filter(moduleID_id__exact = module, modelID = model)
	myProds = Products.objects.all().filter(moduleID_id__exact = module, modelID = model)
	myModel = Model.objects.filter(pk = model)

	for value in myModel:
		currentModelName = value.modelName
		result = value.public
		modelID = value.id

	publicModel = Model.objects.filter(modelName = currentModelName, public = True)
	for models in publicModel:
		publicModelID = models.id
	# if not myMod:
	# 	xCoor = 0
	# 	yCoor = 0
	# else:
	# 	maxY = Module.objects.all().aggregate(Max('yCoor'))
	# 	# current Y is the Max y in their model
	# 	maxY = maxY.get('yCoor__max')
	# 	# check if their are already 2 x values for the y, if so need to query for x associated with y+1
	# 	xForMaxY = Module.objects.all().filter(modelID_id = model, yCoor = maxY)
	# 	# get x values associated with y value in the public version
	# 	# curX = Module.objects.all().filter(modelName = modName, yCoor = maxY, public=True)
	#
	# 	count = 0
	# 	for values in xForMaxY:
	# 		count = count + 1
	# 		currentX = values
	# 	if(count == 1):
	# 		# not on a split
	# 		# query for y + 1 in Public version
	# 		# check if next reaction is a split, if it is take smaller of 2 x values
	# 		# otherwise just take the single x value
	# 		yCoor = maxY + 1
	# 		xForYPlusOne = Module.objects.all().filter(modelID_id = publicModelID, yCoor = yCoor)
	# 		count = 0
	# 		listOfXcoors = [];
	# 		for values in xForYPlusOne:
	# 			listOfXcoors.append(values.xCoor)
	# 			count = count + 1
	# 			currentX = values
	# 		if(count == 1):
	# 			xCoor = currentX.xCoor;
	# 		elif(count == 2):
	# 			if(listOfXcoors[0] < listOfXcoors[1]):
	# 				xCoor = listOfXcoors[1]
	# 			else:
	# 				xCoor = listOfXcoors[0]
	# 		else:
	# 			# model is complete
	# 			xCoor = -1
	#
	# 	else:
	# 		# has split already and need to query for x value for y + 1
	# 		yCoor = maxY + 1
	# 		xForYPlusOne = Module.objects.all().filter(modelID_id = publicModelID, yCoor = yCoor)
	# 		for values in xForYPlusOne:
	# 			xCoor = values.xCoor
	# 		print(xCoor)

	isPublic = result;

	if(result):
		allmodules = Module.objects.all().filter(modelID_id__exact = model).values('enzyme', 'enzymeAbbr', 'reversible', 'id', 'xCoor', 'yCoor')
		allsubs = Substrates.objects.prefetch_related('moduleID').filter(modelID = model)
		allprods = Products.objects.prefetch_related('moduleID').filter(modelID = model)

		listOfSubs = []
		listOfProds = []

		for value in allsubs:
			currentSubDict = {"substrate": value.substrate, "enzyme": value.moduleID.enzyme, "abbr": value.abbr}
			listOfSubs.append(currentSubDict)

		for value in allprods:
			currentProdDict = {"product": value.product, "enzyme": value.moduleID.enzyme, "abbr": value.abbr}
			listOfProds.append(currentProdDict)
	else:
		publicModel = Model.objects.all().filter(modelName = currentModelName, public = True)
		for mod in publicModel:
			publicMod = mod

		allmodules = Module.objects.all().filter(modelID_id__exact = publicMod.id).values('enzyme', 'enzymeAbbr', 'reversible', 'id')
		allsubs = Substrates.objects.select_related('moduleID').filter(modelID = publicMod.id)
		allprods = Products.objects.select_related('moduleID').filter(modelID = publicMod.id)

		listOfSubs = []
		listOfProds = []

		for value in allsubs:
			currentSubDict = {"substrate": value.substrate, "enzyme": value.moduleID.enzyme, "abbr": value.abbr}
			listOfSubs.append(currentSubDict)

		for value in allprods:
			currentProdDict = {"product": value.product, "enzyme": value.moduleID.enzyme, "abbr": value.abbr}
			listOfProds.append(currentProdDict)

	if request.method == 'POST':
		new_enzyme = request.POST.get("Enzyme")
		new_reversible = request.POST.get("reversibleChoice")

		myModel = Model.objects.filter(pk = model)

		for value in myModel:
			currentModelName = value.modelName
			result = value.public

		modelData = Model.objects.filter(modelName = currentModelName, public = True)

		for mod in modelData:
			publicMod = mod
		moduleData = Module.objects.filter(modelID_id__exact = publicMod.id, enzyme=new_enzyme, reversible = new_reversible)

		for mods in moduleData:
			correctModule = mods

		substratesData = Substrates.objects.filter(modelID = publicMod.id, moduleID_id = correctModule.id).values()
		productsData = Products.objects.filter(modelID = publicMod.id, moduleID_id = correctModule.id).values()

		ProdAbbrsList = {}
		SubAbbrsList = {}

		for sub in substratesData:
			subAbbr = sub
			# SubAbbrsList.append({"abbr"+subAbbr.get('substrate') : subAbbr.get('abbr')})
			SubAbbrsList['abbr'+subAbbr.get('substrate')] = subAbbr.get('abbr')
		for prod in productsData:
			prodAbbr = prod
			# ProdAbbrsList.append({"abbr"+prodAbbr.get('product') : prodAbbr.get('abbr')})
			ProdAbbrsList['abbr'+prodAbbr.get('product')] = prodAbbr.get('abbr')

		post = Module(modelID_id=model, enzyme=new_enzyme, reversible=new_reversible, enzymeAbbr=correctModule.enzymeAbbr, xCoor=correctModule.xCoor, yCoor=correctModule.yCoor, enzWeight=correctModule.enzWeight, deltaG=correctModule.deltaG, deltaGNaughtPrime=correctModule.deltaGNaughtPrime)
		post.save()

		print(post.id)
		nextModule = post.id

		for key, values in request.POST.lists():
			if (key == "Product"):
				for i in range(len(values)):
					prods = Products(moduleID_id=nextModule, product=values[i], abbr=ProdAbbrsList.get('abbr'+values[i]), modelID = model)
					prods.save()
			if (key == "Substrate"):
				for i in range(len(values)):
					subs = Substrates(moduleID_id=nextModule, substrate=values[i], abbr=SubAbbrsList.get('abbr'+values[i]), modelID = model)
					subs.save()

		return HttpResponseRedirect("/testApp/modelEdit/" + str(model))
	else:
		context = {'form': SaveModuleForm,
				   'modules' : myMod,
				   'substrates' : mySubs,
				   'products' : myProds,
				   'allmodules' : allmodules,
				   'allprods' : listOfProds,
				   'allsubs' : listOfSubs,
				   'isPublic' : isPublic,
				   'modelID' : modelID,
				   'xCoor' : xCoor,
				   'yCoor' : yCoor
				  }
		return render(request, 'moduleEdit.html', context=context)

def modelEdit(request, model):
	mod = Module.objects.all()
	list_of_mods = []
	for obj in mod:
		mod_dict = {"id": obj.id, "modelID_id": obj.modelID_id, "enzyme": obj.enzyme, \
			"reversible": obj.reversible, "enzymeAbbr": obj.enzymeAbbr, "xCoor": obj.xCoor, \
			"yCoor": obj.yCoor, "enzWeight": obj.enzWeight, "deltaG": obj.deltaG, \
			"deltaGNaughtPrime": obj.deltaGNaughtPrime}
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
	context = { 'modules': list_of_mods, 'substrates': list_of_subs, 'products': list_of_prods,
		'model_num':model }
	return render(request, 'modelEdit.html', context=context)

def home(request):
	context = {}
	return render(request, 'home.html', context=context)

def register(request):

	if request.method == 'POST':
		form = SignUpForm(request.POST)
		if form.is_valid():
			# create new rows in model table for each public model
			form.save()
			username = form.cleaned_data.get('username')
			raw_password = form.cleaned_data.get('password1')
			user = authenticate(username=username, password=raw_password)
			auth_login(request, user)

			publicModels = Model.objects.filter(public__exact = True).values()
			for model in publicModels:
				modelName = model.get("modelName")
				post = Model(modelName=modelName, userID_id=user.id, public=False)
				post.save()
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
