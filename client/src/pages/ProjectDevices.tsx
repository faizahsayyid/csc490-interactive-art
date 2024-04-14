import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { EXAMPLE_PROJECTS } from "../constants/example-data";
import {
  INPUT_DEVICE_INFO,
  INPUT_DEVICE_IMAGES,
} from "../constants/device/input-device";
import {
  OUTPUT_DEVICE_INFO,
  OUTPUT_DEVICE_IMAGES,
} from "../constants/device/output-device";
import styles from "./ProjectDevices.module.scss";

export const ProjectDevices: React.FC = () => {
  const { projectId } = useParams();

  const project = EXAMPLE_PROJECTS[projectId ? parseInt(projectId) ?? 0 : 0];

  const handleDotClick = (deviceIndex: number, deviceType: string) => {
    console.log(`Red dot clicked for ${deviceIndex} ${deviceType}!`);
  };

  return (
    <div className="container-fluid">
      {/* Top Section */}
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Projects</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {project.name}
              </li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
            <h1 className="h2">{project.name}</h1>
          </div>
        </div>
      </div>

      {/* Columns for Devices */}
      <div className="row">
        {/* Left Column for Input Devices */}
        <div className="col-md-3 bg-secondary rounded d-flex flex-column">
          <h4 className={styles.rowHeader}>Input Devices</h4>
          <div className="flex-grow-1 d-flex flex-column justify-content-evenly">
            {project.inputDevices.map((deviceConfig, i) => (
              <div key={i} className={`card mb-3 ${styles.cardContainer}`}>
                <div
                  className={`${styles.redDot} ${styles.inputDot}`}
                  onClick={() => handleDotClick(i, "input")}
                ></div>
                <div className="card-body">
                  <img
                    className="img-fluid rounded"
                    src={INPUT_DEVICE_IMAGES[deviceConfig.device]}
                    alt={INPUT_DEVICE_INFO[deviceConfig.device].name}
                  />
                  <h5 className="mt-2">
                    {INPUT_DEVICE_INFO[deviceConfig.device].name}
                  </h5>
                  <p className="mb-1">
                    {INPUT_DEVICE_INFO[deviceConfig.device].description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle space left intentionally empty */}
        <div className="col-md-6"></div>

        {/* Right Column for Output Devices */}
        <div className="col-md-3 bg-secondary rounded d-flex flex-column">
          <h4 className={styles.rowHeader}>Output Devices</h4>
          <div className="flex-grow-1 d-flex flex-column justify-content-between">
            {project.outputDevices.map((deviceConfig, i) => (
              <div key={i} className={`card mb-3 ${styles.cardContainer}`}>
                <div
                  className={`${styles.redDot} ${styles.outputDot}`}
                  onClick={() => handleDotClick(i, "input")}
                ></div>
                <div className="card-body">
                  <img
                    className="img-fluid rounded"
                    src={OUTPUT_DEVICE_IMAGES[deviceConfig.device]}
                    alt={OUTPUT_DEVICE_INFO[deviceConfig.device].name}
                  />
                  <h5 className="mt-2">
                    {OUTPUT_DEVICE_INFO[deviceConfig.device].name}
                  </h5>
                  <p className="mb-1">
                    {OUTPUT_DEVICE_INFO[deviceConfig.device].description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
