import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { EXAMPLE_PROJECTS } from "../../constants/example-data";
import { useParams } from "react-router-dom";
import {
  INPUT_DEVICE_INFO,
  INPUT_DEVICE_IMAGES,
} from "../../constants/device/input-device";
import {
  OUTPUT_DEVICE_INFO,
  OUTPUT_DEVICE_IMAGES,
} from "../../constants/device/output-device";
import { Modal, Button } from "react-bootstrap";

import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { Link } from "react-router-dom";
import "./Flow.css";
import "reactflow/dist/style.css";
import DeviceModal from "./DeviceModal";
import InteractionModal from "./InteractionModal";
import { DeviceInfo } from "../../types/device/device";
import { createDevice } from "./Utils"

export const Flow: React.FC = () => {
  const { projectId } = useParams();
  const project = EXAMPLE_PROJECTS[projectId ? parseInt(projectId) ?? 0 : 0];
  const start_y = 200;
  const y_step = 100;
  const input_x = 200;
  const output_x = 800;
  let inputDevices: Node[] = [];
  let outputDevices: Node[] = [];

  for (const inputDevice of project.inputDevices) {
    let node: Node = createDevice(
      inputDevice.device,
      INPUT_DEVICE_INFO,
      INPUT_DEVICE_IMAGES,
      inputDevices,
      input_x,
      start_y,
      y_step,
      "input",
      inputDevice.pin,
    );
    inputDevices.push(node);
  }

  for (const outputDevice of project.outputDevices) {
    let node: Node = createDevice(
      outputDevice.device,
      OUTPUT_DEVICE_INFO,
      OUTPUT_DEVICE_IMAGES,
      outputDevices,
      output_x,
      start_y,
      y_step,
      "output",
      outputDevice.pin,
    );
    outputDevices.push(node);
  }

  const nodeTypes = {
    custom: CustomNode,
  };

  const edgeTypes = {
    custom: CustomEdge,
  };

  const initialNodes: Node[] = [...inputDevices, ...outputDevices];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = { ...params, type: 'custom' }; // Ensure new edges use the custom edge type
      setEdges((els) => addEdge(newEdge, els));
      toggleInteractionModal();
    },
    [setEdges]
  );
  const [showDeviceModal, setShowDeviceModal] = useState(false); // State to handle modal visibility
  const [showInteractionModal, setShowInteractionModal] = useState(false); // State to handle modal visibility

  const toggleDeviceModal = () => setShowDeviceModal(!showDeviceModal);
  const toggleInteractionModal = () => setShowInteractionModal(!showInteractionModal);

  const handleAddDevice = (deviceType: string, deviceInfo: DeviceInfo) => {
    console.log('Adding device:', deviceType, deviceInfo);
    toggleDeviceModal();  
  };

  const handleInteractionConfirm = () => {
    console.log('Interaction confirmed');
    toggleInteractionModal();  // Optionally close modal on confirm
  };

  useEffect(() => {
    const updateSize = () => {
      const headerHeight = document.querySelector("header")?.clientHeight;
      const flowContainer = document.querySelector(
        ".flow-container"
      ) as HTMLElement;
      if (flowContainer) {
        flowContainer.style.height = `calc(100vh - ${headerHeight}px)`;
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize(); // Call the function once to set the initial height

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="flow-container">
      <div className="position-absolute top-12 start-0 ms-4 mt-2 p-3 bread">
        <nav className="bread" aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item" aria-current="page">
              <Link to="/">Projects</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {project.name}
            </li>
          </ol>
        </nav>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={true}
      >
        <Background />
      </ReactFlow>
      <button
        className="btn btn-primary position-fixed bottom-0 end-0 me-4 mb-4 p-3"
        onClick={toggleDeviceModal}
      >
        Add New Device
      </button>

      <DeviceModal
        showModal={showDeviceModal}
        toggleModal={toggleDeviceModal}
        onAddDevice={handleAddDevice}
      />

      <InteractionModal
        showModal={showInteractionModal}
        onHide={toggleInteractionModal}
        onConfirm={handleInteractionConfirm}
      />
    </div>
  );
};
