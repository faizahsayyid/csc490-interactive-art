import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import "./Root.css";
import { useState } from "react";

export const Root: React.FC = () => {
  const location = useLocation();
  const projectPathRegex = /^\/project\/[^/]+$/;
  const isFullWidth = projectPathRegex.test(location.pathname);
  var isLoggedIn = localStorage.getItem("token") !== null;

  useEffect(() => {
    if (!isLoggedIn && !["/login", "/register"].includes(location.pathname)) {
      window.location.href = "/login";
    
    } else if (isLoggedIn && ["/login", "/register"].includes(location.pathname)) {
      window.location.href = "/";
    }
  }
  , [isLoggedIn, location.pathname]);


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
