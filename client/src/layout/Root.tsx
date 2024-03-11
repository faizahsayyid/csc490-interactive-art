import React from "react";
import { Outlet } from "react-router-dom";

export const Root: React.FC = () => {
  return (
    <>
      <div>Root</div>
      <Outlet />
    </>
  );
};
