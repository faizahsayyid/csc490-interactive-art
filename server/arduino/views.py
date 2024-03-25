from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils.action import Program, InputAction, OutputAction
from .models import ProgramModel

# NOTE: keeping all validations + inputs here
# serializers.py would help some cleaner input gathering logics, but I thought to keep it all in one file for now
# to make it easier to understand the flow of the code.
# I can refactor it later if needed.

# NOTE: need of models
# I was not sure if we want to make the models for Project and Program yet, so I have not implemented it fully,
# but I can add it later if needed, after deciding on the structure of the models.

# Possible values for input and output actions, and after actions
INPUT_ACTIONS_CHOICES = [
    "ON",
    "OFF",
    "CHANGED",
    "DOUBLE_TRIGGERED",
    "HOLD",
]

OUTPUT_ACTIONS_CHOICES = [
    "ON",
    "OFF",
    "TOGGLE",
    "BLINK",
]

# Note after actions refer to the state of the output after the action is completed
AFTER_ACTIONS_CHOICES = [
    "NONE",
    "HIGH",
    "LOW",
    "RESTORE_BACK",
]


# ENDPOINT: /project/<int:project_id>/generate_program/
@csrf_exempt
def generate_program(request, project_id):
    """
    Generate a program based on the input and output actions.

    INPUT ACTION:
    - action: "ON", "OFF", "CHANGED", "DOUBLE_TRIGGERED", "HOLD"

    * Optional Arguments *
    (all integers representing pin number or milliseconds)
    - pin: The pin number to read the input from (default: 2)
    - duration: The duration of the action (default: 1000)
    - input_reading_delay: The delay between reading the input (default: 50)

    ** For DOUBLE_TRIGGERED action only **
    - debounce_delay: The debounce delay between the two triggers for DOUBLE_TRIGGERED action (default: 50 for DOUBLE_TRIGGERED action, None otherwise)


    OUTPUT ACTION:
    - action: "ON", "OFF", "TOGGLE", "BLINK"
    - after_action: "NONE", "HIGH", "LOW", "RESTORE_BACK"

    * Optional Arguments *
    (all integers representing pin number or milliseconds)
    - pin: The pin number to output the action to (default: 9)
    - duration: The duration of the action (default: 1000)

    ** For BLINK action only ** (default values are strings, but can be specified as integers)
    - on_duration: The duration for the off state in one blink (default(str): OUTPUT_DURATION / 2)
    - off_duration: The duration for the off state in one blink (default(str): OUTPUT_DURATION / 2)

    """

    if request.method == 'POST':
        data = json.loads(request.body)

        # INPUT
        # Parse input action data
        # Possible values:
            # action: "ON", "OFF", "CHANGED", "DOUBLE_TRIGGERED", "HOLD"
        input_action_data = data.get('input_action', {})

        if 'action' not in input_action_data:
            return JsonResponse({'error': 'Please specify an input action'}, status=400)
        if input_action_data['action'] not in INPUT_ACTIONS_CHOICES:
            return JsonResponse({'error': 'Invalid input action'}, status=400)

        input_action = InputAction(input_action_data['action'])
        
        # Set input action arguments (all optional)
        # pin, duration, 
        # input_reading_delay, debounce_delay
        if 'pin' in input_action_data:
            pin = input_action_data['pin']

            # if pin is not an integer or is not between 2 and 13
            if pin < 2 or pin > 13:
                return JsonResponse({'error': 'Invalid pin number. Please specify an integer between 0 and 13'}, status=400)
            
            input_action.set_pin(pin)

        if 'duration' in input_action_data:
            duration = input_action_data['duration']

            # if duration is not an integer or is not greater than 0
            if duration <= 0:
                return JsonResponse({'error': 'Invalid duration. Please specify an integer greater than 0'}, status=400)
            
            input_action.set_duration(input_action_data['duration'])

        if 'input_reading_delay' in input_action_data:

            # if input_reading_delay is not an integer or is not greater than 0
            if input_action_data['input_reading_delay'] <= 0:
                return JsonResponse({'error': 'Invalid input reading delay. Please specify an integer greater than 0'}, status=400)
            
            input_action.set_input_reading_delay(input_action_data['input_reading_delay'])
            
        if 'debounce_delay' in input_action_data:
            if input_action_data['action'] == 'DOUBLE_TRIGGERED':

                # if debounce_delay is not an integer or is not greater than 0
                if input_action_data['debounce_delay'] <= 0:
                    return JsonResponse({'error': 'Invalid debounce delay. Please specify an integer greater than 0'}, status=400)
                
                input_action.set_debounce_delay(input_action_data['debounce_delay'])

        # OUTPUT
        # Parse output action data
        # Possible values:
            # action: "ON", "OFF", "TOGGLE", "BLINK"
            # after_action: "NONE", "HIGH", "LOW", "RESTORE_BACK"
        output_action_data = data.get('output_action', {})

        if 'action' not in output_action_data:
            return JsonResponse({'error': 'Please specify an output action'}, status=400)
        if output_action_data['action'] not in OUTPUT_ACTIONS_CHOICES:
            return JsonResponse({'error': 'Invalid output action'}, status=400)
        if 'after_action' not in output_action_data:
            output_action = OutputAction(output_action_data['action'])
        elif output_action_data['after_action'] not in AFTER_ACTIONS_CHOICES:
            return JsonResponse({'error': 'Invalid after action'}, status=400)
        else:
            output_action = OutputAction(output_action_data['action'], output_action_data['after_action'])

        # Set output action arguments (all optional)
        # pin, duration

        # BLINK only arguments (all optional)
        # on_duration, off_duration
        if 'pin' in output_action_data:
            pin = output_action_data['pin']

            if pin < 2 or pin > 13:
                return JsonResponse({'error': 'Invalid pin number. Please specify an integer between 0 and 13'}, status=400)
            
            output_action.set_pin(pin)
        if 'duration' in output_action_data:
            if output_action_data['duration'] <= 0:
                return JsonResponse({'error': 'Invalid duration. Please specify an integer greater than 0'}, status=400)
            output_action.set_duration(output_action_data['duration'])

        if output_action_data['action'] == 'BLINK':
            if 'on_duration' in output_action_data:
                if output_action_data['on_duration'] <= 0:
                    return JsonResponse({'error': 'Invalid on duration. Please specify an integer greater than 0'}, status=400)
                output_action.set_on_duration(output_action_data['on_duration'])
            if 'off_duration' in output_action_data:
                if output_action_data['off_duration'] <= 0:
                    return JsonResponse({'error': 'Invalid off duration. Please specify an integer greater than 0'}, status=400)
                output_action.set_off_duration(output_action_data['off_duration'])

        # Save the program to the database
        program_model = ProgramModel(project_id=project_id)
        program = Program(input_action, output_action)
        program_model.set_program(program)
        program_model.save()

        return JsonResponse({'program': str(program)})

    return JsonResponse({'error': 'Invalid request method'}, status=405)


# ENDPOINT: /project/<int:project_id>/upload_program/
@csrf_exempt
def upload_program(request, project_id):
    """
    Upload a program to the Arduino board.
    """
    if request.method == 'POST':
        # Get the program by project ID
        try:
            # Sorry I will ask how to connec
            program_model = ProgramModel.objects.get(id=project_id)
        except Program.DoesNotExist:
            return JsonResponse({'error': 'Program does not exist'}, status=404)

        program_model.get_program().upload()

        return JsonResponse({'success': 'Program uploaded'})

    return JsonResponse({'error': 'Invalid request method'}, status=405)
