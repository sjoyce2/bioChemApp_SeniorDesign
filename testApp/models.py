# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models

class Module(models.Model):
	userID = models.ForeignKey(User, on_delete=models.CASCADE)
	modelID = models.IntegerField()
	moduleID = models.IntegerField()
	#substrate = models.CharField(max_length = 200 )
	#product = models.CharField(max_length = 200 )
	enzyme = models.CharField(max_length = 200 )
	reversible = models.CharField(max_length = 200 )
	modelName = models.CharField(max_length = 200 )

	def __str__(self):
		return_val = str(self.userID) + str(self.modelID) + str(self.moduleID) \
			+ str(self.enzyme) + str(self.reversible) + str(self.modelName)
		return return_val

class Products(models.Model):
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	product = models.CharField(max_length = 200)

	def __str__(self):
		return self.name

class Substrates(models.Model):
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	substrate = models.CharField(max_length = 200)
	
	def __str__(self):
		return self.name