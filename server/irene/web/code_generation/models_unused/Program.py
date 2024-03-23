from django.db import models
from .InputOutput import Input, Output

# Program class
class Program(models.Model):

    # input and output contain (1) the pairs of devices and actions and (2) the connectives
    input = models.ForeignKey(Input, on_delete=models.CASCADE)
    output = models.ForeignKey(Output, on_delete=models.CASCADE)
    arduino_code = models.TextField()

    def __str__(self):
        return f"Program-{self.pk}"
