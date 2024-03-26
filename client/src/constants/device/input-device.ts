import { InputDevice } from "../../types/device/input-device";
import { DeviceInfo } from "../../types/device/device";

import motionSensorImage from "../../assets/images/motion-sensor.jpg";
import ledImage from "../../assets/images/clear-led.jpg";
import soundSensorImage from "../../assets/images/sound-sensor.jpg";
import buttonImage from "../../assets/images/push-button.jpg";

export const INPUT_DEVICE_INFO: Record<InputDevice, DeviceInfo> = {
  [InputDevice.BUTTON]: { name: "Button", description: "A simple push button" },
  [InputDevice.LIGHT_SENSOR]: {
    name: "Light Sensor",
    description: "Detects light in the environment",
  },
  [InputDevice.AUDIO_SENSOR]: {
    name: "Audio Sensor",
    description: "Detects sound in the environment",
  },
  [InputDevice.MOTION_SENSOR]: {
    name: "Motion Sensor",
    description: "Detects movement in the environment",
  },
};

export const INPUT_DEVICE_IMAGES: Record<InputDevice, string> = {
  [InputDevice.BUTTON]: buttonImage,
  [InputDevice.LIGHT_SENSOR]: ledImage,
  [InputDevice.AUDIO_SENSOR]: soundSensorImage,
  [InputDevice.MOTION_SENSOR]: motionSensorImage,
};
