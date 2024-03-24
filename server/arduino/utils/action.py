from ino_code_ds import inoCodeDataStructure


# Ignore this class for now
# Action.after_action
# class AfterAction(str):
#     """
#     Enum for the action that is triggered after the main action is done

#     NONE: No action after the main action; i.e., the output pin will stay in the same state
#     HIGH: The output pin will be set to HIGH after the main action is done
#     LOW: The output pin will be set to LOW after the main action is done
#     RESTORE_BACK: The output pin will be restored back to the previous state after the main action is done
#     """
#     NONE = "NONE"
#     HIGH = "HIGH"
#     LOW = "LOW"
#     RESTORE_BACK = "RESTORE_BACK"

#     def __str__(self):
#         if self == AfterAction.NONE:
#             return "NONE"
#         elif self == AfterAction.HIGH:
#             return "HIGH"
#         elif self == AfterAction.LOW:
#             return "LOW"
#         elif self == AfterAction.RESTORE_BACK:
#             return "RESTORE_BACK"

class Action(object):
    """
    This is the class that represents an action

    Attributes:
        action (str): The action that is triggered
        args (dict): The arguments that are passed to the action

    """
    action: str
    args: dict

    def __init__(self, action):
        """
        (INPUT, OUTPUT)
        Initializes the action with the action

        Args:
            action (str): The main input/output action that is triggered
        """
        self.action = action
        self.args = {}
    
    def set_pin(self, pin):
        """
        (INPUT, OUTPUT)
        Sets the pin for the action

        If the pin is not specified, the default pin is used, which is 2 for input and 9 for output
        """
        self.args['pin'] = pin
    
    def set_duration(self, duration):
        """
        (INPUT, OUTPUT)
        Sets the duration for the action
        
        - For INPUT, 
        - the duration is the time that the input should be considered as the action
        (e.g., 
        the time that the button should be pressed for the action to be triggered,
        the time that the button should be pressed for the second time in the double-click action, etc.)

        - For OUTPUT,
        - the duration is the time that the output should be in the action state

        - If the duration is not specified, the default duration is used, which is 1000ms"""
        self.args['duration'] = duration
    
    def __str__(self):
        """ 
        (INPUT, OUTPUT)
        Returns a string representation of the action
        """
        return self.action + "(" + str(self.args) + ")"


# InputAction class that inherits from Action
class InputAction(Action):
    """
    This is the class that represents an input action

    Along with pin and duration, this class also allows 
    - setting the input_reading_delay for all the input action
    - setting the debounce delay for the double-triggered action

    Note:
      generate_code() method is not implemented for the InputAction class, as
      the input codes are more complex and thus are handled by the Program class
    """
    def set_input_reading_delay(self, input_reading_delay):
        """
        (INPUT)
        Sets the delay for the 

        If the delay is not specified, the default delay is used, which is 100ms
        """
        self.args['input_reading_delay'] = input_reading_delay

    def set_debounce_delay(self, debounce_delay):
        """
        (INPUT - DOUBLE_TRIGGERED)
        Sets the debounce delay for the double click action
        """
        self.args['debounce_delay'] = debounce_delay


