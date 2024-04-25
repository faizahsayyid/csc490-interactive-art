import axios from "axios";
import { API_URL } from "./config";
import { Project } from "../types/project";

export const getProjects = async (token: string): Promise<Project[]> => {
  return axios.get(`${API_URL}/arduino/projects/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProjectById = async ({
  projectId,
}: {
  projectId?: string;
}): Promise<Project> => {
  return axios.get(`${API_URL}/arduino/projects/${projectId}`);
};

export const createProject = async ({
  name,
}: {
  name: string;
}): Promise<Project> => {
  return axios.post(`${API_URL}/arduino/projects/`, { name });
};
