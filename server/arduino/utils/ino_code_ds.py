from typing import List, Dict, Union, Any, Optional
import subprocess
import os
import serial
import serial.tools.list_ports
from .actions import Actions


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
        self.board_type = "arduino:avr:nano"
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
        Searches ports for a CH340 device

        :return: Port of the CH340 device
        """
        ports = serial.tools.list_ports.comports()
        for port in ports:
            if "CH340" in port.description:
                print(f"Using port: {port.device}")
                return port.device
        print("No port found")
        return '/dev/cu.usbserial-10'

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
        except subprocess.CalledProcessError:
            print("Error during upload")

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
        Initialize the pins for the device
        """
        assert device_type in ["INPUT", "OUTPUT"]
        self.setup.append(f"pinMode({pin_num}, {device_type});")

    def initialize_new_device_connection(
        self,
        output_pins: List[int],
        input_pin: Optional[int],
        action: str,
        *args,
        **kwargs,
    ):
        """
        Initialize code to create a new device, with the designated action
        """
        if not input_pin:
            # Solo output device
            assert len(output_pins) == 1
            pin = output_pins[0]
            device = OutputDevice(pin, None)
            self.__initialize_pin(pin, "OUTPUT")
            self.output_devices.add(device)
            
            # TODO, complete
        else:
            # Input-output device connection
            # TODO: Change in future for multi-device connections
            assert len(output_pins) == 1
            output_pin = output_pins[0]
            input_device = InputDevice(input_pin)
            output_device = OutputDevice(output_pin)
            input_device.output_devices = [output_device]
            output_device.input_device = input_device
            self.__initialize_pin(input_pin, "INPUT")
            self.__initialize_pin(output_pin, "OUTPUT")

            # TODO: Temporary code to test for single input, output for negate_output_on_input
            global_code, setup_code, loop_code = self.actions.get_action_code(
                action, input_pin, output_pin, *args, **kwargs
            )
            self.globals.extend(global_code)
            self.setup.extend(setup_code)
            self.loop.extend(loop_code)

code = inoCodeDataStructure()
code.initialize_new_device_connection([13], 11, "demo", 1000)
print(code)
code.upload()