# OutputAction class that inherits from Action
class OutputAction(Action):
    """
    This is the class that represents an output action
    
    Along with pin and duration, this class also allows:
    - setting the next_on_delay for the blink action
    - setting the on_for for the blink action

    Attributes:
        after_action (str): The action that is triggered after the main action is done
                            Possible values: "NONE", "HIGH", "LOW", "RESTORE_BACK"
    
    Note:
      generate_code() method is implemented for the OutputAction class, as
      the output codes are simple and can be handled by the OutputAction class
    
    """
    after_action: str

    def __init__(self, action, after_action="NONE"):
        """
        Initializes the action with the action and the after_action

        Args:
            action (str): The main action that is performed as the output action
            after_action (str): The action that is triggered after the main action is done

        Note:
            - The after_action is set to "NONE" by default if not specified
            - The args is an empty dictionary by default
        """
        super().__init__(action, after_action)
        self.after_action = after_action

    def set_next_on_delay(self, next_on_delay):
        """
        (OUTPUT - BLINK)
        Sets the delay between the next on state in the blink action
        """
        self.args['next_on_delay'] = next_on_delay
    
    def set_on_for(self, on_for):
        """
        (OUTPUT - BLINK)
        Sets the duration for the on state in the blink action
        """
        self.args['on_for'] = on_for

    def generate_code(self):
        """
        (OUTPUT)
        Returns the list of strings of the code that should be generated for the action

        Note this is a helper function that is used by the Program class to generate the output action code for the program
        """
        result = []

        # 0. Save the current state of the output pin
        result.append("int outputState = digitalRead(OUTPUT_PIN);")

        # 1. Generate the code based on the action
        if self.action == "ON":
            result.append("digitalWrite(OUTPUT_PIN, HIGH);")

        elif self.action == "OFF":
            result.append("digitalWrite(OUTPUT_PIN, LOW);")

        elif self.action == "TOGGLE":
            result.append("digitalWrite(OUTPUT_PIN, !digitalRead(OUTPUT_PIN));")
        
        else:
            pass
        
        # 2. Generate the code based on the after_action
        # If the after_action is not NONE, generate the code for the after_action
        if self.after_action != "NONE":
            if self.action == "BLINK":
                # If the action is BLINK, then the action should be repeated during the duration
                on_for = "OUTPUT_DURATION / 2" if self.args.get('on_for') is None else self.args['on_for']
                next_on_delay = "OUTPUT_DURATION / 2" if self.args.get('next_on_delay') is None else self.args['next_on_delay']
                result.append("blinkStartTime = millis();")
                result.append("blinkEndTime = blinkStartTime + OUTPUT_DURATION;")
                result.append({"while (millis() < blinkEndTime) {": [
                                "digitalWrite(OUTPUT_PIN, HIGH);",
                                f"delay({on_for});",
                                "digitalWrite(OUTPUT_PIN, LOW);",
                                f"delay({next_on_delay});"   
                ]})
            else:
                # In other cases, the status should remain for the duration
                result.append("delay(OUTPUT_DURATION);")

            if self.after_action == "HIGH":
                result.append("digitalWrite(OUTPUT_PIN, HIGH);")

            elif self.after_action == "LOW":
                result.append("digitalWrite(OUTPUT_PIN, LOW);")

            elif self.after_action == "RESTORE_BACK":
                result.append("digitalWrite(OUTPUT_PIN, outputState);")

        return result
            
