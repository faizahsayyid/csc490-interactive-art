import React from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { Link } from "react-router-dom";
import { EXAMPLE_PROJECTS } from "../constants/example-data";

export const Home: React.FC = () => {
  const projects = EXAMPLE_PROJECTS;

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
