import axios, { AxiosResponse } from "axios";
import { API_URL } from "./config";
import { Project } from "../types/project";
import { getHeaders } from "./getHeaders";

export const getProjects = async (token: string): Promise<Project[]> => {
  return axios.get(`${API_URL}/arduino/projects/`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const getProjectById = async ({
  projectId,
}: {
  projectId?: string;
}): Promise<Project> => {
  return axios.get(`${API_URL}/arduino/projects/${projectId}/`, {
    headers: getHeaders(),
  });
};

export const createProject = async ({
  name,
}: Partial<Project>): Promise<AxiosResponse<Project>> => {
  return axios.post(
    `${API_URL}/arduino/projects/`,
    { name },
    {
      headers: getHeaders(),
    }
  );
};
