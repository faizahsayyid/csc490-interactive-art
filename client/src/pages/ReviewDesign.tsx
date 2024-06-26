import React from "react";
import {
  InputDevicePinForm,
  OutputDevicePinForm,
} from "../components/device/DevicePinForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProjectById } from "../api/project";
import { useParams } from "react-router-dom";
import { uploadCodeToBoard } from "../api/download";
import { Modal, Spinner } from "react-bootstrap";
import {
  ACTION_TO_NAME,
  ACTION_TO_DESCRIPTION,
  INTERACTION_COLOR_MAP,
} from "./Flow/Constants";

export const ReviewDesign: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const projectQueryResult = useQuery({
    queryKey: ["getProjectById", projectId],
    queryFn: () => getProjectById({ projectId }),
  });

  const uploadCodeToBoardMutation = useMutation({
    mutationFn: uploadCodeToBoard,
  });

  const onUploadCodeToBoard = async () => {
    await uploadCodeToBoardMutation.mutateAsync(projectId as string);
  };

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
                <span
                  style={{
                    // @ts-ignore
                    color: `${INTERACTION_COLOR_MAP[interaction.action_key]}`,
                  }}
                >
                  {/* @ts-ignore */}
                  {ACTION_TO_NAME[interaction.action_key]}
                </span>
              </h3>
              <span style={{ color: "gray" }}>
                {/* @ts-ignore */}
                {ACTION_TO_DESCRIPTION[interaction.action_key]}
              </span>
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
      <button
        className="btn btn-primary mt-5 ms-auto"
        onClick={onUploadCodeToBoard}
      >
        Upload Design To Board
      </button>
      <Modal show={uploadCodeToBoardMutation.isPending} centered>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <Spinner />
            <p className="p-0 m-0">Uploading design to board...</p>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={uploadCodeToBoardMutation.isSuccess} centered>
        <Modal.Body>
          Your design has been successfully uploaded to the board!
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => uploadCodeToBoardMutation.reset()}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={uploadCodeToBoardMutation.isError} centered>
        <Modal.Body>
          <p>There was an error uploading your design to the board.</p>
          <code>{uploadCodeToBoardMutation.error?.message}</code>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => uploadCodeToBoardMutation.reset()}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
