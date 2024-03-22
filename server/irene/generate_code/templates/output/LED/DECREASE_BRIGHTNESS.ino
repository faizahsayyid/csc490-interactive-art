      // Decrease LED brightness; make sure you use a PWM pin
      for (int brightness = 255; brightness >= 0; brightness--) {
        analogWrite(OUTPUT_PIN, brightness);
        delay(10);  // Adjust delay to control the speed of brightness change
      }