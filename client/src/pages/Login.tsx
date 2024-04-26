import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api/config";

export const Login = () => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await axios.post(`${API_URL}/accounts/login/`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className="mt-5 card p-4 mx-auto"
      style={{ width: "max(50%, 300px)" }}
      onSubmit={onSubmit}
    >
      <h1 className="text-center h4">Log In</h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input type="email" className="form-control" id="email" />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input type="password" className="form-control" id="password" />
      </div>
      <button type="submit" className="mt-3 btn btn-primary">
        Submit
      </button>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register">Sign Up!</Link>
      </p>
    </form>
  );
};
