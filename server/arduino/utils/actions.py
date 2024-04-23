import inspect
from typing import Dict, Optional, Type, Union, List


class Actions:
    def __init__(self):
        # REQUIRED: All methods must return a tuple with len 3 as follows: (global_code: list, setup_code: list, loop_code: list)
        # REQUIRED: All methods must be added to self.actions, with a key that is the method name string
        self.actions = {
            "negate_output_on_input": self.__negate_output_on_input_activation,
            "demo": self.__demo,
            "blink_on_input_activation": self.__blink_on_input_activation,
            "negate_output_on_double_click": self.__negate_output_on_double_click,
            "negate_output_on_hold": self.__negate_output_on_hold,
            "blink_on_hold": self.__blink_on_hold,
            "blink_on_double_click": self.__blink_on_double_click,
            "fade_in_out": self.__fade_in_out,
            "blink": self.__blink,
            "led_strip_on_input_activation": self.__led_strip_on_input_activation,
        }

        # TODO: Make sure all actions make sense
        self.input_device_actions = {
            "button": [
                "negate_output_on_input",
                "blink_on_input_activation",
                "negate_output_on_double_click",
                "negate_output_on_hold",
                "blink_on_hold",
                "blink_on_double_click",
                "led_strip_on_input_activation",
            ],
            "light_sensor": [
                "negate_output_on_input",
                "blink_on_input_activation",
                "negate_output_on_double_click",
                "negate_output_on_hold",
                "blink_on_hold",
                "blink_on_double_click",
                "led_strip_on_input_activation",
            ],
            "audio_sensor": [
                "negate_output_on_input",
                "blink_on_input_activation",
                "negate_output_on_double_click",
                "negate_output_on_hold",
                "blink_on_hold",
                "blink_on_double_click",
                "led_strip_on_input_activation",
            ],
            "motion_sensor": [
                "negate_output_on_input",
                "blink_on_input_activation",
                "negate_output_on_double_click",
                "negate_output_on_hold",
                "blink_on_hold",
                "blink_on_double_click",
                "led_strip_on_input_activation",
            ],
        }

        # TODO: Currently temporary actions for simplicity
        self.output_device_actions = {
            "led": {
                "input": ["negate_output_on_input"],
                "no input": ["fade_in_out", "blink"],
            },
            "led_strip": {
                "input": ["motion_sense_to_led_strip"],
                "no input": [],
            },
            "speaker": [],
            "motor": [],
            "zip_servo": [],
        }

    # ========================================================================================
    # ==================================== ACTION METHODS ===========================================

    def __fade_in_out(self, output_pin: int, fade_duration: int = -1) -> tuple[list, list, list]:
        """
        Repeat fading the output pin in and out (without input pin activation) for a certain duration or forever if not specified

        :param output_pin: The pin number of the output pin
        :param fade_duration: The duration to fade in and out for, if not specified, it will fade in and out forever
        """
        output_pin = str(output_pin)
        fade_duration = str(fade_duration)
        return (
            [],
            [],
            [
                f"int outputPin = {output_pin};",
                f"int brightness = 0;",
                f"int fadeAmount = 5;",
                f"unsigned long startTime = millis();",
                {
                    f"while (millis() - startTime < {fade_duration} || {fade_duration} == -1):": [
                        f"analogWrite(outputPin, brightness);",
                        f"brightness = brightness + fadeAmount;",
                        {
                            "if (brightness == 0 || brightness == 255)": [
                                f"fadeAmount = -fadeAmount;",
                            ]
                        },
                        f"delay(30);",
                    ]
                },
            ],
        )

    def __blink(self, output_pin: int, blink_duration: int = -1) -> tuple[list, list, list]:
        """
        Blinks the output pin for a duration or forever if not specified

        :param output_pin: The pin number of the output pin
        :param blink_duration: The duration to blink the output pin for, if not specified, it will blink forever
        """
        output_pin = str(output_pin)
        blink_duration = str(blink_duration)
        return (
            [],
            [],
            [
                f"int outputPin = {output_pin};",
                f"unsigned long startTime = millis();",
                {
                    f"while (millis() - startTime < {blink_duration} || {blink_duration} == -1):": [
                        f"digitalWrite(outputPin, HIGH);",
                        f"delay(100);",
                        f"digitalWrite(outputPin, LOW);",
                        f"delay(100);",
                    ]
                },
            ],
        )

    def __demo(self, input_pin, output_pin) -> tuple[list, list, list]:
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        delay = str(delay)
        return (
            [],
            [],
            [
                f"digitalWrite({output_pin}, HIGH);",
                f"delay({delay});",
                f"digitalWrite({output_pin}, LOW);",
                # f"delay({delay});",
            ],
        )

    # TODO: rm delay
    def __negate_output_on_input_activation(self, input_pin: int, output_pin: int, delay: int) -> tuple[list, list, list]:
        """
        Negates the output pin when the input pin is activated
        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        delay = str(delay)
        return (
            [],
            [],
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": [
                        f"int outputState = digitalRead({output_pin});",
                        f"digitalWrite({output_pin}, !outputState);",
                    ]
                },
                # f"delay({delay});",
            ],
        )

    def __blink_on_input_activation(
        self,
        input_pin: int,
        output_pin: int,
        blink_duration: int = 1000,
        after_action: int = 2,
    ) -> tuple[list, list, list]:
        """
        Blinks the output pin for a duration then sets it to after_action status(LOW if not specified)
        when the input pin is activated

        :param input_pin: The pin number of the input pin
        :param output_pin: The pin number of the output pin
        :param blink_duration: The duration to blink the output pin for
        :param after_action: The action to perform after the duration has passed (0: LOW, 1: HIGH, 2(default): previous state)
        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        blink_duration = str(blink_duration)
        after_action = "prevState" if after_action == 2 else "HIGH" if after_action == 1 else "LOW"
        return (
            [],
            [],
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": [
                        # Measure the time now
                        f"unsigned long startTime = millis();",
                        # Get the current state of the output pin
                        f"int prevState = digitalRead({output_pin});",
                        # Blink the output pin for the blink_duration
                        {
                            f"while (millis() - startTime < {blink_duration})": [
                                f"digitalWrite({output_pin}, HIGH);",
                                f"delay(100);",
                                f"digitalWrite({output_pin}, LOW);",
                                f"delay(100);",
                            ]
                        },
                        # Set the output pin to after_action after blinking
                        f"digitalWrite({output_pin}, {after_action});",
                    ]
                },
            ],
        )

    def __negate_output_on_double_click(self, input_pin: int, output_pin: int, second_click_time: int = 500) -> tuple[list, list, list]:
        """
        Negates the output pin when the input pin is double clicked

        :param input_pin: The pin number of the input pin
        :param output_pin: The pin number of the output pin
        :param second_click_time: The time to wait for the second click in milliseconds(default: 500)
        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        second_click_time = str(second_click_time)

        return (
            [],
            [],
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": [
                        f"int outputState = digitalRead({output_pin});",
                        f"digitalWrite({output_pin}, !outputState);",
                        # Wait till the input pin is released
                        f"while (digitalRead({input_pin}) == HIGH);",
                        # Wait for the second click
                        # Wait max(500ms) for the second click
                        f"unsigned long startTime = millis();",
                        f"while (millis() - startTime < {second_click_time} && digitalRead({input_pin}) == LOW);",
                        # If the input pin is still low, then it was a single click ==> do nothing
                        # Otherwise(input_pin is HIGH), it was a double click ==> negate the output pin
                        {
                            "if (digitalRead({input_pin}) == HIGH)": [
                                f"outputState = digitalRead({output_pin});",
                                f"digitalWrite({output_pin}, !outputState);",
                            ]
                        },
                    ]
                },
            ],
        )

    def __negate_output_on_hold(self, input_pin: int, output_pin: int, hold_time: int = 1000) -> tuple[list, list, list]:
        """
        Negates the output pin when the input pin is held for a certain time

        :param input_pin: The pin number of the input pin
        :param output_pin: The pin number of the output pin
        :param hold_time: The time to wait for the input pin to be held in milliseconds(default: 1000)
        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        hold_time = str(hold_time)

        return (
            [],
            [],
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": [
                        f"unsigned long startTime = millis();",
                        f"while (millis() - startTime < {hold_time} && digitalRead({input_pin}) == HIGH);",
                        {
                            "if (digitalRead({input_pin}) == LOW)": [
                                f"int outputState = digitalRead({output_pin});",
                                f"digitalWrite({output_pin}, !outputState);",
                            ]
                        },
                    ]
                },
            ],
        )

    def __blink_on_hold(
        self,
        input_pin: int,
        output_pin: int,
        hold_time: int = 1000,
        blink_duration: int = 1000,
        after_action: int = 2,
    ) -> tuple[list, list, list]:
        """
        Blinks the output pin for a duration then sets it to after_action status(LOW if not specified)
        when the input pin is held for a certain time

        :param input_pin: The pin number of the input pin
        :param output_pin: The pin number of the output pin
        :param hold_time: The time to wait for the input pin to be held in milliseconds(default: 1000)
        :param blink_duration: The duration to blink the output pin for
        :param after_action: The action to perform after the duration has passed (0: LOW, 1: HIGH, 2(default): previous state)

        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        hold_time = str(hold_time)
        blink_duration = str(blink_duration)
        after_action = "prevState" if after_action == 2 else "HIGH" if after_action == 1 else "LOW"

        return (
            [],
            [],
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": [
                        f"unsigned long startTime = millis();",
                        f"while (millis() - startTime < {hold_time} && digitalRead({input_pin}) == HIGH);",
                        {
                            "if (digitalRead({input_pin}) == LOW)": [
                                f"int prevState = digitalRead({output_pin});",
                                {
                                    f"while (millis() - startTime < {blink_duration}):": [
                                        f"digitalWrite({output_pin}, HIGH);",
                                        f"delay(100);",
                                        f"digitalWrite({output_pin}, LOW);",
                                        f"delay(100);",
                                    ]
                                },
                                f"digitalWrite({output_pin}, {after_action});",
                            ]
                        },
                    ]
                },
            ],
        )

    def __blink_on_double_click(
        self,
        input_pin: int,
        output_pin: int,
        blink_duration: int = 1000,
        after_action: int = 2,
        second_click_time: int = 500,
    ) -> tuple[list, list, list]:
        """
        Blinks the output pin for a duration then sets it to after_action status(LOW if not specified)
        when the input pin is double clicked

        :param input_pin: The pin number of the input pin
        :param output_pin: The pin number of the output pin
        :param blink_duration: The duration to blink the output pin for
        :param after_action: The action to perform after the duration has passed (0: LOW, 1: HIGH, 2(default): previous state)
        :param second_click_time: The time to wait for the second click in milliseconds(default: 500)
        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)
        blink_duration = str(blink_duration)
        after_action = "prevState" if after_action == 2 else "HIGH" if after_action == 1 else "LOW"
        second_click_time = str(second_click_time)

        return (
            [],
            [],
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": [
                        f"int prevState = digitalRead({output_pin});",
                        f"unsigned long startTime = millis();",
                        f"while (millis() - startTime < {second_click_time} && digitalRead({input_pin}) == LOW);",
                        {
                            "if (digitalRead({input_pin}) == HIGH)": [
                                f"int outputState = digitalRead({output_pin});",
                                f"digitalWrite({output_pin}, !outputState);",
                                f"while (digitalRead({input_pin}) == HIGH);",
                                f"unsigned long startTime = millis();",
                                f"while (millis() - startTime < {blink_duration}):",
                                f"digitalWrite({output_pin}, HIGH);",
                                f"delay(100);",
                                f"digitalWrite({output_pin}, LOW);",
                                f"delay(100);",
                                f"digitalWrite({output_pin}, {after_action});",
                            ]
                        },
                    ]
                },
            ],
        )

    # MOTION SENSOR -> LED STRIP
    def __led_strip_on_input_activation(self, input_pin: int, output_pin: int, color: str = "White") -> tuple[list, list, list]:
        """
        Blinks the output pin for a duration then sets it to after_action status(LOW if not specified)
        when the input pin is double clicked

        :param input_pin: The pin number of the input pin
        :param output_pin: The pin number of the output pin

        """
        input_pin = str(input_pin)
        output_pin = str(output_pin)

        NUM_LEDS = 60
        CHIPSET = "WS2812B"
        COLOR_ORDER = "GRB"

        on_color = f"CRGB::White"
        black = "CRGB::Black"

        # helper function
        def setStripColor(color):
            return [{f"for(int i = 0; i < {NUM_LEDS}; i++)": [f"leds[i] = {color};"]}, "FastLED.show();", "delay(500);"]

        return (
            # global_code
            ["#include <FastLED.h>", f"CRGB leds[{NUM_LEDS}];"],
            # setup_code
            [
                f"FastLED.addLeds<{CHIPSET}, {output_pin}, {COLOR_ORDER}>(leds, {NUM_LEDS});",
                "Serial.begin(9600);"
            ],
            # loop_code
            [
                f"int inputState = digitalRead({input_pin});",
                {
                    "if (inputState == HIGH)": setStripColor(on_color),
                    
                },
                {
                    "else": setStripColor(black),
                },
            ],
        )

    # ========================================================================================

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

    def get_allowed_actions_for_input_output_combo(self, output_device: str, input_device=None) -> list:
        """
        Method to get the allowed actions for a specific input-output device combination

        :param input_device: The type of the input device
        :param output_device: The type of the output device
        :return: List of allowed actions for the input-output device combination
        """
        assert input_device in self.input_device_actions.keys() or input_device == None, f"Invalid input device: {input_device}"
        assert output_device in self.output_device_actions.keys(), f"Invalid output device: {output_device}"

        if not input_device:
            return self.output_device_actions[output_device]["no input"]

        else:
            allowed_output_actions = set(self.output_device_actions[output_device]["input"])
            allowed_input_actions = set(self.input_device_actions[input_device])
            return list(allowed_output_actions.intersection(allowed_input_actions))

    def get_arg_list_for_action(self, action_key: str) -> Dict[str, Optional[Type]]:
        """
        Method to get the dictionary of arguments and their types for a specific action.

        :param action_key: Key of the action to be performed, defined in self.actions
        :return: Dictionary where keys are argument names and values are their types
        """
        assert action_key in self.actions.keys(), f"Invalid action key: {action_key}"

        # Fetch the signature of the function mapped to the action_key
        func = self.actions[action_key]
        signature = inspect.signature(func)

        # Extract parameter names and types
        parameters = signature.parameters  # This is an OrderedDict of name: Parameter objects
        arg_types = {}
        for name, param in parameters.items():
            # Exclude 'self' if it's a method of a class
            if name == "self":
                continue
            # The annotation is inspect._empty if not specified; you can handle it as None or any other way
            type_hint = param.annotation if param.annotation != inspect.Parameter.empty else None
            arg_types[name] = type_hint

        return arg_types
