from typing import List, Dict, Union, Any, Optional
import subprocess
import os
import serial
import serial.tools.list_ports
from arduino.utils.actions import Actions


class PortNotFoundError(Exception):
    def __init__(self):
        self.message = "No Arduino-compatible device found. Please connect your device."
        super().__init__(self.message)

class OutputDevice:
    def __init__(self, pin: int, input_device=None):
        assert 2 <= pin <= 13
        self.pin = pin
        self.input_device = input_device  # Type InputDevice

    def __hash__(self):
        return hash(self.pin)

    def __eq__(self, other):
        return self.pin == other.pin


class InputDevice:
    def __init__(self, pin: int, output_devices: Optional[list[OutputDevice]] = None):
        assert 2 <= pin <= 13
        self.pin = pin
        self.output_devices = output_devices

    def __hash__(self):
        return hash(self.pin)

    def __eq__(self, other):
        return self.pin == other.pin


class inoCodeDataStructure:

    def __init__(self):
        ### Code data structure ###
        self.setup: List[Union[Dict[list], str]] = []
        self.loop: List[Union[Dict[list], str]] = []
        self.setup_code = ""
        self.loop_code = ""
        self.globals = []

        ### Arduino upload parameters ###
        self.port = self.__find_port()
        # NANO
        self.board_type = "arduino:avr:nano"
        # MEGA
        # self.board_type = "arduino:avr:mega"
        self.file_name = "my_sketch.ino"

        ### Internal devices ###
        self.input_devices = set()
        self.output_devices = set()

        ### Actions ###
        self.actions = Actions()

    def __str__(self):
        """
        Turns the code data structure into a .ino file compatabile string
        """
        self.setup_code = ""
        setup_code = self.__format_code_block(self.setup, type="setup", depth=1)
        self.loop_code = ""
        loop_code = self.__format_code_block(self.loop, type="loop", depth=1)
        globals = "\n".join(self.globals)

        return f"""
{globals}

void setup() {{
{setup_code}
}}

void loop() {{
{loop_code}
}}
"""

    def __find_port(self):
        """
        Searches ports for devices typically used with Arduino (e.g., "CH340", "Arduino").

        :return: Detected port device path, or a default one if not found
        """
        ports = serial.tools.list_ports.comports()
        target_descriptors = ["CH340", "Arduino", "USB Serial", "IOUSBHostDevice"]  # Common identifiers for Arduino boards
        for port in ports:
            if any(descriptor in port.description for descriptor in target_descriptors):
                print(f"Arduino found on port: {port.device}")
                return port.device
        # throw error
        raise PortNotFoundError

    def __write_code_to_file(self, code: str, file_name: str):
        """
        Generates a .ino file from the code, and saves it to the file_name

        :param code: .ino compatabile code, generated by __str__
        :param file_name: Name of the file to save the code to
        """
        os.makedirs(file_name.rsplit(".", 1)[0], exist_ok=True)
        with open(os.path.join(file_name.rsplit(".", 1)[0], file_name), "w") as file:
            file.write(code)

    def __upload_sketch(self, file_name: str, board_type: str, port: str):
        """
        Uploads the sketch to the arduino

        :param file_name: Name of the .ino code file to upload
        :param board_type: Type of the arduino board
        :param port: Port of the arduino
        """
        dir_name = file_name.rsplit(".", 1)[0]
        upload_command = [
            "arduino-cli",
            "compile",
            "--upload",
            "-p",
            port,
            "--fqbn",
            board_type,
            os.path.join(dir_name, file_name),
        ]

        try:
            subprocess.run(upload_command, check=True)
            print("Upload successful")
            return True
        except subprocess.CalledProcessError:
            print("Error during upload")
            return False

    def __clean_up(self, file_name: str):
        """
        Removes temporary files created during the upload process
        """
        dir_name = file_name.rsplit(".", 1)[0]
        os.remove(os.path.join(dir_name, file_name))
        os.rmdir(dir_name)

    def __format_code_block(
        self,
        code_blocks: List[Union[Dict[str, List[str]], str]],
        type: str,
        depth: int,
        indent=2,
    ) -> str:
        """
        Recursively formats a list/dictionary representation of code into a .ino compatable string,
        with the correct indentation and formatting.

        :param code_blocks: List of code blocks to format
        :param type: Type of code block, either "setup" or "loop"
        :param depth: Current depth of the code block, determined by how deeply nested the code block is
        :param indent: Indentation for visual formatting, defaults to 2
        :return: Formatted code block
        """
        tab = " " * indent * depth
        if type == "setup":
            formatted_code = self.setup_code
        elif type == "loop":
            formatted_code = self.loop_code

        for block in code_blocks:
            if isinstance(block, str):
                formatted_code += f"{tab}{block}\n"
            elif isinstance(block, dict):
                items = list(block.items())
                assert (
                    len(items) == 1
                    and len(items[0]) == 2
                    and isinstance(items[0][1], list)
                    and isinstance(items[0][0], str)
                )
                statement, inside_code = items[0]
                formatted_code += f"{tab}{statement} {{\n"
                formatted_code += self.__format_code_block(
                    inside_code, type=type, depth=depth + 1
                )
                formatted_code += f"{tab}}}\n"

        return formatted_code

    def upload(self):
        """
        Generates the .ino file, uploads it to the arduino,
        and cleans up the temporary files.

        Call after setting up the code data structure.
        """
        print(f"Uploading code: {self}")
        self.__write_code_to_file(str(self), self.file_name)
        self.__upload_sketch(self.file_name, self.board_type, self.port)
        self.__clean_up(self.file_name)

    def __initialize_pin(self, pin_num: int, device_type: str):
        """
        Initialize a pin as either an input or output device, and adds the code to the setup block
        """
        assert device_type in ["INPUT", "OUTPUT"]
        self.setup.append(f"pinMode({pin_num}, {device_type});")

    def initialize_new_device_connection(
        self,
        input_pin: Optional[int],
        output_pins: List[int],
        action: str,
        *args,
        **kwargs,
    ):
        """
        EITHER:
            > Connect an input pin to 1 or more output pins, and set the action to be performed
        OR:
            > Create an output device connected to no input devices, and set the action to be performed

        :param input_pin: Pin number of the input device, or None if there is no input device
        :param output_pins: List of pin numbers of the output devices, if there is no input device, there should only be 1 pin
        :param action: Action to be performed when the input device is activated, string that corresponds to an action in actions.py
        :param args: Arguments for the action, additional arguments for the action function as determined in the function header in actions.py
        """
        if not input_pin:
            # Solo output device, no input device
            assert len(output_pins) == 1

            # Create output device
            pin = output_pins[0]
            device = OutputDevice(pin, None)
            self.__initialize_pin(pin, "OUTPUT")
            self.output_devices.add(device)

            # TODO, complete
        else:
            # Input-output device connection
            # TODO: Change in future for multi-device connections
            assert len(output_pins) == 1

            # Create input, output devices
            output_pin = output_pins[0]
            input_device = InputDevice(input_pin)
            output_device = OutputDevice(output_pin)
            input_device.output_devices = [output_device]
            output_device.input_device = input_device
            self.__initialize_pin(input_pin, "INPUT")
            # self.__initialize_pin(input_pin, "INPUT_PULLUP")
            self.__initialize_pin(output_pin, "OUTPUT")

            # TODO: Temporary code to test for single input, output for negate_output_on_input
            # Generate code based on action, and add to the code data structure

            print(args, kwargs)

            global_code, setup_code, loop_code = self.actions.get_action_code(
                action, input_pin, output_pin, *args, **kwargs
            )
            self.globals.extend(global_code)
            self.setup.extend(setup_code)
            self.loop.extend(loop_code)


if __name__ == "__main__":
    code = inoCodeDataStructure()
    # Any argument passed that is beyond the action string is passed as *args to the action function,
    # and is determined by the function header in actions.py
    # code.initialize_new_device_connection(2, [11], "negate_output_on_input")
    # def __blink_on_input_activation(
    #     self,
    #     input_pin: int,
    #     output_pin: int,
    #     blink_duration: int = 1000,
    #     after_action: int = 2,
    code.initialize_new_device_connection(2, [11], "blink_then_off_on_input_activation", 3000)
    print(code)
    code.upload()
