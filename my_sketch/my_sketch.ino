


void setup() {
  pinMode(11, INPUT);
  pinMode(13, OUTPUT);

}

void loop() {
  int inputState = digitalRead(11);
  if (inputState == HIGH) {
    int outputState = digitalRead(13);
    digitalWrite(13, !outputState);
  }

}
