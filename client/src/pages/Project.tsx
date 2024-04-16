import React from "react";
import { Link } from "react-router-dom";
import { EXAMPLE_PROJECTS } from "../constants/example-data";
import { useParams } from "react-router-dom";
import {
  INPUT_DEVICE_INFO,
  INPUT_DEVICE_IMAGES,
} from "../constants/device/input-device";
import {
  OUTPUT_DEVICE_INFO,
  OUTPUT_DEVICE_IMAGES,
} from "../constants/device/output-device";
import { ACTION_CONFIGS } from "../constants/action";
import { Action } from "../types/action";
import { useMutation } from "@tanstack/react-query";
import { downloadDemo } from "../api/download";

export const Project: React.FC = () => {
  const { projectId } = useParams();

  const downloadToBoardMutation = useMutation({
    mutationFn: downloadDemo,
  });

  const project = EXAMPLE_PROJECTS[projectId ? parseInt(projectId) ?? 0 : 0];

  /** @todo pull out interaction form into new component and handle multiple interactions */
  const actionConfig = ACTION_CONFIGS[Action.NEGATE_OUTPUT_ON_INPUT];

  const onDownload = () => {
    downloadToBoardMutation.mutate();
  };

  return (
    <div className="mx-md-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/">Projects</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {project.name}
          </li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h1 className="h2">{project.name}</h1>
        <span className="d-flex align-content-center gap-3">
          <button className="btn btn-secondary">Edit Project Data</button>
          <button
            className="btn btn-primary d-flex align-item-center justify-content-center"
            onClick={onDownload}
          >
            {downloadToBoardMutation.isPending ? (
              <div className="spinner-border" role="status"></div>
            ) : (
              <>Download To Board</>
            )}
          </button>
        </span>
      </div>
      <div className="list-group">
        <div className="list-group-item">
          <h2 className="h4">Input Devices</h2>
        </div>
        {project.inputDevices.map((deviceConfig, i) => {
          return (
            <div
              key={i}
              className="list-group-item d-flex flex-column flex-md-row align-items-center gap-3 py-3 px-5"
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  className="rounded"
                  height={75}
                  src={INPUT_DEVICE_IMAGES[deviceConfig.device]}
                  alt="Motion Sensor"
                />
                <div>
                  <p className="form-check-label m-0 p-0">
                    {INPUT_DEVICE_INFO[deviceConfig.device].name}
                  </p>
                  <small className="form-text text-muted">
                    {INPUT_DEVICE_INFO[deviceConfig.device].description}
                  </small>
                </div>
              </div>
              <form className="ms-md-auto">
                <label className="form-label d-block m-0" htmlFor="pin1">
                  Pin Number:
                </label>
                <div className="d-flex gap-3">
                  <input
                    className="form-control"
                    type="number"
                    name="pin1"
                    id="pin1"
                    min={0}
                    defaultValue={deviceConfig.id}
                  />
                  <button className="btn btn-secondary" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          );
        })}
        <div className="list-group-item">
          <h2 className="h4">Output Devices</h2>
        </div>
        {project.outputDevices.map((deviceConfig, i) => {
          return (
            <div
              key={i}
              className="list-group-item d-flex flex-column flex-md-row align-items-center gap-3 py-3 px-5"
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  className="rounded"
                  height={75}
                  src={OUTPUT_DEVICE_IMAGES[deviceConfig.device]}
                  alt="Motion Sensor"
                />
                <div>
                  <p className="form-check-label m-0 p-0">
                    {OUTPUT_DEVICE_INFO[deviceConfig.device].name}
                  </p>
                  <small className="form-text text-muted">
                    {OUTPUT_DEVICE_INFO[deviceConfig.device].description}
                  </small>
                </div>
              </div>
              <form className="ms-md-auto">
                <label className="form-label d-block m-0" htmlFor="pin1">
                  Pin Number:
                </label>
                <div className="d-flex gap-3">
                  <input
                    className="form-control"
                    type="number"
                    name="pin1"
                    id="pin1"
                    min={0}
                    defaultValue={deviceConfig.id}
                  />
                  <button className="btn btn-secondary" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>
      <div className="mt-5">
        <h2 className="h4 mb-3">Device Interaction Design</h2>
        <form>
          <label className="h5 mb-2">Interaction Type</label>
          <div className="d-flex align-items-center justify-content-between">
            <select className="form-select w-75">
              <option>
                {actionConfig.name}: {actionConfig.description}
              </option>
            </select>
            <button className="btn btn-primary">Add Interaction</button>
          </div>
        </form>
        <div className="list-group mt-5">
          <div className="list-group-item p-4">
            <form className="d-flex flex-column">
              <fieldset>
                <div className="d-flex align-items-center justify-content-between">
                  <legend className="h5">
                    <span className="fw-bold">Interaction 1:</span>{" "}
                    {actionConfig.name}
                  </legend>
                  <button className="btn btn-danger">Remove</button>
                </div>
              </fieldset>
              <label className="h6 mt-3 mb-2 fw-bold">Input Device</label>
              <select className="form-select">
                <option>Button - Pin 11</option>
              </select>

              <label className="h6 mt-4 mb-2 fw-bold">Output Device</label>
              <select className="form-select">
                <option>LED - Pin 13</option>
              </select>

              {actionConfig.additionalVariables && (
                <>
                  <label className="h6 mt-4 mb-2 fw-bold">
                    Interaction Variables
                  </label>
                  {actionConfig.additionalVariables.map((variable, i) => {
                    return (
                      <div className="mb-3" key={i}>
                        <label className="form-label" htmlFor={variable.name}>
                          {variable.description}
                        </label>
                        <input
                          className="form-control"
                          type={"number"}
                          name={variable.name}
                          id={variable.name}
                          min={0}
                          defaultValue={1000}
                        />
                      </div>
                    );
                  })}
                </>
              )}
              <button type="submit" className="btn btn-secondary ms-auto">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
