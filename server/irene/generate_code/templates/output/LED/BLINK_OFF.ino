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
      digitalWrite(OUTPUT_PIN, LOW);