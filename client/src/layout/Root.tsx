import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Root: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container mt-3 mb-5">
        <Outlet />
      </main>
    </>
  );
};
