from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils.action import Program, InputAction, OutputAction

# ENDPOINT: projects/<int: project_id>/generate_program
@csrf_exempt
def generate_program(request, project_id):
    """
    Generate a program based on the input and output actions.
    
    For INPUT_ACTION and OUTPUT_ACTION, the following actions are available:
    - INPUT_ACTION: "ON", "OFF", "CHANGED", "DOUBLE_TRIGGERED", "HOLD"
    - OUTPUT_ACTION: "ON", "OFF", "TOGGLE", "BLINK"

    Additionally, the following arguments can be passed to the actions:
    """
    if request.method == 'POST':
        data = json.loads(request.body)

        # INPUT
        # Parse input action data
        # Possible values:
            # action: "ON", "OFF", "CHANGED", "DOUBLE_TRIGGERED", "HOLD"
        input_action_data = data.get('input_action', {})
        input_action = InputAction(input_action_data['action'])

        # Set input action arguments (all optional)
        # set_pin, set_duration, 
        # set_input_reading_delay, set_debounce_delay
        for key, value in input_action_data.get('args', {}).items():
            setattr(input_action, f"set_{key}", value)

        # OUTPUT
        # Parse output action data
        # Possible values:
            # action: "ON", "OFF", "TOGGLE", "BLINK"
            # after_action: "NONE", "HIGH", "LOW", "RESTORE_BACK"
        output_action_data = data.get('output_action', {})
        output_action = OutputAction(output_action_data['action', 'after_action'])

        # Set output action arguments (all optional)
        # set_pin, set_duration

        # BLINK only arguments (all optional)
        # set_on_for, set_next_on_delay
        for key, value in output_action_data.get('args', {}).items():
            setattr(output_action, f"set_{key}", value)

        # Create Program instance
        program = Program(input_action, output_action)

        return JsonResponse({'program': str(program)})

    return JsonResponse({'error': 'Invalid request method'}, status=405)


# ENDPOINT: projects/<int: project_id>/upload_program
@csrf_exempt
def upload_program(request, project_id):
    """
    Upload a program to the Arduino board.
    """
    if request.method == 'POST':
        project_id = request.POST.get('project_id')

        # Get the program by project ID
        try:
            program = Program.objects.get(project_id=project_id)
        except Program.DoesNotExist:
            return JsonResponse({'error': 'Program not found'}, status=404)

        # Upload the program
        program.upload()

        return JsonResponse({'success': 'Program uploaded'})

    return JsonResponse({'error': 'Invalid request method'}, status=405)
