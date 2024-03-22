from django.db import models
from .Device import Device, InputDevice, OutputDevice
from .Action import Action, InputAction, OutputAction


# Pair class
class Pair(models.Model):
    # device = models.ForeignKey(Device, on_delete=models.CASCADE)
    # action = models.ForeignKey(Action, on_delete=models.CASCADE)

    def __str__(self):
        return "(" + self.device + ", " + self.action + ")"

class InputPair(Pair):
    device = models.ForeignKey(InputDevice, on_delete=models.CASCADE)
    action = models.ForeignKey(InputAction, on_delete=models.CASCADE)

class OutputPair(Pair):
    device = models.ForeignKey(OutputDevice, on_delete=models.CASCADE)
    action = models.ForeignKey(OutputAction, on_delete=models.CASCADE)

# Abstract InputOutput class
class InputOutput(models.Model):

    # pairs = models.ManyToManyField('Pair')

    CONNECTIVE_CHOICES = [
        ('AND', 'AND'),
        ('OR', 'OR'),
    ]
    connective = models.CharField(max_length=3, choices=CONNECTIVE_CHOICES)

    def __str__(self):
        return "[" + self.connective + "] " + self.pairs

# Input class
class Input(InputOutput):
    pairs = models.ManyToManyField('InputPair')
    
# Output class
class Output(InputOutput):
    pairs = models.ManyToManyField('OutputPair')
