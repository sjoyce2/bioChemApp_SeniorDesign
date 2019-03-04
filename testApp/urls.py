from django.urls import path, include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic.base import TemplateView
from testApp import views
from django.contrib.auth.views import LoginView

urlpatterns = [
	path('', views.login, name= 'login'),
	path('accounts/', include('django.contrib.auth.urls')),
	path('moduleEdit/<int:module>/', views.moduleEditCase1, name='moduleEditCase1'),
	path('moduleEdit', views.moduleEdit, name='moduleEdit'),
	path('moduleEdit/<int:module>/', views.moduleEditCase1, name='moduleEditCase1'),
	path('modelEdit', views.modelEdit, name='modelEdit'),
	path('modelEdit/<int:model>/', views.modelEditCase1, name='modelEditCase1'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
	path('register', views.register, name='register'),
	path('home', views.home, name='home'),
]
