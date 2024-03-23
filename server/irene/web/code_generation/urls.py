from django.urls import path
from . import views

urlpatterns = [
    path('projects/list/', views.ProjectList.as_view()),
    path('projects/<int:project_id>/', views.ProjectDetail.as_view()),
    
]
