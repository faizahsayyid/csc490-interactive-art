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
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { Link } from "react-router-dom";
import "./Flow.css";
import "reactflow/dist/style.css";
import DeviceModal from "./DeviceModal";
import InteractionModal from "./InteractionModal";
import { DeviceInfo } from "../../types/device/device";
import { InputDevice } from "../../types/device/input-device";
import { OutputDevice } from "../../types/device/output-device";
import { v4 as uuidv4 } from "uuid"; // Importing the UUID function

const start_y = 200;
const y_step = 100;
const input_x = 200;
const output_x = 800;

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface CurrentConnection {
  source: any | null;
  target: any | null;
}

export const Flow: React.FC = () => {
  const { projectId } = useParams();
  const project = EXAMPLE_PROJECTS[projectId ? parseInt(projectId) ?? 0 : 0];
  const [inputDevices, setInputDevices] = useState<Node[]>([]);
  const [outputDevices, setOutputDevices] = useState<Node[]>([]);
  const [currentConnection, setCurrentConnection] = useState<CurrentConnection>(
    { source: null, target: null }
  );

  const [showDeviceModal, setShowDeviceModal] = useState(false); // State to handle modal visibility
  const [showInteractionModal, setShowInteractionModal] = useState(false); // State to handle modal visibility

  const toggleDeviceModal = () => setShowDeviceModal(!showDeviceModal);
  const toggleInteractionModal = () => {
    setShowInteractionModal(!showInteractionModal);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialInputDevices = project.inputDevices.map(
      (inputDevice, index) => ({
        id: uuidv4(),
        type: "custom",
        data: {
          label: INPUT_DEVICE_INFO[inputDevice.device].name,
          name: INPUT_DEVICE_INFO[inputDevice.device].name,
          image: INPUT_DEVICE_IMAGES[inputDevice.device],
          description: INPUT_DEVICE_INFO[inputDevice.device].description,
          type: "input",
        },
        position: { x: input_x, y: start_y + y_step * index },
      })
    );

    const initialOutputDevices = project.outputDevices.map(
      (outputDevice, index) => ({
        id: uuidv4(),
        type: "custom",
        data: {
          label: OUTPUT_DEVICE_INFO[outputDevice.device].name,
          name: OUTPUT_DEVICE_INFO[outputDevice.device].name,
          image: OUTPUT_DEVICE_IMAGES[outputDevice.device],
          description: OUTPUT_DEVICE_INFO[outputDevice.device].description,
          type: "output",
        },
        position: { x: output_x, y: start_y + y_step * index },
      })
    );

    setInputDevices(initialInputDevices);
    setOutputDevices(initialOutputDevices);
  }, []);

  useEffect(() => {
    setNodes([...inputDevices, ...outputDevices]);
  }, [inputDevices, outputDevices]);

  const handleAddDevice = (deviceType: string, deviceInfo: DeviceInfo) => {
    console.log("Adding device:", deviceType, deviceInfo);
    if (deviceType === "input") {
      let node: Node = {
        id: uuidv4(),
        type: "custom",
        data: {
          label: deviceInfo.name,
          name: deviceInfo.name,
          image:
            INPUT_DEVICE_IMAGES[
              deviceInfo.name.toUpperCase().replace(" ", "_") as InputDevice
            ],
          description: deviceInfo.description,
          type: "input",
        },
        position: { x: input_x, y: start_y + y_step * inputDevices.length },
      };
      inputDevices.push(node);
    } else if (deviceType === "output") {
      let node: Node = {
        id: uuidv4(),
        type: "custom",
        data: {
          label: deviceInfo.name,
          name: deviceInfo.name,
          image:
            OUTPUT_DEVICE_IMAGES[
              deviceInfo.name.toUpperCase().replace(" ", "_") as OutputDevice
            ],
          description: deviceInfo.description,
          type: "output",
        },
        position: { x: output_x, y: start_y + y_step * outputDevices.length },
      };
      outputDevices.push(node);
    }
    setNodes([...inputDevices, ...outputDevices]);
    toggleDeviceModal();
  };

  const handleInteractionConfirm = () => {
    console.log("Interaction confirmed");
    toggleInteractionModal(); // Optionally close modal on confirm
    setCurrentConnection({ source: null, target: null });
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = { ...params, type: "custom" }; // Ensure new edges use the custom edge type
      setEdges((els) => addEdge(newEdge, els));

      let sourceNode = nodes.find((node) => node.id === params.source);
      let targetNode = nodes.find((node) => node.id === params.target);
      
      setCurrentConnection({ source: sourceNode, target: targetNode });
      toggleInteractionModal();
    },
    [setEdges, nodes, toggleInteractionModal]
  );

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
    updateSize();

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
        sourceDevice={currentConnection.source}
        targetDevice={currentConnection.target}
      />
    </div>
  );
};
