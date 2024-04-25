import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import "./Root.css";

export const Root: React.FC = () => {
  const location = useLocation();
  const projectPathRegex = /^\/project\/[^/]+$/;
  const isFullWidth = projectPathRegex.test(location.pathname);
  const isLoggedIn = (localStorage.getItem("token") != '');

  // Redirect to login page if not logged in && not on login or register page
  if (!isLoggedIn && !["/login", "/register"].includes(location.pathname)) {
    console.log("redirecting to login");
    window.location.href = "/login";
    return null;
  
  // Redirect to home page if logged in && on login or register page
  } else if (isLoggedIn && ["/login", "/register"].includes(location.pathname)) {
    console.log("redirecting to home");
    window.location.href = "/";
    return null;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn}/>
      <main
        className={`${isFullWidth ? "container-fluid" : "container mt-3 mb-5"}`}
      >
        <Outlet />
      </main>
    </>
  );
};
