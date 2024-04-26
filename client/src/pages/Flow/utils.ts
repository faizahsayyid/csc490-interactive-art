import { Interaction } from "../../types/project";
import { InteractionFlow } from "./Flow";
import { DeviceConfig } from "../../types/project";
import { InputDevice } from "../../types/device/input-device";
import { OutputDevice } from "../../types/device/output-device";
// import { ActionVariable } from "../../types/action";

// interface InteractionFlow {
//     id: string; // Same as id of edge
//     sourceDevice: Node;
//     targetDevice: Node;
//     action: ActionVariable;
//     args: any[];
//   }

const NameToEnum = (name: string): any => {
  return name.replace(" ", "_").toUpperCase();
};

export const InteractionFlowToInteraction = (
  intFlow: InteractionFlow
): Interaction => {
  let action_key = String(intFlow.action);
  let inputDeviceConfig = InputNodeToInputDevice(intFlow.sourceDevice);
  let outputDeviceConfig = OutputNodeToOutputDevice(intFlow.targetDevice);
  let additionalVariables = intFlow.args;

  return {
    action_key: action_key,
    inputDevice: inputDeviceConfig,
    outputDevice: outputDeviceConfig,
    additionalVariables: additionalVariables,
  };
};

export const InputNodeToInputDevice = (
  device: any
): DeviceConfig<InputDevice> => {
  let deviceType = NameToEnum(device.data.name);
  if (device.data.type === "input") {
    if (deviceType in InputDevice) {
      return {
        device: deviceType,
        id: device.id,
      };
    } else {
      alert("Invalid input device type: " + deviceType);
      return {
        device: InputDevice.BUTTON,
        id: device.id,
      };
    }
  } else {
    alert("Invalid device type: " + device.type);
    return {
      device: InputDevice.BUTTON,
      id: device.id,
    };
  }
};

export const OutputNodeToOutputDevice = (
  device: any
): DeviceConfig<OutputDevice> => {
  let deviceType = NameToEnum(device.data.name);
  if (device.data.type === "output") {
    if (deviceType in OutputDevice) {
      return {
        device: deviceType,
        id: device.id,
      };
    } else {
      alert("Invalid output device type: " + deviceType);
      return {
        device: OutputDevice.LED_STRIP,
        id: device.id,
      };
    }
  } else {
    alert("Invalid device type: " + device.type);
    return {
      device: OutputDevice.LED_STRIP,
      id: device.id,
    };
  }
};
