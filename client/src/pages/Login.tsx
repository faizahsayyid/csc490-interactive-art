import React from "react";
// import { login } from "../api/auth";
// import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API_URL } from "../api/config";

export const Login = () => {

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

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
  
      if (response.status === 400) {
        console.log("error", data);
        alert(data["message"]);
        return;
  
      } else {
        console.log(data);
        localStorage.setItem("token", data.access);
        return;
      }
  
    } catch (error) {
      console.error("error", error);
      return;
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
