import { Node } from "reactflow";


export const createDevice = (
  device: any,
  deviceInfo: any,
  deviceImageInfo: any,
  deviceList: any,
  x_val: number,
  start_y: number,
  y_step: number,
  type: string,
  id: number | undefined,
) => {
  const node: Node = {
    id: `${id}`,
    type: "custom",
    data: {
      label: deviceInfo[device].name,
      name: deviceInfo[device].name,
      image: deviceImageInfo[device],
      description: deviceInfo[device].description,
      type: type,
    },
    position: { x: x_val, y: start_y + y_step * deviceList.length },
  };
  return node;
};
