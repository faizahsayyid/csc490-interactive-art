import React from "react";
import {
  InputDevicePinForm,
  OutputDevicePinForm,
} from "../components/device/DevicePinForm";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../api/project";
import { useParams } from "react-router-dom";

export const ReviewDesign: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const projectQueryResult = useQuery({
    queryKey: ["getProjectById", projectId],
    queryFn: () => getProjectById({ projectId }),
  });

  const project = projectQueryResult.data;

  if (projectQueryResult.isLoading) {
    return <div>Loading...</div>;
  }

  if (projectQueryResult.isError) {
    return <div>Error: {projectQueryResult.error.message}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="d-flex flex-column">
      <h1 className="h3 my-4">
        <b className="fw-bold">Review:</b> {project.name}
      </h1>
      <div className="list-group">
        <div className="list-group-item">
          <h2 className="h4">Interactions</h2>
        </div>
        {project.interactions.map((interaction, i) => {
          return (
            <div key={i} className="list-group-item p-3">
              <h3 className="h5">
                <b className="fw-bold">Interaction {i + 1}:</b>{" "}
                {interaction.action_key}
              </h3>
              <h4 className="h6 fw-bold mt-4">Input Device</h4>
              <InputDevicePinForm
                projectId={projectId as string}
                deviceId={interaction.inputDevice.id as string}
                inputDevice={interaction.inputDevice.device}
                pin={interaction.inputDevice.pin}
              />
              <h4 className="h6 fw-bold mt-4">Output Device</h4>
              <OutputDevicePinForm
                projectId={projectId as string}
                deviceId={interaction.outputDevice.id as string}
                outputDevice={interaction.outputDevice.device}
                pin={interaction.outputDevice.pin}
              />
            </div>
          );
        })}
      </div>
      <button className="btn btn-primary mt-5 ms-auto">
        Upload Design To Board
      </button>
    </div>
  );
};
