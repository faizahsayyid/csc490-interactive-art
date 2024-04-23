import axios from "axios";
import { API_URL } from "./config";

type User = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: User): Promise<void> => {
  
  try {
    const response = await fetch(`${API_URL}/accounts/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status === 400) {
      console.log("error", data);
    } else {
      console.log(data);
      localStorage.setItem("token", data.access);
    }

  } catch (error) {
    console.error("error", error);
  }
  // const data = await axios.post(`${API_URL}/accounts/login/`, {
  //   username: email,
  //   password,
  // });

  // // @ts-expect-error - access is in the response
  // localStorage.setItem("token", data.access);
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/accounts/logout/`);
  localStorage.setItem("token", "");
};

export const register = async ({ email, password }: User): Promise<void> => {

  try {
    const response = await fetch(`${API_URL}/accounts/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status === 400) {
      console.log("error", data);
    } else {
      localStorage.setItem("token", data.access);
    }

  } catch (error) {
    console.error("error", error);
  }
  // const data = await axios.post(`${API_URL}/accounts/register/`, {
  //   username: email,
  //   email,
  //   password,
  // });

  // // @ts-expect-error - access is in the response
  // localStorage.setItem("token", data.access);
};
