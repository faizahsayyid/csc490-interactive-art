from django.db import models

# Abstract Device class
class Device(models.Model):
    pass
    # name = models.CharField(max_length=15)

    def __str__(self):
        return self.name
    
# InputDevice class
class InputDevice(Device):
    INPUT_DEVICE_CHOICES = [
        ('BUTTON', 'Button'),
        ('MICROPHONE', 'Microphone'), # Audio Sensor
        ('MOTION_SENSOR', 'Motion Sensor'), 
        ('LIGHT_SENSOR', 'Light Sensor'), # LED
    ]
    name = models.CharField(max_length=15, choices=INPUT_DEVICE_CHOICES)

    def get_valid_action(self):
        if self.name == 'BUTTON':
            return ['PRESS', 'RELEASE']
        elif self.name == 'MICROPHONE':
            return ['SOUND']
        elif self.name == 'MOTION_SENSOR':
            return ['MOTION']
        elif self.name == 'LIGHT_SENSOR':
            return ['LIGHT']
        else:
            return []
        

# OutputDevice class
class OutputDevice(Device):
    OUTPUT_DEVICE_CHOICES = [
        ('LED', 'LED'),
        ('MOTOR', 'Motor'),
        ('SPEAKER', 'Speaker'),
    ]
    name = models.CharField(max_length=15, choices=OUTPUT_DEVICE_CHOICES)

    def get_valid_action(self):
        if self.name == 'LED':
            return ['ON', 'OFF']
        elif self.name == 'MOTOR':
            return ['ROTATE']
        elif self.name == 'SPEAKER':
            return ['SOUND']
        else:
            return []