from django.db import models
from django.contrib.auth.models import User
import uuid


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

    project = models.ForeignKey(Project, related_name="input_devices", on_delete=models.CASCADE)
    device_name = models.CharField(max_length=255)
    pin = models.IntegerField(default=1)

    def __str__(self):
        return self.device_name


class OutputDevice(models.Model):
    """
    An output device is a device that can receive a signal from an input device
    """

    project = models.ForeignKey(Project, related_name="output_devices", on_delete=models.CASCADE)
    device_name = models.CharField(max_length=255)
    pin = models.IntegerField(default=2)

    def __str__(self):
        return self.device_name


class Interaction(models.Model):
    """
    Represents an interaction between an input device and an output device, with potential actions and parameters.
    """

    project = models.ForeignKey(Project, related_name="interactions", on_delete=models.CASCADE)
    input_device = models.ForeignKey(InputDevice, on_delete=models.CASCADE)
    output_device = models.ForeignKey(OutputDevice, on_delete=models.CASCADE)
    action = models.CharField(max_length=255, blank=True, null=True)
    additional_variables = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f"{self.input_device} to {self.output_device} via {self.action}"
