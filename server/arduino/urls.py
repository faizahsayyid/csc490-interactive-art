from django.urls import path
from .views import SendCodeToBoard, Demo, ProjectListView, ProjectDetailView

urlpatterns = [
    path('api/', SendCodeToBoard.as_view()),
    path('demo/', Demo.as_view()),
    path('projects/', ProjectListView.as_view()),
    path('projects/<int:pk>/', ProjectDetailView.as_view()),
]
