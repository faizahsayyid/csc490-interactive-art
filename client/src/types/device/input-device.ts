export enum InputDevice {
  BUTTON = "BUTTON",
  LIGHT_SENSOR = "LIGHT_SENSOR",
  AUDIO_SENSOR = "AUDIO_SENSOR",
  MOTION_SENSOR = "MOTION_SENSOR",
}

// - "When pushed"
// - "When released"
// - "When held down"
// - "When double-clicked"
// - "When long-pressed"
/**
 * @deprecated
 */
export enum ButtonAction {
  ON_PUSH = "ON_PUSH",
  ON_RELEASE = "ON_RELEASE",
  ON_HOLD = "ON_HOLD",
  ON_DOUBLE_CLICK = "ON_DOUBLE_CLICK",
  ON_LONG_PRESS = "ON_LONG_PRESS",
}

// - "When ambient light level is below X lux"
// - "When ambient light level is above X lux"
// - "When specific light pattern is detected"
// - "When light intensity changes rapidly"
// - "When light level exceeds a certain threshold for a duration"
/**
 * @deprecated
 */
export enum LightSensorAction {
  BELOW_LUX = "BELOW_LUX",
  ABOVE_LUX = "ABOVE_LUX",
  LIGHT_PATTERN = "LIGHT_PATTERN",
  RAPID_CHANGE = "RAPID_CHANGE",
  EXCEEDS_THRESHOLD = "EXCEEDS_THRESHOLD",
}

// - "When sound level exceeds X decibels"
// - "When specific sound pattern is detected"
// - "When silence is detected"
// - "When frequency spectrum matches a predefined pattern"
// - "When sound level drops below X decibels after being above threshold"
/**
 * @deprecated
 */
export enum AudioSensorAction {
  EXCEEDS_DECIBELS = "EXCEEDS_DECIBELS",
  SOUND_PATTERN = "SOUND_PATTERN",
  SILENCE = "SILENCE",
  FREQUENCY_PATTERN = "FREQUENCY_PATTERN",
  BELOW_THRESHOLD = "BELOW_THRESHOLD",
}

// - "When motion is detected"
// - "When no motion is detected for a certain period"
// - "When specific motion pattern is detected"
// - "When motion direction changes"
// - "When motion speed exceeds a certain threshold"
/**
 * @deprecated
 */
export enum MotionSensorAction {
  MOTION_DETECTED = "MOTION_DETECTED",
  NO_MOTION = "NO_MOTION",
  MOTION_PATTERN = "MOTION_PATTERN",
  MOTION_DIRECTION = "MOTION_DIRECTION",
  MOTION_SPEED = "MOTION_SPEED",
}

/**
 * @deprecated
 */
export type InputDeviceAction =
  | `${InputDevice.BUTTON}_${ButtonAction}`
  | `${InputDevice.LIGHT_SENSOR}_${LightSensorAction}`
  | `${InputDevice.AUDIO_SENSOR}_${AudioSensorAction}`
  | `${InputDevice.MOTION_SENSOR}_${MotionSensorAction}`;
