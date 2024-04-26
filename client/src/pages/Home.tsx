import React, { useEffect, useState } from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { getProjects } from "../api/project";
import { CreateProjectModal } from "../components/project/CreateProjectModal";
import { Project } from "../types/project";

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProjects(token).then((data) => {
        setProjects(data);
      });
    }
  }, []);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  console.log("token: ", localStorage.getItem("token"));

  return (
    <>
      <div className="d-flex justify-content-between my-5 ms-2">
        <h1 className="h3">All Projects</h1>
        <button
          className="btn btn-primary align-items-center d-flex"
          onClick={() => setShowNewProjectModal(true)}
        >
          New Project
        </button>
      </div>
      <ProjectTable projects={projects} />

      <CreateProjectModal
        showModal={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />
    </>
  );
};
