import { Action } from "./action";
import { InputDevice } from "./device/input-device";
import { OutputDevice } from "./device/output-device";

export type Interaction = {
  action: Action;
  inputDeviceConfig: DeviceConfig<InputDevice>;
  outputDeviceConfig: DeviceConfig<OutputDevice>;
  additionalVariables?: Record<string, string>;
};

export type DeviceConfig<T> = {
  device: T;
  id?: number;
};

export type Project = {
  id: string;
  name: string;
  inputDevices: DeviceConfig<InputDevice>[];
  outputDevices: DeviceConfig<OutputDevice>[];
  interactions: Interaction[];
  lastModified: Date;
};
