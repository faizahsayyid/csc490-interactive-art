import { InputDevice } from "./device/input-device";
import { OutputDevice } from "./device/output-device";

export enum Action {
  NEGATE_OUTPUT_ON_INPUT = "NEGATE_OUTPUT_ON_INPUT",
}

export type ActionVariableType = "number" | "boolean";

export type ActionVariable = {
  name: string;
  type: ActionVariableType;
  description: string;
};

export type ActionConfig = {
  name: string;
  description: string;
  allowedInputDevices: InputDevice[];
  allowedOutputDevices: OutputDevice[];
  additionalVariables?: ActionVariable[];
};
