import { Action, ActionConfig } from "../types/action";
import { InputDevice } from "../types/device/input-device";
import { OutputDevice } from "../types/device/output-device";

export const ACTION_CONFIGS: Record<Action, ActionConfig> = {
  [Action.NEGATE_OUTPUT_ON_INPUT]: {
    name: "Negate Output on Input",
    description: "Toggle the output on and off when input is detected",
    additionalVariables: [
      {
        name: "delay",
        type: "number",
        description: "Debounce time in milliseconds",
      },
    ],
    allowedInputDevices: [
      InputDevice.BUTTON,
      InputDevice.MOTION_SENSOR,
      InputDevice.LIGHT_SENSOR,
      InputDevice.AUDIO_SENSOR,
    ],
    allowedOutputDevices: [
      OutputDevice.LED,
      OutputDevice.LED_STRIP,
      OutputDevice.SPEAKER,
    ],
  },
};
