from django.contrib import admin

# Register your models here.
from .models import Project, InputDevice, OutputDevice, Interaction

class ProjectAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

admin.site.register(Project, ProjectAdmin)
admin.site.register(InputDevice)
admin.site.register(OutputDevice)
admin.site.register(Interaction)