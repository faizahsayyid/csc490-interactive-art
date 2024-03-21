from arduino_code import button_press, flash_led
import subprocess
import os
import serial
import serial.tools.list_ports
import time


BOARD_TYPE = "arduino:avr:nano"
SKETCH_NAME = "my_sketch"
FILE_NAME = f"{SKETCH_NAME}.ino"

def find_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if "CH340" in port.description:
            return port.device
    return None


def write_code_to_file(code, file_name):
    os.makedirs(file_name.rsplit('.', 1)[0], exist_ok=True)
    with open(os.path.join(file_name.rsplit('.', 1)[0], file_name), "w") as file:
        file.write(code)


def upload_sketch(file_name, board_type, port):
    dir_name = file_name.rsplit('.', 1)[0]
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

def clean_up(file_name):
    dir_name = file_name.rsplit('.', 1)[0]
    os.remove(os.path.join(dir_name, file_name))
    os.rmdir(dir_name)


def main(code):    
    print(f"Uploading code: {code}")
    
    port = find_port()
    print(f"Using port: {port}")
    
    write_code_to_file(code, FILE_NAME)
    upload_sketch(FILE_NAME, BOARD_TYPE, port)
    clean_up(FILE_NAME)

if __name__ == "__main__":    
    main(flash_led)
    time.sleep(10)
    main(button_press)
