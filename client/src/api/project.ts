import axios from "axios";
import { API_URL } from "./config";
import { Project } from "../types/project";

export const getProjects = async (): Promise<void> => {
  return axios.get(`${API_URL}/arduino/projects/`);
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