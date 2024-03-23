#include <Arduino.h>

#define INPUT_PIN 2
#define OUTPUT_PIN 13

int buttonState = 0;
int prevButtonState = 0;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void setup() {
  pinMode(INPUT_PIN, INPUT);
  pinMode(OUTPUT_PIN, OUTPUT);
}

void loop() {
  int reading = digitalRead(INPUT_PIN);

  if (reading != prevButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      if (buttonState == HIGH) {
        // Check for double click
        if (digitalRead(INPUT_PIN) == HIGH) {
          delay(50);  // small delay to prevent false detection
          if (digitalRead(INPUT_PIN) == HIGH) {
            // Double click detected
            OUTPUT_ACTION_CODE
          }
        }
      }
    }
  }

  prevButtonState = reading;
}
