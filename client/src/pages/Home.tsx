import React from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { Link } from "react-router-dom";
import { EXAMPLE_PROJECTS } from "../constants/example-data";

export const Home: React.FC = () => {
  const projects = EXAMPLE_PROJECTS;
  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <h1 className="h3">Please login to view all projects</h1>
        <Link to="/login" className="btn btn-primary mt-3">
          Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between my-5 ms-2">
        <h1 className="h3">All Projects</h1>
        <div>
          <Link to="/create" className="btn btn-primary align-items-center d-flex">
            New Project
          </Link>
        </div>
      </div>
      <ProjectTable projects={projects} />
    </>
  );
};
