from ino_code_ds import inoCodeDataStructure
from typing import Optional

class Action(object):
    """
    This is the class that represents an action

    Attributes:
        action (str): The action that is triggered
        duration (int): The duration for the action
    
    Note:
        # pin (int): The pin that the device of the action is connected to
        # Note pin attributes is not implemented in Action but in subclasses
        # This is to set different default values for the pin for the input and output actions
        # (e.g., 2 for input and 9 for output)

    """
    action: str

    def __init__(self, action):
        """
        (INPUT, OUTPUT)
        Initializes the action with the action

        Args:
            action (str): The main input/output action that is triggered
        """
        self.action = action
        self.duration = 1000
    
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
        self.duration = duration
    
    def __str__(self):
        """ 
        (INPUT, OUTPUT)
        Returns a string representation of the action
        """
        return self.action + f"\n(pin:" + str(self.pin) + ", duration:" + str(self.duration) + ")"


# InputAction class that inherits from Action
class InputAction(Action):
    """
    This is the class that represents an input action

    Along with pin and duration, this class also allows 
    - setting the input_reading_delay for all the input action
    - setting the debounce delay for the double-triggered action

    Attributes:
        pin (int): The pin that the device of the action is connected to (default: 2)
        input_reading_delay (int): The delay for reading the input pin
        debounce_delay (int): The debounce delay for the double click action

    Note:
      generate_code() method is not implemented for the InputAction class, as
      the input codes are more complex and thus are handled by the Program class
    """
    pin: int
    input_reading_delay: int
    debounce_delay: Optional[int]

    def __init__(self, action):
        """
        Initializes the action with the action

        Args:
            action (str): The main input action that would trigger the output action in the program

        Note:
            - The args is an empty dictionary by default
        """
        super().__init__(action)
        self.pin = 2
        self.input_reading_delay = 50
        self.debounce_delay = None if action != "DOUBLE_TRIGGERED" else 50

    def set_pin(self, pin):
        """
        (INPUT)
        Sets the pin for the input action
        """
        self.pin = pin

    def set_input_reading_delay(self, input_reading_delay):
        """
        (INPUT)
        Sets the delay for the 

        If the delay is not specified, the default delay is used, which is 100ms
        """
        self.input_reading_delay = input_reading_delay

    def set_debounce_delay(self, debounce_delay):
        """
        (INPUT - DOUBLE_TRIGGERED)
        Sets the debounce delay for the double click action
        """
        self.debounce_delay = debounce_delay


# OutputAction class that inherits from Action
class OutputAction(Action):
    """
    This is the class that represents an output action
    
    Along with pin and duration, this class also allows:
    - setting the off_duration for the blink action
    - setting the on_duration for the blink action

    Attributes:
        pin (int): The pin that the device of the action is connected to (default: 9)
        after_action (str): The action that is triggered after the main action is done
                            Possible values: "NONE", "HIGH", "LOW", "RESTORE_BACK"
        off_duration (str): The duration for the off state in one blink (string representation of the duration)
        on_duration (str): The duration for the on state in one blink (string representation of the duration)
    
    Note:
      - generate_code() method is implemented for the OutputAction class, as
        the output codes are simple and can be handled by the OutputAction class
    
    """
    pin: int
    after_action: str
    off_duration: Optional[str]
    on_duration: Optional[str]


    def __init__(self, action, after_action="NONE"):
        """
        Initializes the action with the action and the after_action

        Args:
            action (str): The main action that is performed as the output action
            after_action (str): The action that is triggered after the main action is done
            - BLINK specific attributes:
                on_duration (str): The duration for the on state in one blink
                off_duration (str): The duration for the off state in one blink
                (default: None for both for non-BLINK actions, and 
                         "OUTPUT_DURATION / 2" for both for BLINK actions)

        Note:
            - The after_action is set to "NONE" by default if not specified
            - The args is an empty dictionary by default
        """
        super().__init__(action, after_action="NONE")
        self.pin = 9
        self.after_action = after_action
        self.on_duration = None if action != "BLINK" else "OUTPUT_DURATION / 2"
        self.off_duration = None if action != "BLINK" else "OUTPUT_DURATION / 2"
    
    def set_pin(self, pin):
        """
        (OUTPUT)
        Sets the pin for the output action
        """
        self.pin = pin

    def set_off_duration(self, off_duration: int):
        """
        (OUTPUT - BLINK)
        Sets the duration for the off state in one blink
        """
        if self.action != "BLINK":
            return
        self.off_duration = str(off_duration)
    
    def set_on_duration(self, on_duration: int):
        """
        (OUTPUT - BLINK)
        Sets the duration for the on state in one blink
        """
        if self.action != "BLINK":
            return
        self.on_duration = str(on_duration)

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
                result.append("blinkStartTime = millis();")
                result.append("blinkEndTime = blinkStartTime + OUTPUT_DURATION;")
                result.append({"while (millis() < blinkEndTime) {": [
                                "digitalWrite(OUTPUT_PIN, HIGH);",
                                f"delay({self.on_duration});",
                                "digitalWrite(OUTPUT_PIN, LOW);",
                                f"delay({self.off_duration});"   
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
        code (inoCodeDataStructure): The code that is generated for the program
    """
    input_action: InputAction
    output_action: OutputAction
    code: inoCodeDataStructure

    def __init__(self, input_action, output_action):
        """
        Initializes the program with the input and output actions.

        Note:
        - code is not generated until the generate_code() method is called.

        """
        self.input_action = input_action
        self.output_action = output_action
        self.code = None

    def _generate_code(self):
        """
        If self.code is not exists, generates code for the program and stores it in self.code,
        based on the input and output actions.
        """
        if self.code is None:
            self.code = inoCodeDataStructure()

            # Add the necessary global macros + variables
            self.code.globals.append("#define INPUT_PIN " + str(self.input_action.pin))
            self.code.globals.append("#define OUTPUT_PIN " + str(self.output_action.pin))
            self.code.globals.append("#define INPUT_READING_DELAY " + str(self.input_action.input_reading_delay))
            self.code.globals.append("#define INPUT_DURATION " + str(self.input_duration))
            self.code.globals.append("#define OUTPUT_DURATION " + str(self.output_duration))

            self.code.globals.append("int inputState = 0;")
            self.code.globals.append("int prevInputState = 0;")

            if self.input_action.action == "HOLD":
                self.code.globals.append("unsigned long lastPressedTime = 0;")

            if self.input_action.action == "DOUBLE_TRIGGERED":
                self.code.globals.append("unsigned long lastFirstClickTime = 0;")
                self.code.globals.append(f"unsigned long debounceDelay = {str(self.input_action.debounce_delay)};")

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
           
        return None

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