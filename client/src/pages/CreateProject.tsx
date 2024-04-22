import React, { useEffect } from "react";

// import { useNavigate } from "react-router-dom";
import {
  INPUT_DEVICE_INFO,
  INPUT_DEVICE_IMAGES,
} from "../constants/device/input-device";

import {
  OUTPUT_DEVICE_IMAGES,
  OUTPUT_DEVICE_INFO,
} from "../constants/device/output-device";
import { InputDevice } from "../types/device/input-device";
import { OutputDevice } from "../types/device/output-device";
import axios from "axios";

export const CreateProject: React.FC = () => {
  // const navigate = useNavigate();

  const getFormValue = (formData: FormData, name: string): number => {
    const value = formData.get(name);
    return typeof value === "string" ? parseInt(value) : 0;
  };

  /**
   * @todo Add validation for form fields
   */
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submitting form");
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const inputDeviceFormData = Object.values(InputDevice).reduce(
      (acc, curr) => ({ ...acc, [curr]: getFormValue(formData, curr) }),
      {}
    );

    const outputDeviceFormData = Object.values(OutputDevice).reduce(
      (acc, curr) => ({ ...acc, [curr]: getFormValue(formData, curr) }),
      {}
    );

    console.log({
      projectName: formData.get("projectName"),
      ...inputDeviceFormData,
      ...outputDeviceFormData,
    });

    axios
      .post("http://127.0.0.1:8000/arduino/create-project/", {
        name: formData.get("projectName"),
        input_devices: inputDeviceFormData,
        output_devices: outputDeviceFormData,
      })
      .then((response) => {
        console.log(response);
        // navigate(`/project/${response.data.id}`);
      })
      .catch((error) => {
        console.error(error);
      });

    // navigate("/project/1");
  };

  return (
    <form className="mt-5 d-flex flex-column mx-md-5" onSubmit={onSubmit}>
      <fieldset>
        <legend className="form-label">Project Name</legend>
        <input
          type="text"
          name="projectName"
          className="form-control"
          aria-describedby="project name"
          placeholder="Enter a name for your project"
        />
      </fieldset>
      <fieldset>
        <legend className="mt-4">Input Device</legend>
        <div className="list-group">
          {Object.values(InputDevice).map((inputDevice: InputDevice) => {
            const deviceInfo = INPUT_DEVICE_INFO[inputDevice];
            return (
              <div key={inputDevice} className="list-group-item">
                <label
                  className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
                  htmlFor={inputDevice}
                >
                  <input
                    className="form-control"
                    style={{ width: 50 }}
                    type="number"
                    name={inputDevice}
                    id={inputDevice}
                    min={0}
                    defaultValue={0}
                  />
                  <div>
                    <p className="form-check-label m-0 p-0">
                      {deviceInfo.name}
                    </p>
                    <small className="form-text text-muted">
                      {deviceInfo.description}
                    </small>
                  </div>
                  <img
                    className="rounded ms-sm-auto"
                    height={75}
                    src={INPUT_DEVICE_IMAGES[inputDevice as InputDevice]}
                    alt={deviceInfo.name}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mt-4">Output Device</legend>
        <div className="list-group">
          {Object.values(OutputDevice).map((outputDevice: OutputDevice) => {
            const deviceInfo = OUTPUT_DEVICE_INFO[outputDevice];
            return (
              <div key={outputDevice} className="list-group-item">
                <label
                  className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
                  htmlFor={outputDevice}
                >
                  <input
                    className="form-control"
                    style={{ width: 50 }}
                    type="number"
                    name={outputDevice}
                    id={outputDevice}
                    min={0}
                    defaultValue={0}
                  />
                  <div>
                    <p className="form-check-label m-0 p-0">
                      {deviceInfo.name}
                    </p>
                    <small className="form-text text-muted">
                      {deviceInfo.description}
                    </small>
                  </div>
                  <img
                    className="rounded ms-sm-auto"
                    height={75}
                    src={OUTPUT_DEVICE_IMAGES[outputDevice as OutputDevice]}
                    alt={deviceInfo.name}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary mt-4 ms-auto">
        Create Project
      </button>
    </form>
  );
};