# Program class
class Program(object):
    """
    This is the class that represents a program that is generated based on the input and output actions

    Attributes:
        input_action (Action): The input action that triggers the output action
        output_action (Action): The output action that is triggered
        args (dict): The arguments that are passed to the program, based on the input and output actions
        code (inoCodeDataStructure): The code that is generated for the program
    """
    input_action: InputAction
    output_action: OutputAction
    args: dict
    code: inoCodeDataStructure

    def __init__(self, input_action, output_action):
        self.input_action = input_action
        self.output_action = output_action
        self.code = None
        self.args = {
            # If the pin is not specified, default to 2 for input and 9 for output
            'input_pin': '2' if input_action.args.get('pin') is None else input_action.args['pin'],
            'output_pin': '9' if output_action.args.get('pin') is None else output_action.args['pin'],
            'input_reading_delay': '100' if input_action.args.get('input_reading_delay') is None else input_action.args['input_reading_delay'],
            'input_duration': '1000' if input_action.args.get('duration') is None else input_action.args['duration'],
            'output_duration': '1000' if output_action.args.get('duration') is None else output_action.args['duration']
        }

    def _generate_code(self):
        """
        If self.code is not exists, generates code for the program and stores it in self.code,
        based on the input and output actions.
        """
        if self.code is None:
            self.code = inoCodeDataStructure()

            # Add the necessary global macros + variables
            self.code.globals.append("#define INPUT_PIN " + self.args['input_pin'])
            self.code.globals.append("#define OUTPUT_PIN " + self.args['output_pin'])
            self.code.globals.append("#define INPUT_READING_DELAY " + self.args['input_reading_delay'])
            self.code.globals.append("#define INPUT_DURATION " + self.args['input_duration'])
            self.code.globals.append("#define OUTPUT_DURATION " + self.args['output_duration'])

            self.code.globals.append("int inputState = 0;")
            self.code.globals.append("int prevInputState = 0;")

            if self.input_action.action == "HOLD":
                self.code.globals.append("unsigned long lastPressedTime = 0;")

            if self.input_action.action == "DOUBLE_TRIGGERED":
                self.code.globals.append("unsigned long lastFirstClickTime = 0;")
                if self.input_action.args.get('debounce_delay') is None:
                    self.code.globals.append("unsigned long debounceDelay = 50;")
                else:
                    self.code.globals.append(f"unsigned long debounceDelay = {self.input_action.args['debounce_delay']};")

            self.code.setup.append("pinMode(INPUT_PIN, INPUT);")
            self.code.setup.append("pinMode(OUTPUT_PIN, OUTPUT);")

            self.code.loop.append("inputState = digitalRead(INPUT_PIN);")

            # Input: ON
            if self.input_action.action == "ON":
                self.code.loop.append(
                    {
                        "if (inputState == HIGH)":
                            self.output_action.generate_code()
                    }
                )

            # Input: OFF
            if self.input_action.action == "OFF":
                self.code.loop.append(
                    {
                        "if (inputState == LOW)":
                            self.output_action.generate_code()
                    }
                )

            # Input: CHANGED
            elif self.input_action.action == "CHANGED":
                self.code.loop.append(
                    {
                        "if (inputState != prevInputState)":
                            self.output_action.generate_code()
                    }
                )

            # Input: DOUBLE_TRIGGERED (Double click)
            # I know we can use prevState without using these variables but will fix it later as it gets confusing...
            elif self.input_action.action == "DOUBLE_TRIGGERED":
                self.code.loop.append(
                    {
                        "if (inputState == HIGH)":
                            {
                                # if there was no first click
                                "if (!lastFirstClickTime)":
                                    [
                                        "lastFirstClickTime = millis();",
                                        "inputState = LOW;",
                                    ],
                                # elif there was a first click and the time between the first click and the second click is less than the input duration(the time that we will consider as a double click)
                                "else":
                                    [
                                        "unsigned long lastSecondClickTime = millis();",
                                        {
                                        # Check if it's not bounce and within the range of the input duration
                                        "if (lastSecondClickTime - lastFirstClickTime <= INPUT_DURATION && lastSecondClickTime - lastFirstClickTime > debounceDelay)":
                                            self.output_action.generate_code(),
                                        },
                                        "lastFirstClickTime = 0;"

                                    ],
                            }
                    }
                
                )

            # Input: HOLD (Long press)
            elif self.input_action.action == "HOLD":
                self.code.loop.append(
                    {
                        "if (inputState == HIGH)":
                            {
                                "if (millis() - lastPressedTime > INPUT_DURATION)":
                                    self.output_action.generate_code()

                            }
                    }
                )
                
            
            # For general input actions, every loop should end with:
            # 1. updating the previous state and 
            # 2. delaying for the next input reading
            self.code.loop.append("prevInputState = inputState;")
            self.code.loop.append("delay(INPUT_READING_DELAY);")
           
        pass

    def upload(self):
        """
        Uploads the code to the arduino
        """
        self._generate_code()
        self.code.upload()
    
    def __str__(self):
        """
        Returns a string representation of the program
        """
        return f"Input: {self.input_action}\n" + \
                f"Output: {self.output_action}\n" + \
                f"Code:\n" + \
                f"{self.code}"