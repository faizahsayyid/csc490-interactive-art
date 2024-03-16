import React from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const projects = [
    {
      id: "1",
      name: "Atomic Structure Project",
      inputDeviceName: "Button",
      outputDeviceName: "Led",
      lastModified: new Date("2024-03-14"),
    },
    {
      id: "2",
      name: "Spring Cleaning",
      inputDeviceName: "Motion Sensor",
      outputDeviceName: "Led Strips",
      lastModified: new Date("2024-03-12"),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between my-5 ms-2">
        <h1 className="h3">All Projects</h1>
        <Link
          to="/create"
          className="btn btn-primary align-items-center d-flex"
        >
          New Project
        </Link>
      </div>
      <ProjectTable projects={projects} />
    </>
  );
};
