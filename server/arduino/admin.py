from django.contrib import admin

# Register your models here.
from .models import Project, InputDevice, OutputDevice, Interaction

admin.site.register(Project)
admin.site.register(InputDevice)
admin.site.register(OutputDevice)
admin.site.register(Interaction)