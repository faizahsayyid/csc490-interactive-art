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
import { v4 as uuidv4 } from "uuid";
import { ActionVariable } from "../../types/action";
import { Project } from "../../types/project";
import { DeviceConfig } from "../../types/project";
import { Interaction } from "../../types/project";
import {
  InteractionFlowToInteraction,
  InputNodeToInputDevice,
  OutputNodeToOutputDevice,
} from "./utils";

// import axios from "axios";

const start_y = 200;
const y_step = 100;
const input_x = 200;
const output_x = 800;

const nodeTypes = {
  custom: CustomNode,
};

// const edgeTypes = {
//   custom: CustomEdge,
// };

interface CurrentConnection {
  id: string | null;
  source: any | null;
  target: any | null;
}

interface InteractionFlow {
  id: string; // Same as id of edge
  sourceDevice: Node;
  targetDevice: Node;
  action: ActionVariable;
  args: Record<string, any>;
}

export const Flow: React.FC = () => {
  const { projectId } = useParams();
  const project_example =
    EXAMPLE_PROJECTS[projectId ? parseInt(projectId) ?? 0 : 0];

  const [project, setProject] = useState<Project>({
    id: projectId ?? "default-project-id",
    name: project_example.name,
    inputDevices: [],
    outputDevices: [],
    interactions: [],
    lastModified: new Date(),
  });

  const [currentConnection, setCurrentConnection] = useState<CurrentConnection>(
    { id: null, source: null, target: null }
  );
  const [interactions, setInteractions] = useState<InteractionFlow[]>([]);

  const [showDeviceModal, setShowDeviceModal] = useState(false); // State to handle modal visibility
  const [showInteractionModal, setShowInteractionModal] = useState(false); // State to handle modal visibility

  const toggleDeviceModal = () => setShowDeviceModal(!showDeviceModal);
  const toggleInteractionModal = () => {
    setShowInteractionModal(!showInteractionModal);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const numInputDevices: number = nodes.filter(
    (node) => node.data.type === "input"
  ).length;
  const numOutputDevices: number = nodes.filter(
    (node) => node.data.type === "output"
  ).length;
  if (numInputDevices + numOutputDevices !== nodes.length) {
    console.error("Error: Incorrect number of input and output devices");
  }

  useEffect(() => {
    let inputDevices = nodes.filter((node) => node.data.type === "input");
    let outputDevices = nodes.filter((node) => node.data.type === "output");
    console.log("Input devices:", inputDevices);
    console.log("Output devices:", outputDevices);
    console.log("Interactions:", interactions);
    console.log("edges:", edges);
    // setProject({
    //   ...project,
    //   inputDevices: inputDevices.map((device) => device.data),
    //   outputDevices: outputDevices.map((device) => device.data),
    //   interactions: interactions,
    //   lastModified: new Date(),
    // });
  }, [nodes, edges, interactions]);


  const [lastAddedEdge, setLastAddedEdge] = useState<any | null>(null);

  useEffect(() => {
    if (interactions.length !== edges.length && !currentConnection.id) {
      alert("Error: Interaction count does not match edge count");
    }
  }, [interactions, edges]);

  useEffect(() => {
    const initialInputDevices = project_example.inputDevices.map(
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

    const initialOutputDevices = project_example.outputDevices.map(
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

    setNodes([...initialInputDevices, ...initialOutputDevices]);
  }, []);

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
        position: { x: input_x, y: start_y + y_step * numInputDevices },
      };
      const newNodes = [...nodes, node];
      setNodes(newNodes);
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
        position: { x: output_x, y: start_y + y_step * numOutputDevices },
      };
      const newNodes = [...nodes, node];
      setNodes(newNodes);
    }
    toggleDeviceModal();
  };

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
      setInteractions((prevInteractions) =>
        prevInteractions.filter((interaction) => interaction.id !== edgeId)
      );
    },
    [setEdges, setInteractions]
  );

  const handleInteractionConfirm = (
    id: string,
    sourceDevice: any,
    targetDevice: any,
    action: ActionVariable,
    args: Record<string, any>
  ) => {
    setInteractions([
      ...interactions,
      { id, sourceDevice, targetDevice, action, args },
    ]);
    toggleInteractionModal();
    setCurrentConnection({ id: null, source: null, target: null });
  };

  const handleCancelInteraction = () => {
    console.log("Cancelling interaction: ", lastAddedEdge);
    if (lastAddedEdge) {
      setEdges((currentEdges) => {
        const newEdges = currentEdges.filter(
          (edge) => edge.id !== lastAddedEdge
        );
        return newEdges;
      });
      setLastAddedEdge(null);
    }
    toggleInteractionModal();
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = { ...params, id: uuidv4(), type: "custom" };
      setEdges((els) => {
        const updatedEdges = addEdge(newEdge, els);
        setLastAddedEdge(newEdge.id);
        return updatedEdges;
      });

      let sourceNode = nodes.find((node) => node.id === params.source);
      let targetNode = nodes.find((node) => node.id === params.target);

      setCurrentConnection({
        id: newEdge.id,
        source: sourceNode,
        target: targetNode,
      });
      toggleInteractionModal();
    },
    [setEdges, nodes, toggleInteractionModal]
  );

  useEffect(() => {
    let currInputs = nodes.filter((node) => node.data.type === "input");
    let currOutputs = nodes.filter((node) => node.data.type === "output");
    let inputDevices: DeviceConfig<InputDevice>[] = currInputs.map((input) =>
      InputNodeToInputDevice(input)
    );
    let outputDevices: DeviceConfig<OutputDevice>[] = currOutputs.map(
      (output) => OutputNodeToOutputDevice(output)
    );
    let projectInteractions: Interaction[] = interactions.map((interaction) =>
      InteractionFlowToInteraction(interaction)
    );
    let lastModified = new Date();
    let CurrentProject: Project = {
      id: project.id,
      name: project.name,
      inputDevices: inputDevices,
      outputDevices: outputDevices,
      interactions: projectInteractions,
      lastModified: lastModified,
    };
    console.log("Current project:", CurrentProject);
    setProject(CurrentProject);
  }, [nodes, edges, interactions]);

  return (
    <div className="flow-container">
      <div className="position-absolute top-12 start-0 ms-4 mt-2 p-3 bread">
        <nav className="bread" aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item" aria-current="page">
              <Link to="/">Projects</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {project_example.name}
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
        edgeTypes={{
          custom: (edgeProps) => (
            <CustomEdge {...edgeProps} onDelete={handleEdgeDelete} />
          ),
        }}
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
        onHide={handleCancelInteraction}
        onConfirm={handleInteractionConfirm}
        id={currentConnection.id}
        sourceDevice={currentConnection.source}
        targetDevice={currentConnection.target}
      />
    </div>
  );
};

export type { InteractionFlow };
