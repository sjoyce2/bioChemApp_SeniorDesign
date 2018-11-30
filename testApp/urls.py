from django.urls import path, include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic.base import TemplateView
from testApp import views
from django.contrib.auth.views import LoginView

urlpatterns = [
	#url(r'^login/$', LoginView, {'template_name': 'accounts/display.html'}),
	path('', views.login, name= 'login'),
	path('accounts/', include('django.contrib.auth.urls')),
	path('moduleEdit', views.moduleEdit, name='moduleEdit'),
	path('modelEdit', views.modelEdit, name='modelEdit'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
	path('register', views.register, name='register'),
]
