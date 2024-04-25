import React, { useEffect, useState } from "react";
import { ProjectTable } from "../components/project/ProjectTable";
import { Link } from "react-router-dom";
import { Project } from "../types/project";
import axios from "axios";
import { API_URL } from "../api/config";

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getProjects = async () => {
        const response = await axios.get(`${API_URL}/arduino/projects/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.data;
        if (response.status !== 200) {
          console.log(data["error"]);
          return [];
        }
        setProjects(data);
      };
      getProjects();
    }
  }
  , []);
  
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
