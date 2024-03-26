import { InputDeviceAction } from "../types/device/input-device";
import { OutputDeviceAction } from "../types/device/output-device";

/**
 * @deprecated
 */
export const INPUT_DEVICE_ACTIONS: Record<InputDeviceAction, string> = {
  BUTTON_ON_PUSH: "When pushed",
  BUTTON_ON_RELEASE: "When released",
  BUTTON_ON_HOLD: "When held down",
  BUTTON_ON_DOUBLE_CLICK: "When double-clicked",
  BUTTON_ON_LONG_PRESS: "When long-pressed",
  LIGHT_SENSOR_BELOW_LUX: "When ambient light level is below X lux",
  LIGHT_SENSOR_ABOVE_LUX: "When ambient light level is above X lux",
  LIGHT_SENSOR_LIGHT_PATTERN: "When specific light pattern is detected",
  LIGHT_SENSOR_RAPID_CHANGE: "When light intensity changes rapidly",
  LIGHT_SENSOR_EXCEEDS_THRESHOLD:
    "When light level exceeds a certain threshold for a duration",
  AUDIO_SENSOR_EXCEEDS_DECIBELS: "When sound level exceeds X decibels",
  AUDIO_SENSOR_SOUND_PATTERN: "When specific sound pattern is detected",
  AUDIO_SENSOR_SILENCE: "When silence is detected",
  AUDIO_SENSOR_FREQUENCY_PATTERN:
    "When frequency spectrum matches a predefined pattern",
  AUDIO_SENSOR_BELOW_THRESHOLD:
    "When sound level drops below X decibels after being above threshold",
  MOTION_SENSOR_MOTION_DETECTED: "When motion is detected",
  MOTION_SENSOR_NO_MOTION: "When no motion is detected for a certain period",
  MOTION_SENSOR_MOTION_PATTERN: "When specific motion pattern is detected",
  MOTION_SENSOR_MOTION_DIRECTION: "When motion direction changes",
  MOTION_SENSOR_MOTION_SPEED: "When motion speed exceeds a certain threshold",
};

/**
 * @deprecated
 */
export const OUTPUT_DEVICE_ACTIONS: Record<OutputDeviceAction, string> = {
  LED_TURN_ON: "Turn on",
  LED_TURN_OFF: "Turn off",
  LED_TOGGLE: "Toggle (switch between on and off states)",
  LED_BLINK: "Blink at regular intervals",
  LED_INCREASE_BRIGHTNESS: "Increase brightness",
  LED_DECREASE_BRIGHTNESS: "Decrease brightness",
  LED_STRIP_TURN_ON: "Turn on",
  LED_STRIP_TURN_OFF: "Turn off",
  LED_STRIP_TOGGLE: "Toggle (switch between on and off states)",
  LED_STRIP_BLINK: "Blink at regular intervals",
  LED_STRIP_INCREASE_BRIGHTNESS: "Increase brightness",
  LED_STRIP_DECREASE_BRIGHTNESS: "Decrease brightness",
  SPEAKER_PLAY_SOUND: "Play sound",
  SPEAKER_STOP_PLAYING_SOUND: "Stop playing sound",
  SPEAKER_ADJUST_VOLUME: "Adjust volume",
  SPEAKER_PLAY_SPECIFIC_TONE: "Play specific tone or melody",
  SPEAKER_PLAY_SOUND_DURATION: "Play sound for a specific duration",
  MOTOR_ROTATE_CLOCKWISE: "Rotate clockwise",
  MOTOR_ROTATE_COUNTERCLOCKWISE: "Rotate counterclockwise",
  MOTOR_STOP: "Stop",
  MOTOR_ROTATE_SPECIFIC_SPEED: "Rotate at a specific speed",
  MOTOR_ROTATE_SPECIFIC_ANGLE: "Rotate to a specific angle",
  ZIP_SERVO_PUSH_FORWARD: "Push forward",
  ZIP_SERVO_PULL_BACKWARD: "Pull backward",
  ZIP_SERVO_STOP: "Stop",
};
