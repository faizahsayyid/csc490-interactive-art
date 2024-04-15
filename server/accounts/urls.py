from django.urls import path
from .views import Register, Login, Logout, EditAccount, DeleteAccount

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('edit/', EditAccount.as_view(), name='edit'),
    path('delete/', DeleteAccount.as_view(), name='delete'),
]