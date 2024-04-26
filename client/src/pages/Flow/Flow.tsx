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
// import { EXAMPLE_PROJECTS } from "../../constants/example-data";
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
import axios from "axios";
import { API_URL } from "../../api/config";

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
  useEffect(() => {
    console.log("Testing axios");
    axios
      .get(`${API_URL}:8000/accounts/test/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/arduino/projects/${projectId}/`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        let project = response.data;
        console.log("Project:", project);
        let projectID = project.id;
        let projectName = project.name;
        let inputDevices = project.input_devices;
        let outputDevices = project.output_devices;
        let interactions = project.interactions;
        let lastModified = project.lastModified;
        let CurrentProject: Project = {
          id: projectID,
          name: projectName,
          inputDevices: inputDevices,
          outputDevices: outputDevices,
          interactions: interactions,
          lastModified: lastModified,
        };
        setProject(CurrentProject);
        console.log("Current project:", CurrentProject);

        const initialInputDevices = project.input_devices.map(
          (inputDevice: DeviceConfig<InputDevice>, index: number) => (
            console.log("Input Device:", inputDevice),
            {
              id: uuidv4(),
              type: "custom",
              data: {
                // @ts-ignore
                label: INPUT_DEVICE_INFO[inputDevice.device_name].name,
                // @ts-ignore
                name: INPUT_DEVICE_INFO[inputDevice.device_name].name,
                // @ts-ignore
                image: INPUT_DEVICE_IMAGES[inputDevice.device_name],
                // @ts-ignore
                description: INPUT_DEVICE_INFO[inputDevice.device_name].description,
                type: "input",
              },
              position: { x: input_x, y: start_y + y_step * index },
            }
          )
        );

        const initialOutputDevices = project.output_devices.map(
          (outputDevice: any, index: number) => ({
            id: uuidv4(),
            type: "custom",
            data: {
              // @ts-ignore
              label: OUTPUT_DEVICE_INFO[outputDevice.device_name].name,
              // @ts-ignore
              name: OUTPUT_DEVICE_INFO[outputDevice.device_name].name,
              // @ts-ignore
              image: OUTPUT_DEVICE_IMAGES[outputDevice.device_name],
              // @ts-ignore
              description: OUTPUT_DEVICE_INFO[outputDevice.device_name].description,
              type: "output",
            },
            position: { x: output_x, y: start_y + y_step * index },
          })
        );

        setNodes([...initialInputDevices, ...initialOutputDevices]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const { projectId } = useParams();
  console.log("Project ID:", projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const [currentConnection, setCurrentConnection] = useState<CurrentConnection>(
    { id: null, source: null, target: null }
  );
  const [interactions, setInteractions] = useState<InteractionFlow[]>([]);

  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

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

  const [lastAddedEdge, setLastAddedEdge] = useState<any | null>(null);

  useEffect(() => {
    // Delete interactions with no corresponding edge
    setInteractions((prevInteractions) =>
      prevInteractions.filter((interaction) =>
        edges.some((edge) => edge.id === interaction.id)
      )
    );
  }, [edges]);

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
    if (!project) {
      return;
    }

    // @TODO - Save modified project state to backend
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

  const saveProject = useCallback(() => {
    if (!project) {
      return;
    }
    changeSavingState();

    console.log("Putting project to backend:", project);
    axios
      .put(`${API_URL}/arduino/projects/${projectId}/`, project, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error in axios put:", error);
      });
  }, [project]);

  const changeSavingState = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   saveProject(); // Automatically save when project changes
  // }, [nodes, edges, interactions]); // React on changes in project

  return (
    <div className="flow-container">
      {/* <button onClick={saveProject}>Save Project</button> */}
      <div className="position-absolute top-12 start-0 ms-4 mt-2 p-3 bread top_bar">
        <div className="top_bar">
          <nav className="bread" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" aria-current="page">
                <Link to="/">Projects</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {project && project.name}
              </li>
            </ol>
          </nav>
          <div onClick={saveProject} className="top_button">
            {saving ? "Saved" : "Click to Save Project"}
            </div>
        </div>
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
      <div className="position-fixed bottom-0 end-0 me-4 mb-4 p-3">
        <button className="btn btn-primary me-3" onClick={toggleDeviceModal}>
          Add New Device
        </button>
        <Link className="btn btn-primary" to={`/project/${projectId}/review`}>
          Upload Design To Board
        </Link>
      </div>

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
