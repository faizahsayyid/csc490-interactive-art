from ino_code_ds import inoCodeDataStructure

class Action(object):
    """
    Attributes:
        # is_input (bool): True if the action is an input action, False if it is an output action
        # device (str): The device that the action is associated with
        action (str): The action that is triggered
    """
    # is_input: bool
    # device: str
    action: str
    args: dict
    restore_back: bool
    restore_delay: int

    def __init__(self, device, action, restore_back=False):
        # self.device = device
        self.action = action
        self.args = {}
        self.restore_back = restore_back
        self.restore_delay = 0 if not restore_back else 1000
    
    def set_pin(self, pin):
        self.args['pin'] = pin
    
    def set_read_delay(self, read_delay):
        self.args['read_delay'] = read_delay
    
    def set_duration(self, duration):
        self.args['duration'] = duration

    def set_debounce(self, debounce):
        self.args['debounce'] = debounce

    def __str__(self):
        """ 
        Returns a string in a format
        # [INPUT/OUTPUT]<self.device>: <self.action>
        """
        return self.action

    def __eq__(self, other):
        return self.is_input == other.is_input and self.device == other.device and self.action == other.action
    
    # generate action specific code (output action)
    def generate_code(self):
        """
        Returns the list of strings of the code that should be generated for the action
        """
        result = []
        # Save the current state of the output pin
        result.append("int outputState = digitalRead(OUTPUT_PIN);")
        # Generate the code based on the action
        if self.action == "ON":
            result.append("digitalWrite(OUTPUT_PIN, HIGH);")
        elif self.action == "OFF":
            result.append("digitalWrite(OUTPUT_PIN, LOW);")
        elif self.action == "TOGGLE":
            result.append("digitalWrite(OUTPUT_PIN, !digitalRead(OUTPUT_PIN));")
        else:
            result.append(f"// Unsupported action: {self.action}")
        if self.restore_back:
            result.append(f"delay({str(self.restore_delay)});")
            result.append("digitalWrite(OUTPUT_PIN, outputState);")
        return result
            

    

class Program(object):
    """
    Attributes:
        input_action (Action): The input action that triggers the output action
        output_action (Action): The output action that is triggered
        code (inoCodeDataStructure): The code that is generated for the program
    """
    input_action: Action
    output_action: Action
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
            'read_delay': '100' if input_action.args.get('read_delay') is None else input_action.args['read_delay'],
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
            self.code.globals.append("#define INPUT_PIN " + self.args['input_pin'])
            self.code.globals.append("#define OUTPUT_PIN " + self.args['output_pin'])
            self.code.globals.append("#define READ_DELAY " + self.args['read_delay'])
            self.code.globals.append("#define INPUT_DURATION " + self.args['input_duration'])
            self.code.globals.append("#define OUTPUT_DURATION " + self.args['output_duration'])

            self.code.globals.append("int inputState = 0;")
            self.code.globals.append("int prevInputState = 0;")

            if self.input_action.action == "LONG_PRESSED":
                self.code.globals.append("unsigned long lastPressedTime = 0;")

            if self.input_action.action == "DOUBLE_CLICKED":
                self.code.globals.append("unsigned long lastFirstClickTime = 0;")
                if self.input_action.args.get('debounce') is None:
                    self.code.globals.append("unsigned long debounceDelay = 50;")
                else:
                    self.code.globals.append(f"unsigned long debounceDelay = {self.input_action.args['debounce']};")

            self.code.setup.append("pinMode(INPUT_PIN, INPUT);")
            self.code.setup.append("pinMode(OUTPUT_PIN, OUTPUT);")

            self.code.loop.append("inputState = digitalRead(INPUT_PIN);")

            # Placeholder for general input actions
            # self.code.loop.append(
            #         {
            #             "if (inputState != prevInputState)": []
            #         }
            # )

            # PUSHED
            if self.input_action.action == "PUSHED":
                self.code.loop.append(
                    {
                        "if (inputState == HIGH)":
                            self.output_action.generate_code()
                    }
                )
            
            # CHANGED
            elif self.input_action.action == "CHANGED":
                self.code.loop.append(
                    {
                        "if (inputState != prevInputState)":
                            self.output_action.generate_code()
                    }
                )

            # DOUBLE CLICKED
            # I know we can use prevState without using these variables but will fix it later as it gets confusing...
            elif self.input_action.action == "DOUBLE_CLICKED":
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

            # LONG_PRESSED
            elif self.input_action.action == "LONG_PRESSED":
                self.code.loop.append(
                    {
                        "if (inputState == HIGH)":
                            {
                                "if (millis() - lastPressedTime > INPUT_DURATION)":
                                    self.output_action.generate_code()

                            }
                    }
                )
                
            
            # For general input actions, every loop should end with updating the previous state and delaying
            self.code.loop.append("prevInputState = inputState;")
            self.code.loop.append("delay(READ_DELAY);")
           
        pass


    def upload(self):
        self._generate_code()
        self.code.upload()
    
    def __str__(self):
        return f"Input: {self.input_action}\nOutput: {self.output_action}\nCode:\n{self.code}"