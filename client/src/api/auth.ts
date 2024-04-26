import axios from "axios";
import { API_URL } from "./config";

type User = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: User): Promise<void> => {

  const response = await axios.post(`${API_URL}/accounts/login/`, {
    username: email,
    password,
  });

  const data = response.data;

  if (response.status === 400) {
    console.log("error", data);
    alert(data["message"]);

  } else {
    localStorage.setItem("token", data.token);
    window.location.reload();
  }
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/accounts/logout/`);
  localStorage.removeItem("token");
  window.location.reload();
};

export const register = async ({email, password}: User): Promise<void> => {

  const response = await axios.post(`${API_URL}/accounts/register/`, {
    username: email,
    email,
    password
  });

  const data = response.data;

  if (response.status === 400) {
    console.log("error", data);
    if (data.username) {
      alert(`Email: ${data["username"]}`);
    }
    if (data.password) {
      alert(`Password: ${data["password"]}`);
    }

  } else {
    localStorage.setItem("token", data.token);
    window.location.reload();
  }
};
