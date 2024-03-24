class Actions:
    def __init__(self):
        """
        All functions return a tuple: (global_code, setup_code, loop_code)
        """
        self.actions = {
            "negate_output_on_input": self.__negate_output_on_input_activation
        }

    def __negate_output_on_input_activation(self, input_pin, output_pin, delay) -> tuple[list, list, list]:
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
            f"delay({delay})",
        ])

    def get_action_code(self, action_key, *args, **kwargs):
        return self.actions[action_key](*args, **kwargs)
