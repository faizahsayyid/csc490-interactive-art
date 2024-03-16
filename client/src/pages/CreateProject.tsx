import React from "react";

import { useNavigate } from "react-router-dom";

import motionSensorImage from "../assets/images/motion-sensor.jpg";
import ledImage from "../assets/images/clear-led.jpg";
import soundSensorImage from "../assets/images/sound-sensor.jpg";
import buttonImage from "../assets/images/push-button.jpg";
import ledStripImage from "../assets/images/led-strip.jpg";
import motorImage from "../assets/images/motor.jpg";
import servoImage from "../assets/images/servo.jpg";
import audioPlayerImage from "../assets/images/audio-player.jpg";

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log({
      projectName: formData.get("projectName"),
      inputDevice: formData.get("inputDevice"),
      outputDevice: formData.get("outputDevice"),
    });

    navigate("/project/1");
  };

  return (
    <form className="mt-5 d-flex flex-column" onSubmit={onSubmit}>
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
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="lightSensorRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="inputDevice"
                id="lightSensorRadio"
                value="lightSensor"
              />
              <div>
                <p className="form-check-label m-0 p-0">Light Sensor (LED)</p>
                <small className="form-text text-muted">
                  Wire an LED to detect light in the environment
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={ledImage}
                alt="Light Sensor"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="motionSensorRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="inputDevice"
                id="motionSensorRadio"
                value="motionSensor"
              />
              <div>
                <p className="form-check-label m-0 p-0">Motion Sensor</p>
                <small className="form-text text-muted">
                  Detects movement in the environment
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={motionSensorImage}
                alt="Motion Sensor"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="soundSensorRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="inputDevice"
                id="soundSensorRadio"
                value="soundSensor"
              />
              <div>
                <p className="form-check-label m-0 p-0">Sound Sensor</p>
                <small className="form-text text-muted">
                  Detects sound in the environment
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={soundSensorImage}
                alt="Sound Sensor"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="buttonRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="inputDevice"
                id="buttonRadio"
                value="button"
              />
              <div>
                <p className="form-check-label m-0 p-0">Button</p>
                <small className="form-text text-muted">
                  A simple push button
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={buttonImage}
                alt="Push Button"
              />
            </label>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mt-4">Output Device</legend>
        <div className="list-group">
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="ledRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="outputDevice"
                id="ledRadio"
                value="led"
              />
              <div>
                <p className="form-check-label m-0 p-0">LED</p>
                <small className="form-text text-muted">
                  Wire an LED to emit light
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={ledImage}
                alt="LED"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="ledStripRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="outputDevice"
                id="ledStripRadio"
                value="ledStrip"
              />
              <div>
                <p className="form-check-label m-0 p-0">Tri-Colour LED Strip</p>
                <small className="form-text text-muted">
                  A strip of LEDs that can emit various colours
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={ledStripImage}
                alt="LED Strip"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="motorRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="outputDevice"
                id="motorRadio"
                value="motor"
              />
              <div>
                <p className="form-check-label m-0 p-0">Motor</p>
                <small className="form-text text-muted">
                  Spin objects with rotational motion
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={motorImage}
                alt="Motor"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="zipServoRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="outputDevice"
                id="zipServoRadio"
                value="zipServo"
              />
              <div>
                <p className="form-check-label m-0 p-0">Zip Servo</p>
                <small className="form-text text-muted">
                  Attach objects to a zip servo to move them linearly
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={servoImage}
                alt="Zip Servo"
              />
            </label>
          </div>
          <div className="list-group-item">
            <label
              className="form-check d-flex flex-column flex-sm-row align-items-center gap-5 py-2 px-5"
              htmlFor="audioPlayerRadio"
            >
              <input
                className="form-check-input"
                type="radio"
                name="outputDevice"
                id="audioPlayerRadio"
                value="audioPlayer"
              />
              <div>
                <p className="form-check-label m-0 p-0">Audio Player</p>
                <small className="form-text text-muted">
                  Upload mp3 files, and play audio based on a trigger
                </small>
              </div>
              <img
                className="rounded ms-sm-auto"
                height={75}
                src={audioPlayerImage}
                alt="Audio Player"
              />
            </label>
          </div>
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary mt-4 ms-auto">
        Create Project
      </button>
    </form>
  );
};
