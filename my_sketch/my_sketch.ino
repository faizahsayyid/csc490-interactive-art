


void setup() {
  pinMode(13, INPUT);
  pinMode(11, OUTPUT);

}

void loop() {
  int inputState = digitalRead(13);
  if (inputState == HIGH) {
    int outputState = digitalRead(11);
    digitalWrite(11, !outputState);
  }
  delay(50)

}
