from django.db import models

class Project(models.Model):
    owner = models.ForeignKey('auth.User', related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    INPUT_DEVICE_CHOICES = [
        ('BUTTON', 'Button'),
        ('MICROPHONE', 'Microphone'), # Audio Sensor
        ('MOTION_SENSOR', 'Motion Sensor'), 
        ('LIGHT_SENSOR', 'Light Sensor'), # LED
    ]
    input_device = models.CharField(max_length=15, choices=INPUT_DEVICE_CHOICES)

    # input_action's options are based on the input_device
    # Here are all the possible input actions for each input device:
    INPUT_ACTION_CHOICES = {
        'BUTTON': [
            ('PUSHED', 'When pushed'),
            ('RELEASED', 'When released'),
            ('DOUBLE_CLICKED', 'When double clicked'),
            ('LONG_PRESSED', 'When long-pressed'),
        ],
        'MICROPHONE': [
            ('ABOVE', 'When sound level exceeds X'),
            ('BELOW', 'When sound level falls below X'),
            ('PATTERN', 'When specific sound pattern is detected'),
            ('SILENCE', 'When silence is detected'),
            ('FREQUENCY_PATTERN', 'When frequency spectrum matches a specific pattern'),
            ('ABOVE_BELOW', 'When sound level drops below A decibels after being above B for C seconds'),
        ],
        'MOTION_SENSOR': [
            ('MOTION', 'When motion is detected'),
            ('STOP', 'When motion stops'),
            ('MOTION_TIME', 'When motion is detected for X seconds'),
            ('STOP_TIME', 'When motion stops for X seconds'),
            ('MOTION_PATTERN', 'When specific motion pattern is detected'),
            ('DIRECTION_CHANGED', 'When motion direction changes'),
            ('SPEED_ABOVE', 'When motion speed exceeds X'),
        ],
        'LIGHT_SENSOR': [
            ('BELOW', 'When ambient light level is below X lux'),
            ('ABOVE', 'When ambient light level is above X lux'),
            ('PATTERN', 'When specific light pattern is detected'),
            ('INTENSITY_RAPID_CHANGE', 'When light intensity changes rapidly'),
            ('ABOVE_TIME', 'When light level exceeds a certain threshold X for a duration'),
            ('BELOW_TIME', 'When light level falls below a certain threshold X for a duration'),
            ],
    }

    def get_input_action_choices(self):
        if self.input_device:
            return self.INPUT_ACTION_CHOICES.get(self.input_device, [])
        else:
            return []

    input_action = models.CharField(max_length=90, choices=get_input_action_choices)

    # input_action = models.CharField(max_length=90, choices=INPUT_ACTION_CHOICES[input_device])

    OUTPUT_DEVICE_CHOICES = [
        ('LED', 'LED'),
        ('MOTOR', 'Motor'),
        ('SPEAKER', 'Speaker'),
    ]
    output_device = models.CharField(max_length=8, choices=OUTPUT_DEVICE_CHOICES)

    # output_action's options are based on the output_device
    # Here are all the possible output actions for each output device:
    OUTPUT_DEVICE_CHOICES = {
        'LED': [
            ('ON', 'Turn on'),
            ('OFF', 'Turn off'),
            ('TOGGLE', 'Toggle'),
            ('BLINK', 'Blink at regular intervals'),
            ('BLINK_ON', 'Blink for a specific duration and turn on'),
            ('BLINK_OFF', 'Blink for a specific duration and turn off'),
            # ('Change color', 'Change color'),
            ('DECREASE_BRIGHTNESS', 'Decrease brightness'),
            ('INCREASE_BRIGHTNESS', 'Increase brightness'),
        ],
        'MOTOR': [
            ('ROTATE_C', 'Rotate clockwise'),
            ('ROTATE_CC', 'Rotate counter-clockwise'),
            ('ROTATE_SPEED', 'Rotate at a specific speed'),
            ('ROTATE_ANGLE', 'Rotate to a specific angle'),
            ('STOP', 'Stop'),
            ('CHANGE_SPEED', 'Change speed'),
            ('CHANGE_DIRECTION', 'Change direction'),
        ],
        'SPEAKER': [
            ('PLAY', 'Play sound'),
            ('STOP', 'Stop sound'),
            ('INCREASE_VOLUME', 'Increase volume'),
            ('DEDCREASE_VOLUME', 'Decrease volume'),
            ('PLAY_TONE', 'Play specific tone'),
            ('PLAY_MELODY', 'Play specific melody'),
            ('PLAY_DURATION', 'Play sound for a specific duration'),
        ],
    }


    def get_output_action_choices(self):
        if self.output_device:
            return self.INPUT_ACTION_CHOICES.get(self.output_device, [])
        else:
            return []

    output_action = models.CharField(max_length=90, choices=get_output_action_choices)


    # output_action = models.CharField(max_length=40, choices=OUTPUT_DEVICE_CHOICES[output_device])

    # code is a path to the file that contains the code for the project
    code = models.CharField(max_length=100, null=True, blank=True)