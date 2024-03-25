from django.urls import path
from .views import SendCodeToBoard, Demo

urlpatterns = [
    path('api/', SendCodeToBoard.as_view()),
    path('demo/', Demo.as_view())
]
