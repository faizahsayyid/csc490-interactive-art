import React from "react";
import motionSensorImage from "../assets/images/motion-sensor.jpg";
import ledStripImage from "../assets/images/led-strip.jpg";
import { Link } from "react-router-dom";

export const Project: React.FC = () => {
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/">Projects</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Spring Cleaning
          </li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h1 className="h2">Spring Cleaning</h1>
      </div>
      <div className="list-group">
        <div className="list-group-item d-flex flex-column flex-sm-row align-items-center gap-5 py-3 px-5">
          <div>
            <h2 className="h5">Input Device</h2>
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
          <div className="d-flex flex-column justify-content-center gap-2">
            <button className="d-block btn btn-primary">Edit</button>
            <button className="d-block btn btn-primary">Calibrate</button>
          </div>
        </div>
        <div className="list-group-item d-flex flex-column flex-sm-row align-items-center gap-5 py-3 px-5">
          <div>
            <h2 className="h5">Output Device</h2>
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
          <div className="d-flex flex-column justify-content-center gap-2">
            <button className="d-block btn btn-primary">Edit</button>
            <button className="d-block btn btn-primary">Calibrate</button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="h4">Interaction Design</h2>
        <form className="d-flex flex-column">
          <fieldset className="mt-2">
            <legend className="h5">Action</legend>
            <div className="d-flex justify-content-between align-items-center">
              <label>
                How many times does motion need to be sensed in order to trigger
                the reaction?
              </label>
              <input type="number" className="form-control w-25" />
            </div>
          </fieldset>
          <fieldset className="mt-3">
            <legend className="h5">Reaction</legend>
            <div className="d-flex justify-content-between align-items-center">
              <label>How many LEDs are in your LED strip?</label>
              <input type="number" className="form-control w-25" />
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <label>What will the action trigger the LED strip to do?</label>
              <select className="form-select w-25">
                <option>Toggle on and off</option>
                <option>Increase in brightness</option>
                <option>Decrease in brightness</option>
                <option>Change Colour</option>
                <option>Turn on each LED one by one</option>
              </select>
            </div>
          </fieldset>
          <span className="mt-4 ms-auto">
            <button type="submit" className="btn btn-primary me-2">
              Save
            </button>
            <button className="btn btn-primary" type="submit">
              Download To Board
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};
