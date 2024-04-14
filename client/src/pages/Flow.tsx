import { useCallback } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { EXAMPLE_PROJECTS } from "../constants/example-data";
import {
  INPUT_DEVICE_INFO,
  INPUT_DEVICE_IMAGES,
} from "../constants/device/input-device";
import {
  OUTPUT_DEVICE_INFO,
  OUTPUT_DEVICE_IMAGES,
} from "../constants/device/output-device";

import CustomNode from "./CustomNode";
import "./Flow.css";
import "reactflow/dist/style.css";

const project = EXAMPLE_PROJECTS[0];
let inputDevices: Node[] = []; // Typing the array as Node[]
let outputDevices: Node[] = []; // Typing the array as Node[]

for (const inputDevice of project.inputDevices) {
  const dict: Node = {
    id: `${inputDevice.pin}`, // Ensuring ID is a string
    type: "custom",
    data: {
      label: INPUT_DEVICE_INFO[inputDevice.device].name,
      name: INPUT_DEVICE_INFO[inputDevice.device].name,
      image: INPUT_DEVICE_IMAGES[inputDevice.device],
      description: INPUT_DEVICE_INFO[inputDevice.device].description,
      type: "input",
    },
    position: { x: 400, y: 200 },
  };
  inputDevices.push(dict);
}

for (const outputDevice of project.outputDevices) {
  const dict: Node = {
    id: `${outputDevice.pin}`, // Ensuring ID is a string
    type: "custom",
    data: {
      label: OUTPUT_DEVICE_INFO[outputDevice.device].name,
      name: OUTPUT_DEVICE_INFO[outputDevice.device].name,
      image: OUTPUT_DEVICE_IMAGES[outputDevice.device],
      description: OUTPUT_DEVICE_INFO[outputDevice.device].description,
      type: "output",
    },
    position: { x: 400, y: 200 },
  };
  outputDevices.push(dict);
}

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [...inputDevices, ...outputDevices];

export const Flow: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  return (
    <div className="flow-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
};
