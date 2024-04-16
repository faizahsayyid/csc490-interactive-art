import { Action } from "../types/action";
import { InputDevice } from "../types/device/input-device";
import { OutputDevice } from "../types/device/output-device";
import { Project } from "../types/project";

export const EXAMPLE_PROJECTS: Project[] = [
  {
    id: "0",
    name: "Atomic Structure Project",
    inputDevices: [
      {
        device: InputDevice.BUTTON,
        id: 11,
      },
      {
        device: InputDevice.BUTTON,
        id: 12,
      },
    ],
    outputDevices: [
      {
        device: OutputDevice.LED,
        id: 13,
      },
      {
        device: OutputDevice.LED,
        id: 9,
      },
      {
        device: OutputDevice.LED,
        id: 8,
      },
    ],
    interactions: [
      {
        action: Action.NEGATE_OUTPUT_ON_INPUT,
        inputDeviceConfig: {
          device: InputDevice.BUTTON,
          id: 11,
        },
        outputDeviceConfig: {
          device: OutputDevice.LED,
          id: 13,
        },
        additionalVariables: {
          delay: "1000",
        },
      },
    ],
    lastModified: new Date("2024-03-14"),
  },
  {
    id: "1",
    name: "Spring Cleaning",
    inputDevices: [
      {
        device: InputDevice.MOTION_SENSOR,
      },
    ],
    outputDevices: [
      {
        device: OutputDevice.LED_STRIP,
      },
    ],
    interactions: [],
    lastModified: new Date("2024-03-12"),
  },
];
