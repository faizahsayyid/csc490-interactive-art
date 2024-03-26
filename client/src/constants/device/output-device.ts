import { OutputDevice } from "../../types/device/output-device";
import { DeviceInfo } from "../../types/device/device";

import ledImage from "../../assets/images/clear-led.jpg";
import ledStripImage from "../../assets/images/led-strip.jpg";
import motorImage from "../../assets/images/motor.jpg";
import servoImage from "../../assets/images/servo.jpg";
import audioPlayerImage from "../../assets/images/audio-player.jpg";

export const OUTPUT_DEVICE_INFO: Record<OutputDevice, DeviceInfo> = {
  [OutputDevice.LED]: { name: "LED", description: "A light-emitting diode" },
  [OutputDevice.LED_STRIP]: {
    name: "LED Strip",
    description: "A strip of LEDs",
  },
  [OutputDevice.SPEAKER]: {
    name: "Speaker",
    description: "A device that plays audio",
  },
  [OutputDevice.MOTOR]: { name: "Motor", description: "For rotating objects" },
  [OutputDevice.ZIP_SERVO]: {
    name: "Zip Servo",
    description: "For moving objects linearly",
  },
};

export const OUTPUT_DEVICE_IMAGES: Record<OutputDevice, string> = {
  [OutputDevice.LED]: ledImage,
  [OutputDevice.LED_STRIP]: ledStripImage,
  [OutputDevice.SPEAKER]: audioPlayerImage,
  [OutputDevice.MOTOR]: motorImage,
  [OutputDevice.ZIP_SERVO]: servoImage,
};
