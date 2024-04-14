import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import "./Root.css";

export const Root: React.FC = () => {
  const location = useLocation();
  const isFullWidth = location.pathname === "/project_test";

  return (
    <>
      <Header />
      <main className={`${isFullWidth ? "container-fluid" : "container mt-3 mb-5"}`}>
        <Outlet />
      </main>
    </>
  );
};
