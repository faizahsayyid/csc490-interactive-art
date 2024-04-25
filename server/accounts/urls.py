from django.urls import path
from .views import Register, Login, Logout, EditAccount, DeleteAccount, LoginAPI, RegisterAPI, LogoutAPI

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('edit/', EditAccount.as_view(), name='edit'),
    path('delete/', DeleteAccount.as_view(), name='delete'),
]