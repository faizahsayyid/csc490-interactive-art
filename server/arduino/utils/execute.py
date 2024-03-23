from ino_code_ds import inoCodeDataStructure

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
# code.upload()
print(code)