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
	reversible = models.CharField(max_length = 200 )

	def __str__(self):
		return_val = str(id) + str(self.modelID) + str(self.enzyme) + str(self.reversible)
		return return_val

class Products(models.Model):
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	product = models.CharField(max_length = 200)

	def __str__(self):
		return str(id) + str(self.module) + str(self.product)

class Substrates(models.Model):
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	substrate = models.CharField(max_length = 200)
	
	def __str__(self):
		return str(id) + str(self.module) + str(self.substrate)