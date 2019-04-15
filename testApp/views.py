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

	for model in publicModels:
		pubModelDict = {"modelName":model.modelName, "id": model.id}
		publicModelsList.append(pubModelDict)
		privateVersion = Model.objects.all().filter(userID_id__exact = user.id, modelName = model.modelName)
		if not privateVersion:
			newPrivateModel = Model(modelName=model.modelName, userID_id=user.id, public=False)
			newPrivateModel.save()

	for model in privateModels:
		modelDict = {"modelName":model.modelName, "id": model.id}
		privateModelsList.append(modelDict)

	context = {
		'userID': user.id,
		'models': privateModelsList,
		'publicModels' : publicModelsList
	}
	return render(request, 'modelChoice.html', context=context)

def moduleEdit(request, model, module, xCoor, yCoor, isPositive):
	if(isPositive == 0):
		xCoor = 0 - xCoor
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

	isPublic = result

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

		allmodules = Module.objects.all().filter(modelID_id__exact = publicMod.id).values('enzyme', 'enzymeAbbr', 'reversible', 'id', 'xCoor', 'yCoor')
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
		# The database cannot have strings with spaces, replace spaces with underscores
		new_enzyme = new_enzyme.replace(" ", "_")
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
		nextModule = post.id

		for key, values in request.POST.lists():
			if (key == "Product"):
				for i in range(len(values)):
					values[i] = values[i].replace(" ", "_")
					prods = Products(moduleID_id=nextModule, product=values[i], abbr=ProdAbbrsList.get('abbr'+values[i]), modelID = model)
					prods.save()
			if (key == "Substrate"):
				for i in range(len(values)):
					values[i] = values[i].replace(" ", "_")
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
				   'moduleID' : module,
				   'xCoor' : xCoor,
				   'yCoor' : yCoor
				  }
		return render(request, 'moduleEdit.html', context=context)

def modelEdit(request, model):
	if request.method == 'POST':
		isPublic = Model.objects.all().filter(pk = model)
		for pub in isPublic:
			isPub = pub.public
		if(not isPub):
			deletedProducts = Products.objects.all().filter(modelID = model).delete()
			deletedSubstrates = Substrates.objects.all().filter(modelID = model).delete()
			deletedModules = Module.objects.all().filter(modelID_id__exact = model).delete()
	myModel = Model.objects.all().filter(pk = model)
	for models in myModel:
		modelName = models.modelName
	publicModel = Model.objects.all().filter(modelName = modelName, public = True)
	for models in publicModel:
		publicModelId = models.id

	myModules = Module.objects.all().filter(modelID_id = model)
	publicModules = Module.objects.all().filter(modelID_id = publicModelId)

# Start if else statements to get next x and y coordinate
	if (not myModules):
		xCoor = 0
		yCoor = 1
	else :
		currentMaxY = 0
		# check to see if the max y has 1 or 2 occurrences
		countY = 0
		for module in myModules:
			if (module.yCoor > currentMaxY):
				currentMaxY = module.yCoor
				countY = 1
			elif (module.yCoor == currentMaxY):
				countY = countY + 1

		if (countY < 2):
			countY = 0
			xValues = []
			# the next module could be the second module in a split
			# check if currentMaxY is in the public modules more than once
			for modules in publicModules:
				if modules.yCoor == currentMaxY:
					countY = countY + 1
					xValues.append(modules.xCoor)
			if(countY > 1):
				yCoor = currentMaxY
				currentMaxX = 0
				for xVal in xValues:
					if(xVal > currentMaxX):
						currentMaxX = xVal
				xCoor = currentMaxX
			else:
				# the next module has a y value of currentMaxY + 1
				# the module could still be part of a split, grab x values associated with currentMaxY + 1, take min x
				xValues = []
				# set currentMinX to greatest possible x value + 1
				currentMinX = 2
				for modules in publicModules:
					if(modules.yCoor == currentMaxY + 1):
						xValues.append(modules.xCoor)
				for xVal in xValues:
					if(xVal < currentMinX):
						currentMinX = xVal
				xCoor = currentMinX
				yCoor = currentMaxY + 1
		else:
			# the next module is not part of a split, because a split just occurred
			# grab the x associated with y+1
			xValues = []
			# set currentMinX to greatest possible x value + 1
			currentMinX = 2
			for modules in publicModules:
				if(modules.yCoor == currentMaxY + 1):
					xValues.append(modules.xCoor)
			for xVal in xValues:
				if(xVal < currentMinX):
					currentMinX = xVal
			xCoor = currentMinX
			yCoor = currentMaxY + 1
	# End if else statements to get next x and y coordinate

	pubModel = -1
	for obj in myModel:
		pubModel = obj.public
	mod = myModules
	list_of_mods = []
	for obj in mod:
		mod_dict = {"id": obj.id, "modelID_id": obj.modelID_id, "enzyme": obj.enzyme, \
			"reversible": obj.reversible, "enzymeAbbr": obj.enzymeAbbr, "xCoor": obj.xCoor, \
			"yCoor": obj.yCoor, "enzWeight": obj.enzWeight, "deltaG": obj.deltaG, \
			"deltaGNaughtPrime": obj.deltaGNaughtPrime}
		list_of_mods.append(mod_dict)
	subs = Substrates.objects.all().filter(modelID = model)
	list_of_subs = []
	for obj in subs:
		sub_dict = {"id": obj.id, "substrate": obj.substrate, "moduleID_id": obj.moduleID_id, \
			"abbr": obj.abbr}
		list_of_subs.append(sub_dict)
	prods = Products.objects.all().filter(modelID = model)
	list_of_prods = []
	for obj in prods:
		prod_dict = {"id": obj.id, "product": obj.product, "moduleID_id": obj.moduleID_id, \
			"abbr": obj.abbr}
		list_of_prods.append(prod_dict)
	context = { 'modules': list_of_mods, 'substrates': list_of_subs, 'products': list_of_prods,
		'model_num':model, 'xCoorNext':xCoor, 'yCoorNext':yCoor, 'pubModel':pubModel }
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
	print("Login*******")

	return render(request, 'load.html', context=context)

def signup(request):
	context = {}

	return render(request, 'accounts/signup.html', context=context)

def indexLogged(request):
	context = {}
	print("Login*****")
	return render(request, 'indexLogged.html', context=context)

def logout_view(request):
	context = {}
	logout(request)
	return render(request, 'home.html', context=context)
