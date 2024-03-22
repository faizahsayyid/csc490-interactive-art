#include <Arduino.h>

#define BUTTON_PIN 2
#define OUTPUT_PIN 13

int buttonState = 0; // we may need to change this later
int prevButtonState = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(OUTPUT_PIN, OUTPUT);
}

void loop() {
  buttonState = digitalRead(BUTTON_PIN);

  // Check if the button is released (buttonState is HIGH)
  if (buttonState == LOW) {
    // Check if this is the first time the button is released
    if (prevButtonState == HIGH) {
      // Turn off the LED when the button is pushed
      OUTPUT_ACTION_CODE
    }
  }

  // Store the current button state as the previous button state
  prevButtonState = buttonState;
}
