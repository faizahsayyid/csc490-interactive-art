import React from "react";

export const Help: React.FC = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <h2 className="h3">Demo</h2>
      <div className="d-flex justify-content-center">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/k9N-vT8DSAg?si=pgrOOeqvR1sd89fa"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
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
