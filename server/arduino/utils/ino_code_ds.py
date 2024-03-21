from typing import List, Dict, Union, Any
import subprocess
import os
import serial
import serial.tools.list_ports


class inoCodeDataStructure:
    def __init__(self):
        self.setup: List[Union[Dict[list], str]] = []
        self.loop: List[Union[Dict[list], str]] = []
        self.globals = []
        self.setup_code = ""
        self.loop_code = ""
        self.port = self.__find_port()
        self.board_type = "arduino:avr:nano"
        self.file_name = "my_sketch.ino"

    def __str__(self):
        self.setup_code = ""
        setup_code = self.__format_code_block(self.setup, "setup")
        self.loop_code = ""
        loop_code = self.__format_code_block(self.loop, "loop")
        globals = "\n".join(self.globals)

        return f"""
{globals}

void setup() {{
// put your setup code here, to run once:
{setup_code}
}}

void loop() {{
// put your main code here, to run repeatedly:
{loop_code}
}}
"""

    def __find_port(self):
        ports = serial.tools.list_ports.comports()
        for port in ports:
            if "CH340" in port.description:
                print(f"Using port: {port.device}")
                return port.device
        print("No port found")
        return None

    def __write_code_to_file(self, code: str, file_name: str):
        os.makedirs(file_name.rsplit(".", 1)[0], exist_ok=True)
        with open(os.path.join(file_name.rsplit(".", 1)[0], file_name), "w") as file:
            file.write(code)

    def __upload_sketch(self, file_name: str, board_type: str, port: str):
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
        dir_name = file_name.rsplit(".", 1)[0]
        os.remove(os.path.join(dir_name, file_name))
        os.rmdir(dir_name)

    def __format_code_block(
        self, code_blocks: List[Union[Dict[str, List[str]], str]], type: str
    ) -> str:
        if type == "setup":
            formatted_code = self.setup_code
        elif type == "loop":
            formatted_code = self.loop_code

        for block in code_blocks:
            if isinstance(block, str):
                formatted_code += f"{block}\n"
            elif isinstance(block, dict):
                items = list(block.items())
                assert (
                    len(items) == 1
                    and len(items[0]) == 2
                    and isinstance(items[0][1], list)
                    and isinstance(items[0][0], str)
                )
                statement, inside_code = items[0]
                formatted_code += f"{statement} {{\n"
                formatted_code += self.__format_code_block(inside_code, type)
                formatted_code += "}\n"

        return formatted_code

    def upload(self):
        print(f"Uploading code: {self}")
        self.__write_code_to_file(str(self), self.file_name)
        self.__upload_sketch(self.file_name, self.board_type, self.port)
        self.__clean_up(self.file_name)


# Example usage
code = inoCodeDataStructure()
code.globals.append("const int ledPin = LED_BUILTIN;")
code.globals.append("const int buttonPin = 11;")

code.globals.append("int buttonState = 0;")
code.globals.append("int lastButtonState = LOW;")
code.globals.append("bool ledState = false;")

code.setup.append("pinMode(buttonPin, INPUT);")
code.setup.append("pinMode(ledPin, OUTPUT);")

code.loop.append("buttonState = digitalRead(buttonPin);")
code.loop.append(
    {
        "if (buttonState != lastButtonState)": [
            {
                "if (buttonState == HIGH)": [
                    "ledState = !ledState;",
                    "digitalWrite(ledPin, ledState ? HIGH : LOW);",
                ]
            },
            "lastButtonState = buttonState;",
        ]
    }
)
code.loop.append("delay(100);")
code.upload()
