// Include the necessary libraries
#include <Arduino.h>

// Define the pin for the button
#define BUTTON_PIN 2

// Define the pin for the LED
#define LED_PIN 13

// Define the duration for the LED to blink (in milliseconds)
#define BLINK_DURATION 500

// Define the duration for the button to be considered long-pressed (in milliseconds)
#define LONG_PRESS_DURATION 1000

// Define a variable to store the button state
int buttonState = 0;

// Define a variable to store the previous button state
int prevButtonState = 0;

// Define a variable to store the time when the button was pressed
unsigned long buttonPressTime = 0;

// Define a variable to store the time when the button was released
unsigned long buttonReleaseTime = 0;

// Define a variable to store the duration of the button press
unsigned long buttonPressDuration = 0;

// Define a variable to store the LED blink start time
unsigned long blinkStartTime = 0;

// Define a variable to store the LED blink end time
unsigned long blinkEndTime = 0;

// Define a variable to store the LED blink duration
unsigned long blinkDuration = 0;

// Setup function runs once at the start of the program
void setup() {
  // Set the button pin as input
  pinMode(BUTTON_PIN, INPUT);

  // Set the LED pin as output
  pinMode(LED_PIN, OUTPUT);
}

// Loop function runs repeatedly as long as the program is running
void loop() {
  // Read the button state
  buttonState = digitalRead(BUTTON_PIN);

  // Check if the button is pressed
  if (buttonState == HIGH) {
    // Check if this is the first time the button is pressed
    if (prevButtonState == LOW) {
      // Store the current time as the button press time
      buttonPressTime = millis();
    }

    // Calculate the button press duration
    buttonPressDuration = millis() - buttonPressTime;

    // Check if the button has been pressed for longer than the long press duration
    if (buttonPressDuration >= LONG_PRESS_DURATION) {
      // Turn on the LED
      digitalWrite(LED_PIN, HIGH);

      // Store the current time as the LED blink start time
      blinkStartTime = millis();

      // Calculate the LED blink end time
      blinkEndTime = blinkStartTime + BLINK_DURATION;

      // Calculate the LED blink duration
      blinkDuration = blinkEndTime - blinkStartTime;

      // Blink the LED for the specified duration
      while (millis() < blinkEndTime) {
        // Turn off the LED
        digitalWrite(LED_PIN, LOW);

        // Delay for half of the blink duration
        delay(blinkDuration / 2);

        // Turn on the LED
        digitalWrite(LED_PIN, HIGH);

        // Delay for the other half of the blink duration
        delay(blinkDuration / 2);
      }
      // Turn on the LED
      digitalWrite(LED_PIN, HIGH);
    }
  } else {
    // Check if the button was previously pressed
    if (prevButtonState == HIGH) {
      // Turn off the LED
      digitalWrite(LED_PIN, LOW);
    }
  }

  // Store the current button state as the previous button state
  prevButtonState = buttonState;
}