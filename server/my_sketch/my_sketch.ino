
#include <FastLED.h>
CRGB leds[NUM_LEDS];

void setup() {
  pinMode(8, INPUT);
  pinMode(4, OUTPUT);
  FastLED.addLeds<CHIPSET, 4, COLOR_ORDER>(leds, NUM_LEDS);
  pinMode(8, INPUT);

}

void loop() {
  int inputState = digitalRead(8);
  if (inputState == HIGH) {
  }
  else {
  }

}
