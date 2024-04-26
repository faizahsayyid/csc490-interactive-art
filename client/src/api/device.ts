import axios from "axios";
import { DeviceConfig } from "../types/project";
import { API_URL } from "./config";
import { getHeaders } from "./getHeaders";
import { InputDevice } from "../types/device/input-device";
import { OutputDevice } from "../types/device/output-device";

export const updateInputDevice = async ({
  projectId,
  deviceId,
  deviceName,
  pin,
}: {
  projectId: string;
  deviceId: string;
  deviceName: InputDevice;
  pin: number;
}): Promise<DeviceConfig<InputDevice>> => {
  const response = await axios.put(
    `${API_URL}/arduino/projects/${projectId}/input-devices/${deviceId}/`,
    {
      id: deviceId,
      pin,
      project: projectId,
      device_name: deviceName,
    },
    {
      headers: getHeaders(),
    }
  );

  return {
    pin: response.data.pin,
    device: response.data.device,
    id: response.data.id,
  };
};

export const updateOutputDevice = async ({
  projectId,
  deviceId,
  deviceName,
  pin,
}: {
  projectId: string;
  deviceId: string;
  deviceName: OutputDevice;
  pin: number;
}): Promise<DeviceConfig<InputDevice>> => {
  const response = await axios.put(
    `${API_URL}/arduino/projects/${projectId}/output-devices/${deviceId}/`,
    {
      id: deviceId,
      pin,
      project: projectId,
      device_name: deviceName,
    },
    {
      headers: getHeaders(),
    }
  );

  return {
    pin: response.data.pin,
    device: response.data.device,
    id: response.data.id,
  };
};
