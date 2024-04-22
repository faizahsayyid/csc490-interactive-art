import React from "react";

export const Help: React.FC = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <h2 className="h3">Quick Start Guide</h2>
      <div
        className="my-3"
        style={{
          backgroundColor: "lightgray",
          color: "black",
          width: "50%",
          margin: "auto",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        TODO: Put Demo Video Here
      </div>
      <h2 className="h3">Required Installations</h2>
      <h3 className="h5 fw-bold">Arduino CLI</h3>
      <p>
        The Arduino CLI is a command line tool that is used behind the scenes to
        compile and upload code to an Arduino board. It is required to be
        installed on your computer in order to use this application.
      </p>
      <p>
        You can download the Arduino CLI from the official Arduino website:{" "}
        <a href="https://arduino.github.io/arduino-cli/0.35/installation/">
          https://arduino.github.io/arduino-cli/0.35/installation/
        </a>
        .
      </p>
      <h3 className="h5 fw-bold">Device Specific Libraries</h3>
      <p>
        If you are using any of the following devices, you will need to install
        the associated libraries:
      </p>
      <div>
        <p className="fw-bold">LED Strip</p>
        <ul>
          <li>
            Required: <a href="https://fastled.io/">FastLED</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
