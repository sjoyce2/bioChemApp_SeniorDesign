from django.urls import path, include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic.base import TemplateView
from testApp import views
from django.contrib.auth.views import LoginView


urlpatterns = [
	# url('^', include('django.contrib.auth.urls')),
	url(r'^password_reset/$', auth_views.PasswordResetView, name='password_reset'),
    url(r'^password_reset/done/$', auth_views.PasswordResetDoneView, name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.PasswordResetConfirmView, name='password_reset_confirm'),
    url(r'^reset/done/$', auth_views.PasswordResetCompleteView, name='password_reset_complete'),
	path('', views.login, name= 'login'),
	path('accounts/', include('django.contrib.auth.urls')),
	path('moduleEdit/<int:model>/<int:module>/<int:xCoor>/<int:yCoor>/<int:isPositive>', views.moduleEdit, name='moduleEdit'),
	path('modelEdit/<int:model>', views.modelEdit, name='modelEdit'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
	path('register', views.register, name='register'),
	path('home', views.home, name='home'),
	path('indexLogged', views.indexLogged, name='indexLogged'),
	path('logout_view', views.logout_view, name='logout_view')
]
