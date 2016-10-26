from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'home/', views.home),
    url(r'goal/', views.goal),
    url(r'complete/', views.complete),
    url(r'delete/', views.delete),
    url(r'more/', views.more),
    url(r'update/', views.update_goal),
]