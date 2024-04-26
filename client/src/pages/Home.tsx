import React, { useEffect, useState } from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { getProjects } from "../api/project";
import axios from "axios";
import { CreateProjectModal } from "../components/project/CreateProjectModal";
import { Project } from "../types/project";
import { API_URL } from "../api/config";

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProjects(token).then((data) => {
        // @ts-ignore
        console.log(data.data);
        // @ts-ignore
        setProjects(data.data);
      });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/accounts/test/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
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
