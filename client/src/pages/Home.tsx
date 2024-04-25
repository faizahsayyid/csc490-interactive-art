import React, { useEffect, useState } from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { Link } from "react-router-dom";
import { Project } from "../types/project";
import { getProjects } from "../api/project";

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProjects(token).then((data) => {
        setProjects(data);
      });
    }
  }
  , []);

  console.log("token: ", localStorage.getItem("token"));

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
