import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import "./Root.css";

export const Root: React.FC = () => {
  const location = useLocation();
  const projectPathRegex = /^\/project\/[^/]+$/;
  const isFullWidth = projectPathRegex.test(location.pathname);

  // console.log("token: ", localStorage.getItem("token"));
  const isLoggedIn = (localStorage.getItem("token") != '');
  // console.log("isLoggedIn: ", isLoggedIn);


  // // Redirect to login page if not logged in
  // if (!isLoggedIn && !["/login", "/register"].includes(location.pathname)) {
  //   window.location.href = "/login";
  //   return null;
  
  // // Redirect to home page if logged in && on login or register page
  // } else if (
  //   isLoggedIn &&
  //   ["/login", "/register"].includes(location.pathname)
  
  // // Redirect to home page if not logged in && on home page
  // ) {
  //   window.location.href = "/";
  //   return null;
  // }

  return (
    <>
      <Header isLoggedIn={isLoggedIn}/>
      {/* <Header /> */}
      <main
        className={`${isFullWidth ? "container-fluid" : "container mt-3 mb-5"}`}
      >
        <Outlet />
      </main>
    </>
  );
};
