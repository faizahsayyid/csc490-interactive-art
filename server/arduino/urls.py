from django.urls import path
from .views import generate_program, upload_program

urlpatterns = [
    path('project/<int:project_id>/generate_program', generate_program, name='generate_program'),
    path('project/<int:project_id>/upload_program', upload_program, name='upload_program'),
]
