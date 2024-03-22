      // Turn on the LED
      digitalWrite(OUTPUT_PIN, HIGH);

      // Blink the LED for the specified duration
      while () {
        // Turn off the LED
        digitalWrite(OUTPUT_PIN, LOW);

        // Delay for half of the blink duration
        delay(5);

        // Turn on the LED
        digitalWrite(OUTPUT_PIN, HIGH);

        // Delay for the other half of the blink duration
        delay(5);
      }