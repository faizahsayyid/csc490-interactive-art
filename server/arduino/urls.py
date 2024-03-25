from django.urls import path
from .views import SendCodeToBoard

urlpatterns = [
    path('api/', SendCodeToBoard.as_view())
]
