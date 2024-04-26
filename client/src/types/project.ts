// import { Action } from "./action";
import { InputDevice } from "./device/input-device";
import { OutputDevice } from "./device/output-device";

export type Interaction = {
  action_key: string;
  inputDevice: DeviceConfig<InputDevice>;
  outputDevice: DeviceConfig<OutputDevice>;
  additionalVariables?: Record<string, any>;
};

export type DeviceConfig<T> = {
  pin?: number;
  device: T;
  id?: string;
};

export type Project = {
  id: string;
  name: string;
  inputDevices: DeviceConfig<InputDevice>[];
  outputDevices: DeviceConfig<OutputDevice>[];
  interactions: Interaction[];
  lastModified: Date;
};
