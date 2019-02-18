# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models


class Model(models.Model):
	userID = models.ForeignKey(User, on_delete=models.CASCADE)
	modelName = models.CharField(max_length = 200 )

	def __str__(self):
		return str(id) + str(self.userID) + str(self.modelName)

class Module(models.Model):
	modelID = models.ForeignKey(Model, on_delete=models.CASCADE)
	enzyme = models.CharField(max_length = 200 )
	enzymeAbbr = models.CharField(max_length = 8, default="ENZYME")
	reversible = models.CharField(max_length = 200 )
	xCoor = models.IntegerField(default=0)
	yCoor = models.IntegerField(default=0)

	def __str__(self):
		return_val = str(id) + str(self.modelID) + str(self.enzyme) + str(self.reversible)
		return return_val

class Products(models.Model):
	moduleID = models.ForeignKey(Module, on_delete=models.CASCADE)
	product = models.CharField(max_length = 200)
	abbr = models.CharField(max_length = 8, default="PROD")

	def __str__(self):
		return str(id) + str(self.moduleID) + str(self.product)

class Substrates(models.Model):
	moduleID = models.ForeignKey(Module, on_delete=models.CASCADE)
	substrate = models.CharField(max_length = 200)
	abbr = models.CharField(max_length = 8, default="SUB")
	
	def __str__(self):
		return str(id) + str(self.moduleID) + str(self.substrate)