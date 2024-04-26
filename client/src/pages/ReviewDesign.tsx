import React from "react";
import { EXAMPLE_PROJECTS } from "../constants/example-data";
import {
  INPUT_DEVICE_IMAGES,
  INPUT_DEVICE_INFO,
} from "../constants/device/input-device";
import {
  OUTPUT_DEVICE_IMAGES,
  OUTPUT_DEVICE_INFO,
} from "../constants/device/output-device";
import { ACTION_CONFIGS } from "../constants/action";
import { Action } from "../types/action";

export const ReviewDesign: React.FC = () => {
  const project = EXAMPLE_PROJECTS[0];

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
            <div key={i} className="list-group-item">
              <h3 className="h5">
                Interaction 1:{" "}
                {ACTION_CONFIGS[interaction.action_key as Action].description}
              </h3>
              <h4 className="h6 fw-bold mt-4">Input Device</h4>
              <div className="d-flex flex-column flex-md-row align-items-center gap-3 px-5 py-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    className="rounded"
                    height={75}
                    src={
                      INPUT_DEVICE_IMAGES[interaction.inputDeviceConfig.device]
                    }
                    alt="Motion Sensor"
                  />
                  <div>
                    <p className="form-check-label m-0 p-0">
                      {
                        INPUT_DEVICE_INFO[interaction.inputDeviceConfig.device]
                          .name
                      }
                    </p>
                    <small className="form-text text-muted">
                      {
                        INPUT_DEVICE_INFO[interaction.inputDeviceConfig.device]
                          .description
                      }
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
                      defaultValue={interaction.inputDeviceConfig.id}
                    />
                    <button className="btn btn-secondary" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <h4 className="h6 fw-bold mt-4">Output Device</h4>
              <div className="d-flex flex-column flex-md-row align-items-center gap-3 px-5 py-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    className="rounded"
                    height={75}
                    src={
                      OUTPUT_DEVICE_IMAGES[
                        interaction.outputDeviceConfig.device
                      ]
                    }
                    alt="Motion Sensor"
                  />
                  <div>
                    <p className="form-check-label m-0 p-0">
                      {
                        OUTPUT_DEVICE_INFO[
                          interaction.outputDeviceConfig.device
                        ].name
                      }
                    </p>
                    <small className="form-text text-muted">
                      {
                        OUTPUT_DEVICE_INFO[
                          interaction.outputDeviceConfig.device
                        ].description
                      }
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
                      defaultValue={interaction.outputDeviceConfig.id}
                    />
                    <button className="btn btn-secondary" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
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
