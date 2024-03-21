button_press = """
// Define the pin where the button is connected
const int buttonPin = 11;
// Define the built-in LED pin (usually pin 13 on Arduino Nano)
const int ledPin = LED_BUILTIN;

// Variable to hold the button state
int buttonState = 0;
// Variable to store the last button state
int lastButtonState = LOW;
// Variable to keep track of the LED state
bool ledState = false;

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Read the state of the button
  buttonState = digitalRead(buttonPin);

  if (buttonState != lastButtonState) {
    // If the button state has changed
    if (buttonState == HIGH) {
      // Toggle the LED state
      ledState = !ledState;
      digitalWrite(ledPin, ledState ? HIGH : LOW);
    }
    // Update the last button state
    lastButtonState = buttonState;
  }

  // Optional: Add a small delay to avoid reading too frequently
  delay(100);
}
"""

flash_led = """
const int ledPin = LED_BUILTIN; // Most Arduinos have a built-in LED on pin 13

// Function to flash the built-in LED
void flash_led(int duration, int flashes) {
  for (int i = 0; i < flashes; i++) {
    digitalWrite(ledPin, HIGH); // Turn on the LED
    delay(duration);            // Wait for 'duration' milliseconds
    digitalWrite(ledPin, LOW);  // Turn off the LED
    delay(duration);            // Wait for 'duration' milliseconds
  }
}

void setup() {
  pinMode(ledPin, OUTPUT); // Initialize the LED pin as an output
}

void loop() {
  flash_led(500, 5); // Flash the LED for 500ms, 5 times
  delay(2000);       // Wait for 2 seconds before flashing again
}
"""
