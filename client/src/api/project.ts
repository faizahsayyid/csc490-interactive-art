import axios, { AxiosResponse } from "axios";
import { API_URL } from "./config";
import { DeviceConfig, Project } from "../types/project";
import { getHeaders } from "./getHeaders";
import { InputDevice } from "../types/device/input-device";
import { OutputDevice } from "../types/device/output-device";

export const getProjects = async (token: string): Promise<Project[]> => {
  return axios.get(`${API_URL}/arduino/projects/`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const getProjectById = async ({
  projectId,
}: {
  projectId?: string;
}): Promise<Project> => {
  const res = await axios.get(`${API_URL}/arduino/projects/${projectId}/`, {
    headers: getHeaders(),
  });

  const data = res.data;

  const inputDevices: DeviceConfig<InputDevice>[] = data.input_devices.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (device: any) => ({
      id: device.id,
      device: device.device_name,
      pin: device.pin,
    })
  );

  const outputDevices: DeviceConfig<OutputDevice>[] = data.output_devices.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (device: any) => ({
      id: device.id,
      device: device.device_name,
      pin: device.pin,
    })
  );

  return {
    id: data.id,
    name: data.name,
    inputDevices: inputDevices,
    outputDevices: outputDevices,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interactions: data.interactions.map((interaction: any) => ({
      action_key: interaction.action,
      inputDevice: inputDevices.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d: any) => d.id === interaction.input_device
      ),
      outputDevice: outputDevices.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d: any) => d.id === interaction.output_device
      ),
      additionalVariables: interaction.additional_variables,
    })),
    lastModified: new Date(data.last_modified),
  };
};

export const createProject = async ({
  name,
}: Partial<Project>): Promise<AxiosResponse<Project>> => {
  return axios.post(
    `${API_URL}/arduino/projects/`,
    { name },
    {
      headers: getHeaders(),
    }
  );
};
