export enum OutputDevice {
  LED = "LED",
  LED_STRIP = "LED_STRIP",
  SPEAKER = "SPEAKER",
  MOTOR = "MOTOR",
  ZIP_SERVO = "ZIP_SERVO",
}

// - "Turn on"
// - "Turn off"
// - "Toggle (switch between on and off states)"
// - "Blink at regular intervals"
// - "Increase brightness”
// - “Decrease brightness”
/**
 * @deprecated
 */
export enum LedAction {
  TURN_ON = "TURN_ON",
  TURN_OFF = "TURN_OFF",
  TOGGLE = "TOGGLE",
  BLINK = "BLINK",
  INCREASE_BRIGHTNESS = "INCREASE_BRIGHTNESS",
  DECREASE_BRIGHTNESS = "DECREASE_BRIGHTNESS",
}

// - "Play sound"
// - "Stop playing sound"
// - "Adjust volume"
// - "Play specific tone or melody"
// - "Play sound for a specific duration"
/**
 * @deprecated
 */
export enum SpeakerAction {
  PLAY_SOUND = "PLAY_SOUND",
  STOP_PLAYING_SOUND = "STOP_PLAYING_SOUND",
  ADJUST_VOLUME = "ADJUST_VOLUME",
  PLAY_SPECIFIC_TONE = "PLAY_SPECIFIC_TONE",
  PLAY_SOUND_DURATION = "PLAY_SOUND_DURATION",
}

// - "Rotate clockwise"
// - "Rotate counterclockwise"
// - "Stop"
// - "Rotate at a specific speed"
// - "Rotate to a specific angle"
/**
 * @deprecated
 */
export enum MotorAction {
  ROTATE_CLOCKWISE = "ROTATE_CLOCKWISE",
  ROTATE_COUNTERCLOCKWISE = "ROTATE_COUNTERCLOCKWISE",
  STOP = "STOP",
  ROTATE_SPECIFIC_SPEED = "ROTATE_SPECIFIC_SPEED",
  ROTATE_SPECIFIC_ANGLE = "ROTATE_SPECIFIC_ANGLE",
}

// - "Push forward"
// - "Pull backward"
// - "Stop"
/**
 * @deprecated
 */
export enum ZipServoAction {
  PUSH_FORWARD = "PUSH_FORWARD",
  PULL_BACKWARD = "PULL_BACKWARD",
  STOP = "STOP",
}

/**
 * @deprecated
 */
export type OutputDeviceAction =
  | `${OutputDevice.LED}_${LedAction}`
  | `${OutputDevice.LED_STRIP}_${LedAction}`
  | `${OutputDevice.SPEAKER}_${SpeakerAction}`
  | `${OutputDevice.MOTOR}_${MotorAction}`
  | `${OutputDevice.ZIP_SERVO}_${ZipServoAction}`;
