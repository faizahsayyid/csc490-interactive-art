import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useMutation } from "@tanstack/react-query";

type HeaderProps = {
  isLoggedIn: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const logoutMutation = useMutation({ mutationFn: logout });
  const navigate = useNavigate();

  const onLogout = () => {
    logoutMutation.mutate();
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid px-5">
          <Link className="navbar-brand" to="/">
            Interactive Art
          </Link>
          <Link
            className="ms-auto nav-item navbar-link text-light me-3"
            to="/help"
          >
            Help
          </Link>
          {isLoggedIn && (
            <button className="btn btn-secondary" onClick={onLogout}>
              Log Out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
