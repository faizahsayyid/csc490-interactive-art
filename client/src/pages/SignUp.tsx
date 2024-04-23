import React, { useEffect } from "react";
import { API_URL } from "../api/config";
// import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const SignUp = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update isLoggedIn state
  useEffect(() => {
    console.log("Entering login page");
    if (localStorage.getItem("token")) {
      console.log("token exists, will go from signup to /");
      setIsLoggedIn(true);
    } else {
      console.log("token does not exist, will stay in signup page");
      setIsLoggedIn(false);
    }
  }
  , []);

  // Redirect to home page if logged in
  useEffect(() => {
    if (isLoggedIn) {
      console.log("token exists, navigating to /");
      navigate("/");
    }
  }
  , [isLoggedIn]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    // Call register function from api/auth.ts
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
  
      if (response.status === 400) {
        console.log("error", data);
        if (data.username) {
          alert(`Email: ${data["username"]}`);
        }
        if (data.password) {
          alert(`Password: ${data["password"]}`);
        }
        return;
      } else {
        console.log("register successful");
        localStorage.setItem("token", data.access);
        setIsLoggedIn(true);
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
      <h1 className="text-center h4">Sign Up</h1>
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
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input type="password" className="form-control" id="confirmPassword" />
      </div>
      <button type="submit" className="mt-3 btn btn-primary">
        Submit
      </button>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login">Log In!</Link>
      </p>
    </form>
  );
};
