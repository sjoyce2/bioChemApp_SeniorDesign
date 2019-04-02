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
	path('moduleEdit/<int:model>/<int:module>/<int:xCoor>/<int:yCoor>', views.moduleEdit, name='moduleEdit'),
	path('modelEdit/<int:model>', views.modelEdit, name='modelEdit'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
	path('register', views.register, name='register'),
	path('home', views.home, name='home'),
	path('indexLogged', views.indexLogged, name='indexLogged'),
	path('logout_view', views.logout_view, name='logout_view'),
]
