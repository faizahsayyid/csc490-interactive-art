class Actions:
    def __init__(self):
        # REQUIRED: All methods must return a tuple with len 3 as follows: (global_code: list, setup_code: list, loop_code: list)
        # REQUIRED: All methods must be added to self.actions, with a key that is the method name string
        self.actions = {
            "negate_output_on_input": self.__negate_output_on_input_activation,
            "demo": self.__demo,
        }

    def __demo(self, input_pin, output_pin, delay) -> tuple[list, list, list]:
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        delay = str(delay)
        return ([], [], [
            f"digitalWrite({output_pin}, HIGH);",
            f"delay({delay});",
            f"digitalWrite({output_pin}, LOW);",
            f"delay({delay});",
        ])

    def __negate_output_on_input_activation(self, input_pin: int, output_pin: int, delay: int) -> tuple[list, list, list]:
        """
        Negates the output pin when the input pin is activated
        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        delay = str(delay)
        return ([], [], [
            f"int inputState = digitalRead({input_pin});",
            {
                "if (inputState == HIGH)": [
                    f"int outputState = digitalRead({output_pin});",
                    f"digitalWrite({output_pin}, !outputState);",
                ]
            },
            f"delay({delay});",
        ])

    def get_action_code(self, action_key, *args, **kwargs):
        """
        Method to interact with the Actions class, and get the code for a specific action

        :param action_key: Key of the action to be performed, defined in self.actions
        :return: Tuple with len 3 as follows: (global_code: list, setup_code: list, loop_code: list)
                    Each list contains the code to be added to the respective block in the Arduino code
        """
        ret = self.actions[action_key](*args, **kwargs)
        assert isinstance(ret, tuple) and len(ret) == 3 and all(isinstance(x, list) for x in ret)
        return ret
