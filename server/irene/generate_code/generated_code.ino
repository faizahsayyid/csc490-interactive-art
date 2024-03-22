#include <Arduino.h>

#define BUTTON_PIN 2
#define OUTPUT_PIN 13

int buttonState = 0;
int prevButtonState = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(OUTPUT_PIN, OUTPUT);
}

void loop() {
  buttonState = digitalRead(BUTTON_PIN);

  // Check if the button is pushed (buttonState is HIGH)
  if (buttonState == HIGH) {
    // Check if this is the first time the button is pushed
    if (prevButtonState == LOW) {
      // Turn off the LED when the button is pushed
            // Turn on the LED
      digitalWrite(OUTPUT_PIN, HIGH);

      // Store the current time as the LED blink start time
      blinkStartTime = millis();

      // Calculate the LED blink end time
      blinkEndTime = blinkStartTime + BLINK_DURATION;

      // Calculate the LED blink duration
      blinkDuration = blinkEndTime - blinkStartTime;

      // Blink the LED for the specified duration
      while (millis() < blinkEndTime) {
        // Turn off the LED
        digitalWrite(OUTPUT_PIN, LOW);

        // Delay for half of the blink duration
        delay(blinkDuration / 2);

        // Turn on the LED
        digitalWrite(OUTPUT_PIN, HIGH);

        // Delay for the other half of the blink duration
        delay(blinkDuration / 2);
      }
      // Turn on the LED
      digitalWrite(OUTPUT_PIN, HIGH);
    }
  }

  // Store the current button state as the previous button state
  prevButtonState = buttonState;
}
