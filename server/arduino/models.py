from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    """
    A project is a collection of input and output devices that are connected to each other.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class InputDevice(models.Model):
    """
    An input device is a device that can send a signal to an output device
    """
    project = models.ForeignKey(Project, related_name='input_devices', on_delete=models.CASCADE)
    device_name = models.CharField(max_length=255)

    def __str__(self):
        return self.device_name

class OutputDevice(models.Model):
    """
    An output device is a device that can receive a signal from an input device
    """
    project = models.ForeignKey(Project, related_name='output_devices', on_delete=models.CASCADE)
    device_name = models.CharField(max_length=255)

    def __str__(self):
        return self.device_name
