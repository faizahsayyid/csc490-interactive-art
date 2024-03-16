import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid px-5">
          <Link className="navbar-brand" to="/">
            Interactive Art
          </Link>
          <Link to="/" className="btn btn-secondary">
            Log Out
          </Link>
        </div>
      </nav>
    </header>
  );
};
