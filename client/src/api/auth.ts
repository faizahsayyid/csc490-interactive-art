import axios from "axios";
import { API_URL } from "./config";

type User = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: User): Promise<void> => {
  console.log("logging in");
  const data = await axios.post(`${API_URL}/accounts/login/`, {
    username: email,
    email,
    password,
  });

  console.log("data_access", data);

  // @ts-expect-error - access is in the response
  localStorage.setItem("token", data.access);
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/accounts/logout/`);
  localStorage.setItem("token", "");
};

export const register = async ({ email, password }: User): Promise<void> => {
  const data = await axios.post(`${API_URL}/accounts/register/`, {
    username: email,
    email,
    password,
  });

  // @ts-expect-error - access is in the response
  localStorage.setItem("token", data.access);
};
