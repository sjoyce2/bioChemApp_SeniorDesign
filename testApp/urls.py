from django.urls import path, include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic.base import TemplateView
from testApp import views
from django.contrib.auth.views import LoginView


urlpatterns = [
	path('accounts/login/', auth_views.LoginView.as_view(), name= 'login'),
	path('accounts/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
	path('accounts/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
	path('accounts/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
	path('accounts/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset_form'),
	path('moduleEdit/<int:model>/<int:module>/<int:xCoor>/<int:yCoor>/<int:isPositive>', views.moduleEdit, name='moduleEdit'),
	path('modelEdit/<int:model>', views.modelEdit, name='modelEdit'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
	path('register', views.register, name='register'),
	path('home', views.home, name='home'),
	path('indexLogged', views.indexLogged, name='indexLogged'),
	path('logout_view', views.logout_view, name='logout_view')
]
