import axios from "axios";
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
}: Partial<Project>): Promise<Project> => {
  return axios.post(
    `${API_URL}/arduino/projects/`,
    { name },
    {
      withCredentials: true,
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken",
      // headers: getHeaders(),
    }
  );
};
