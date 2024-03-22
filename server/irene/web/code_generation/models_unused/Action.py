from django.db import models
from .Device import Device, InputDevice, OutputDevice

# Abstract Action Class
class Action(models.Model):
    # name = models.CharField(max_length=100)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

# InputAction class
class InputAction(models.Model):
    device = models.ForeignKey(InputDevice, on_delete=models.CASCADE)
    
    ACTION_CHOICES = InputDevice.get_valid_action(device) 
    name = models.CharField(max_length=100, choices=ACTION_CHOICES)
    

# OutputAction class
class OutputAction(models.Model):
    device = models.ForeignKey(OutputDevice, on_delete=models.CASCADE)

    ACTION_CHOICES = OutputDevice.get_valid_action(device)
    name = models.CharField(max_length=100, choices=ACTION_CHOICES)