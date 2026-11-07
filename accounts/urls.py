from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('catalog/', views.catalog, name='catalog'),
    path('catalog/tree/', views.catalog, {'tree': True}, name='catalog_tree'),

    path('c/dream/', views.dream, name='dream'),
    path('c/dream/tree/', views.dream, {'tree': True}, name='dream_tree'),

    path('c/sun/', views.sun, name='sun'),
    path('c/sun/tree/', views.sun, {'tree': True}, name='sun_tree'),

    path('c/jewelry/', views.jewelry, name='jewelry'),
    path('c/jewelry/tree/', views.jewelry, {'tree': True}, name='jewelry_tree'),
]
