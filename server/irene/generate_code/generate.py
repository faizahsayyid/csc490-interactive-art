# Note I have not implemented the PIN flexibility yet,
# but it can be easily added by passing the pin number as an argument to the function later
def load_template(template_filename):
    try:
        with open(template_filename, 'r') as f:
            template = f.read()
        return template
    
    # Not e this should never be called, as only existing device-action pair should be passed
    except FileNotFoundError:
        print(f"No template found for input action: {template_filename}")
        return None


def generate_arduino_code(input_device, input_action, output_device, output_action):
    """
    Generates Arduino code based on the input and output actions.
    
    Args:
        input_device (str): The input device that triggers the action.
        input_action (str): The action that triggers the output action.
        output_device (str): The output device that should be controlled.
        output_action (str): The action that should be triggered.
    """
    input_code_path = f'templates/input/{input_device}/{input_action}.ino'
    output_code_path = f'templates/output/{output_device}/{output_action}.ino'
    action_completed_code_path = f'templates/output/{output_device}/action_completed/{output_action}.ino'

    input_code = load_template(input_code_path)
    output_code = load_template(output_code_path)
    action_completed_code = load_template(action_completed_code_path)
    if input_code is None or output_code is None:
        # Should never be called, as only existing device-action pair should be passed
        return None

    arduino_code = input_code.replace('OUTPUT_ACTION_CODE', output_code)

    if action_completed_code:
        arduino_code = arduino_code.replace('ACTION_COMPLETED_CODE', action_completed_code)
    else:
        # Do nothing if there is no action completed code specified
        arduino_code = arduino_code.replace('ACTION_COMPLETED_CODE', '')
    
    return arduino_code

def write_to_file(code, filename):
    with open(filename, 'w') as f:
        f.write(code)

# Example input and output actions
input_device = "BUTTON"
input_action = "PUSHED"
output_device = "LED"
output_action = "BLINK_ON"

# Generate Arduino code
arduino_code = generate_arduino_code(input_device, input_action, output_device, output_action)

if arduino_code:
    # Write code to a file
    write_to_file(arduino_code, 'generated_code.ino')