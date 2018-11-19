from django.urls import path
from django.cong.urls import url
from testApp import views
from django.contrib.auth.views import login

urlpatterns = [
	path('', views.display, name= 'index'),
	path('', views.login, name = 'login'),
	path('', views.signup, name = 'signup'),
	path('moduleEdit', views.moduleEdit, name='moduleEdit'),
	path('modelEdit', views.modelEdit, name='modelEdit'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
	path('register', views.register, name='register'),
]
