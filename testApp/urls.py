from django.urls import path
from testApp import views


urlpatterns = [
	path('', views.index, name='index'),
	path('moduleEdit', views.moduleEdit, name='moduleEdit'),
	path('modelEdit', views.modelEdit, name='modelEdit'),
	path('modelChoice', views.modelChoice, name='modelChoice'),
]
