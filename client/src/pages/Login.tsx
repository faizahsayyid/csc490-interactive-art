import React from "react";
import { login } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export const Login = () => {
  const loginMutation = useMutation({ mutationFn: login });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    loginMutation.mutate({ email, password });
  }

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
